const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const joinTracker = new Map(); // guildId -> timestamps[]

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const gid = member.guild.id;
    const cfg = (client.antiraid && client.antiraid[gid]) || (() => {
      const p = path.join(__dirname, '..', 'antiraid.json');
      if (!fs.existsSync(p)) return null;
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      return data[gid];
    })();

    if (!cfg || !cfg.enabled) return;

    const now = Date.now();
    if (!joinTracker.has(gid)) joinTracker.set(gid, []);
    const times = joinTracker.get(gid).filter(t => now - t < 10000);
    times.push(now);
    joinTracker.set(gid, times);

    if (times.length >= (cfg.maxJoins || 5)) {
      logger.warn(`Anti-raid: mass join detectado en ${member.guild.name} (${times.length} joins/10s)`);
      try {
        await member.ban({ reason: 'BlackBot Anti-raid: mass join' });
        logger.info(`Baneado por mass join: ${member.user.tag}`);
      } catch (e) {
        logger.error('No se pudo banear en mass join: ' + e.message);
      }
    }
  }
};
