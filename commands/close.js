const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Cerrar el ticket actual'),
  async execute(interaction, client) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: 'Este no es un canal de ticket.', ephemeral: true });
    }
    const isOwner = client.tickets.get(interaction.channel.id) === interaction.user.id;
    const isMod = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels);
    if (!isOwner && !isMod) {
      return interaction.reply({ content: 'No puedes cerrar este ticket.', ephemeral: true });
    }
    await interaction.reply('Cerrando ticket en 3 segundos...');
    setTimeout(() => {
      client.tickets.delete(interaction.channel.id);
      interaction.channel.delete().catch(() => {});
    }, 3000);
  }
};
