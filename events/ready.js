const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`BlackBot online as ${client.user.tag}`);
    client.user.setActivity('BlackBot | /help', { type: 3 }); // Watching
  }
};
