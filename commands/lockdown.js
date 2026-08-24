const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Bloquear todos los canales de texto (anti-raid)')
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply();
    const reason = interaction.options.getString('razon') || 'Lockdown anti-raid';
    let count = 0;
    for (const [, channel] of interaction.guild.channels.cache) {
      if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement) {
        try {
          await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }, { reason });
          count++;
        } catch {}
      }
    }
    await interaction.editReply(`🔒 Lockdown activado en ${count} canales. Razón: ${reason}`);
  }
};
