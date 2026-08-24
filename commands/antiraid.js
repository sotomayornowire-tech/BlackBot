const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'antiraid.json');

function load() {
  if (!fs.existsSync(configPath)) return {};
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}
function save(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Configurar protección anti-raid')
    .addSubcommand(s => s.setName('enable').setDescription('Activar anti-raid'))
    .addSubcommand(s => s.setName('disable').setDescription('Desactivar anti-raid'))
    .addSubcommand(s => s
      .setName('config')
      .setDescription('Ajustar límites')
      .addIntegerOption(o => o.setName('joins').setDescription('Joins máximos en 10s (default 5)').setMinValue(2).setMaxValue(20))
      .addIntegerOption(o => o.setName('mentions').setDescription('Menciones máximas por msg (default 5)').setMinValue(2).setMaxValue(15)))
    .addSubcommand(s => s.setName('status').setDescription('Ver estado'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();
    const gid = interaction.guild.id;
    const cfg = load();
    if (!cfg[gid]) cfg[gid] = { enabled: false, maxJoins: 5, maxMentions: 5 };

    if (sub === 'enable') {
      cfg[gid].enabled = true;
      save(cfg);
      client.antiraid = client.antiraid || {};
      client.antiraid[gid] = cfg[gid];
      await interaction.reply('🛡️ Anti-raid **activado**.');
    } else if (sub === 'disable') {
      cfg[gid].enabled = false;
      save(cfg);
      if (client.antiraid) client.antiraid[gid] = cfg[gid];
      await interaction.reply('🛡️ Anti-raid **desactivado**.');
    } else if (sub === 'config') {
      const joins = interaction.options.getInteger('joins');
      const mentions = interaction.options.getInteger('mentions');
      if (joins) cfg[gid].maxJoins = joins;
      if (mentions) cfg[gid].maxMentions = mentions;
      save(cfg);
      if (client.antiraid) client.antiraid[gid] = cfg[gid];
      await interaction.reply(`⚙️ Config: maxJoins=${cfg[gid].maxJoins}/10s | maxMentions=${cfg[gid].maxMentions}`);
    } else if (sub === 'status') {
      const c = cfg[gid];
      const embed = new EmbedBuilder()
        .setTitle('🛡️ Anti-raid status')
        .setColor(c.enabled ? 0x00ff00 : 0xff0000)
        .addFields(
          { name: 'Estado', value: c.enabled ? 'Activo' : 'Inactivo', inline: true },
          { name: 'Max joins/10s', value: String(c.maxJoins), inline: true },
          { name: 'Max mentions/msg', value: String(c.maxMentions), inline: true }
        );
      await interaction.reply({ embeds: [embed] });
    }
  }
};
