const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanear a un usuario')
    .addStringOption(o => o.setName('id').setDescription('ID del usuario').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const id = interaction.options.getString('id');
    const reason = interaction.options.getString('razon') || 'Sin razón';
    try {
      await interaction.guild.members.unban(id, reason);
      await interaction.reply(`✅ Usuario \`${id}\` desbaneado. Razón: ${reason}`);
    } catch {
      await interaction.reply({ content: 'No se pudo desbanear (ID inválido o no baneado).', ephemeral: true });
    }
  }
};
