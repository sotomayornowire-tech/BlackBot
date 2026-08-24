const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Quitar silencio (timeout) a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: 'No puedo quitar el silencio.', ephemeral: true });
    await member.timeout(null, reason);
    await interaction.reply(`🔊 ${user.tag} ya no está silenciado. Razón: ${reason}`);
  }
};
