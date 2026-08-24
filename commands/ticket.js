const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abrir un ticket de soporte'),
  async execute(interaction, client) {
    const existing = interaction.guild.channels.cache.find(
      c => c.name === `ticket-${interaction.user.id}` && c.type === ChannelType.GuildText
    );
    if (existing) {
      return interaction.reply({ content: `Ya tienes un ticket: ${existing}`, ephemeral: true });
    }

    const categoryId = process.env.TICKET_CATEGORY_ID || null;
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.id}`,
      type: ChannelType.GuildText,
      parent: categoryId || undefined,
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
    await interaction.reply({ content: `Ticket creado: ${channel}`, ephemeral: true });
  }
};
