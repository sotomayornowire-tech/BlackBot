const { getResponse } = require('../utils/ai');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    // --- Honeypot ---
    const hpPath = path.join(__dirname, '..', 'honeypot.json');
    let hpChannel = client.honeypot?.[message.guild.id];
    if (!hpChannel && fs.existsSync(hpPath)) {
      const cfg = JSON.parse(fs.readFileSync(hpPath, 'utf8'));
      hpChannel = cfg[message.guild.id]?.channelId;
    }
    if (hpChannel && message.channel.id === hpChannel) {
      const isStaff = message.member.permissions.has(PermissionFlagsBits.ManageMessages) ||
                      message.member.permissions.has(PermissionFlagsBits.Administrator);
      if (!isStaff) {
        try {
          await message.member.ban({ reason: 'BlackBot Honeypot: canal trampa (cuenta comprometida?)' });
          logger.warn(`Honeypot BAN: ${message.author.tag} en ${message.guild.name}`);
          await message.delete().catch(() => {});
        } catch (e) {
          logger.error('Honeypot ban failed: ' + e.message);
        }
        return;
      }
    }

    // --- Anti-raid: mass mentions ---
    const arPath = path.join(__dirname, '..', 'antiraid.json');
    let arCfg = client.antiraid?.[message.guild.id];
    if (!arCfg && fs.existsSync(arPath)) {
      const data = JSON.parse(fs.readFileSync(arPath, 'utf8'));
      arCfg = data[message.guild.id];
    }
    if (arCfg?.enabled) {
      const maxMentions = arCfg.maxMentions || 5;
      const mentions = message.mentions.users.size + message.mentions.roles.size;
      if (mentions >= maxMentions && !message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        try {
          await message.delete();
          await message.member.timeout(10 * 60 * 1000, 'BlackBot Anti-raid: mass mentions');
          logger.warn(`Anti-raid timeout (mentions): ${message.author.tag}`);
        } catch {}
        return;
      }
    }

    // --- AI ---
    const content = message.content.toLowerCase();
    const mentioned = message.mentions.has(client.user);
    const called = content.startsWith('blackbot') || content.startsWith('bb ');

    if (mentioned || called) {
      const text = message.content
        .replace(/<@!?\d+>/g, '')
        .replace(/^blackbot\s*/i, '')
        .replace(/^bb\s*/i, '')
        .trim();
      if (!text) {
        await message.reply('¡Hola! Escríbeme algo o usa /help.');
        return;
      }
      const reply = getResponse(text);
      await message.reply(reply);
      logger.debug(`AI reply to ${message.author.tag}: ${text.slice(0, 50)}`);
    }
  }
};
