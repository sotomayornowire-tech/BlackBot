const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // --- Slash commands ---
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
        logger.info(`/${interaction.commandName} by ${interaction.user.tag}`);
      } catch (err) {
        logger.error(`Error in /${interaction.commandName}: ${err.message}`);
        const reply = { content: 'Error al ejecutar el comando.', flags: MessageFlags.Ephemeral };
        if (interaction.replied || interaction.deferred) await interaction.followUp(reply);
        else await interaction.reply(reply);
      }
      return;
    }

    // --- Botones ---
    if (!interaction.isButton()) return;

    // Crear ticket
    if (interaction.customId === 'ticket_create') {
      const existing = interaction.guild.channels.cache.find(
        c => c.name === `ticket-${interaction.user.id}` && c.type === ChannelType.GuildText
      );
      if (existing) {
        return interaction.reply({ content: `Ya tienes un ticket: ${existing}`, flags: MessageFlags.Ephemeral });
      }

      let parent = process.env.TICKET_CATEGORY_ID || null;
      if (parent) {
        const cat = interaction.guild.channels.cache.get(parent);
        if (!cat || cat.type !== ChannelType.GuildCategory) parent = null;
      }

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.id}`,
        type: ChannelType.GuildText,
        parent: parent || undefined,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
          { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
        ]
      });

      client.tickets.set(channel.id, interaction.user.id);

      const embed = new EmbedBuilder()
        .setTitle('🎫 Ticket abierto')
        .setDescription(`Hola ${interaction.user}, describe tu problema.\nStaff te atenderá pronto.`)
        .setColor(0x000000);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_close')
          .setLabel('Cerrar Ticket')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );

      await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
      await interaction.reply({ content: `Ticket creado: ${channel}`, flags: MessageFlags.Ephemeral });
      return;
    }

    // Cerrar ticket
    if (interaction.customId === 'ticket_close') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        return interaction.reply({ content: 'Este no es un ticket.', flags: MessageFlags.Ephemeral });
      }
      const isOwner = client.tickets.get(interaction.channel.id) === interaction.user.id;
      const isMod = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels);
      if (!isOwner && !isMod) {
        return interaction.reply({ content: 'No puedes cerrar este ticket.', flags: MessageFlags.Ephemeral });
      }
      await interaction.reply('Cerrando en 3 segundos...');
      setTimeout(() => {
        client.tickets.delete(interaction.channel.id);
        interaction.channel.delete().catch(() => {});
      }, 3000);
    }
  }
};