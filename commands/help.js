const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lista de comandos de BlackBot'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🖤 BlackBot - Comandos')
      .setColor(0x000000)
      .setDescription('Comandos disponibles:')
      .addFields(
        { name: 'Utilidad', value: '`/ping` `/help` `/userinfo` `/serverinfo` `/avatar`' },
        { name: 'Moderación', value: '`/ban` `/unban` `/kick` `/mute` `/unmute` `/clear`' },
        { name: 'Anti-raid', value: '`/lockdown` `/unlock` `/antiraid` `/honeypot`' },
        { name: 'Tickets', value: '`/ticket` `/close`' },
        { name: 'Admin', value: '`/console`' },
        { name: 'IA', value: 'Menciona al bot o escribe `blackbot` / `bb` + mensaje' }
      )
      .setFooter({ text: 'BlackBot v1.1 | Anti-raid + Honeypot' });
    await interaction.reply({ embeds: [embed] });
  }
};
