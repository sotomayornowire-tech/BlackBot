const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'honeypot.json');

function loadConfig() {
  if (!fs.existsSync(configPath)) return {};
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function saveConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('honeypot')
    .setDescription('Configurar canal trampa para cuentas comprometidas')
    .addSubcommand(s => s
      .setName('setup')
      .setDescription('Crear/configurar canal honeypot')
      .addChannelOption(o => o.setName('canal').setDescription('Canal existente (opcional)').addChannelTypes(ChannelType.GuildText)))
    .addSubcommand(s => s
      .setName('disable')
      .setDescription('Desactivar honeypot'))
    .addSubcommand(s => s
      .setName('status')
      .setDescription('Ver estado del honeypot'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const config = loadConfig();

    if (sub === 'setup') {
      let channel = interaction.options.getChannel('canal');
      if (!channel) {
        channel = await interaction.guild.channels.create({
          name: 'verificacion-staff',
          type: ChannelType.GuildText,
          topic: '⚠️ Canal trampa - NO escribas aquí si no eres staff',
          permissionOverwrites: [
            { id: interaction.guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
            { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] }
          ]
        });
      }
      config[guildId] = { channelId: channel.id };
      saveConfig(config);
      client.honeypot = client.honeypot || {};
      client.honeypot[guildId] = channel.id;

      const embed = new EmbedBuilder()
        .setTitle('🍯 Honeypot activo')
        .setDescription(`Canal trampa: ${channel}\nCualquier mensaje de no-staff → ban automático + log.`)
        .setColor(0x000000);
      await interaction.reply({ embeds: [embed] });
    } else if (sub === 'disable') {
      delete config[guildId];
      saveConfig(config);
      if (client.honeypot) delete client.honeypot[guildId];
      await interaction.reply('🍯 Honeypot desactivado.');
    } else if (sub === 'status') {
      const chId = config[guildId]?.channelId;
      await interaction.reply(chId ? `🍯 Activo en <#${chId}>` : '🍯 No configurado.');
    }
  }
};
