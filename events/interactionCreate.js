const logger = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
      logger.info(`/${interaction.commandName} by ${interaction.user.tag}`);
    } catch (err) {
      logger.error(`Error in /${interaction.commandName}: ${err.message}`);
      const reply = { content: 'Error al ejecutar el comando.', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(reply);
      else await interaction.reply(reply);
    }
  }
};
