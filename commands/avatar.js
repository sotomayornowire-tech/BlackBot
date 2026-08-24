const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setColor(0x000000);
    await interaction.reply({ embeds: [embed] });
  }
};
