const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsar a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a expulsar').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: 'No puedo expulsar a ese usuario.', ephemeral: true });
    await member.kick(reason);
    await interaction.reply(`👢 ${user.tag} expulsado. Razón: ${reason}`);
  }
};
