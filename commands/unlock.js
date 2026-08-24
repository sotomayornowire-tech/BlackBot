const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Desbloquear todos los canales de texto')
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply();
    const reason = interaction.options.getString('razon') || 'Fin de lockdown';
    let count = 0;
    for (const [, channel] of interaction.guild.channels.cache) {
      if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement) {
        try {
          await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null }, { reason });
          count++;
        } catch {}
      }
    }
    await interaction.editReply(`🔓 Unlock en ${count} canales. Razón: ${reason}`);
  }
};
