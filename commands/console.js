const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('console')
    .setDescription('Ver últimas líneas de la consola/log')
    .addIntegerOption(o => o.setName('lineas').setDescription('Cantidad (default 15)').setMinValue(5).setMaxValue(50))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const lines = interaction.options.getInteger('lineas') || 15;
    const logPath = path.join(__dirname, '..', 'console.log');
    if (!fs.existsSync(logPath)) {
      return interaction.reply({ content: 'No hay logs aún.', ephemeral: true });
    }
    const content = fs.readFileSync(logPath, 'utf8').trim().split('\n').slice(-lines).join('\n');
    const text = content.length > 1900 ? content.slice(-1900) : content;
    await interaction.reply({ content: '```\n' + (text || 'Vacío') + '\n```', ephemeral: true });
  }
};
