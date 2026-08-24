const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silenciar (timeout) a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addIntegerOption(o => o.setName('minutos').setDescription('Duración en minutos (1-40320)').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const minutes = interaction.options.getInteger('minutos');
    const reason = interaction.options.getString('razon') || 'Sin razón';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: 'No puedo silenciar a ese usuario.', ephemeral: true });
    await member.timeout(minutes * 60 * 1000, reason);
    await interaction.reply(`🔇 ${user.tag} silenciado ${minutes} min. Razón: ${reason}`);
  }
};
