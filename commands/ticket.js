const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abrir un ticket de soporte'),
  async execute(interaction, client) {
    const existing = interaction.guild.channels.cache.find(
      c => c.name === `ticket-${interaction.user.id}` && c.type === ChannelType.GuildText
    );
    if (existing) {
      return interaction.reply({ content: `Ya tienes un ticket: ${existing}`, flags: MessageFlags.Ephemeral });
    }

    let parent = process.env.TICKET_CATEGORY_ID || null;
    // Validar que sea categoría
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
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
      ]
    });

    client.tickets.set(channel.id, interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle('🎫 Ticket abierto')
      .setDescription(`Hola ${interaction.user}, describe tu problema.\nStaff te atenderá pronto.\nUsa /close para cerrar.`)
      .setColor(0x000000);

    await channel.send({ content: `${interaction.user}`, embeds: [embed] });
    await interaction.reply({ content: `Ticket creado: ${channel}`, flags: MessageFlags.Ephemeral });
  }
};