# BlackBot v1.1

Bot de Discord con comandos básicos, moderación, tickets, anti-raid, honeypot e IA simple (sin APIs).

## Requisitos
- Node.js 18+
- Token de bot (intents: Guilds, GuildMessages, GuildMembers, MessageContent, GuildModeration)

## Instalación
1. Copia `.env.example` → `.env` y rellena `TOKEN`, `CLIENT_ID`, `GUILD_ID` (opcional)
2. `npm install`
3. `node deploy-commands.js`
4. `npm start`

## Comandos

### Utilidad
`/ping` `/help` `/userinfo` `/serverinfo` `/avatar`

### Moderación
`/ban` `/unban` `/kick` `/mute` `/unmute` `/clear`

### Anti-raid (estilo RB3 Guard)
- `/lockdown` – bloquea todos los canales de texto
- `/unlock` – desbloquea
- `/antiraid enable|disable|config|status` – protege contra mass join y mass mentions
- `/honeypot setup|disable|status` – canal trampa: quien escriba (no-staff) → ban automático

### Tickets
`/ticket` `/close`

### Admin
`/console` – ver logs

### IA
Menciona al bot o escribe `blackbot` / `bb` + mensaje

## Notas
- Honeypot y antiraid guardan config en `honeypot.json` y `antiraid.json`
- Edita `utils/ai.js` para más respuestas de IA
