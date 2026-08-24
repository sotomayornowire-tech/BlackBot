const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Información del servidor'),
  async execute(interaction) {
    const g = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(g.name)
      .setThumbnail(g.iconURL())
      .setColor(0x000000)
      .addFields(
        { name: 'Dueño', value: `<@${g.ownerId}>`, inline: true },
        { name: 'Miembros', value: `${g.memberCount}`, inline: true },
        { name: 'Canales', value: `${g.channels.cache.size}`, inline: true },
        { name: 'Creado', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'ID', value: g.id, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
