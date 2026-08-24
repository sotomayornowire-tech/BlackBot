// Simple rule-based AI (no external APIs)
const responses = [
  { keys: ['hola', 'hi', 'hey', 'buenas'], reply: '¡Hola! Soy BlackBot. ¿En qué te puedo ayudar?' },
  { keys: ['adios', 'bye', 'chao'], reply: '¡Hasta luego! 👋' },
  { keys: ['gracias', 'thanks'], reply: '¡De nada! 😎' },
  { keys: ['quien eres', 'quién eres', 'que eres'], reply: 'Soy BlackBot, un bot de Discord con comandos, tickets e IA simple.' },
  { keys: ['ayuda', 'help', 'comandos'], reply: 'Usa /help para ver todos los comandos.' },
  { keys: ['ping'], reply: 'Pong! 🏓' },
  { keys: ['ticket'], reply: 'Usa /ticket para abrir un ticket de soporte.' },
  { keys: ['como estas', 'cómo estás'], reply: '¡Todo bien! Listo para ayudarte.' },
  { keys: ['chiste', 'joke'], reply: '¿Por qué el bot fue al médico? Porque tenía un bug. 🐛' },
  { keys: ['hora', 'time'], reply: () => `Son las ${new Date().toLocaleTimeString('es-ES')}` }
];

function getResponse(text) {
  const lower = text.toLowerCase().trim();
  for (const r of responses) {
    if (r.keys.some(k => lower.includes(k))) {
      return typeof r.reply === 'function' ? r.reply() : r.reply;
    }
  }
  // Fallback simple
  if (lower.length < 3) return '¿Podrías decirme más?';
  return 'No estoy seguro de entender. Prueba /help o pregunta otra cosa.';
}

module.exports = { getResponse };
