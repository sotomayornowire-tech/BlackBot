const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banear a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a banear').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: 'No puedo banear a ese usuario.', ephemeral: true });
    await member.ban({ reason });
    await interaction.reply(`🔨 ${user.tag} baneado. Razón: ${reason}`);
  }
};
