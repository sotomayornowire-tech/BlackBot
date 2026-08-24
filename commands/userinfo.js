const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Información de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const embed = new EmbedBuilder()
      .setTitle(`Info de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .setColor(0x000000)
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Creado', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Bot', value: user.bot ? 'Sí' : 'No', inline: true }
      );
    if (member) {
      embed.addFields(
        { name: 'Entró', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Roles', value: member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).join(' ') || 'Ninguno' }
      );
    }
    await interaction.reply({ embeds: [embed] });
  }
};
