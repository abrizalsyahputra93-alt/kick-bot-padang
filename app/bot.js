import { createClient } from '@retconned/kick-js';

let clients = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { channel, token } = req.body;
  if (!channel || !token) return res.status(400).json({ error: 'Missing data' });

  try {
    const client = createClient(channel, { logger: false });
    await client.login({ type: 'tokens', credentials: { bearerToken: token } });

    client.on('ready', () => {
      client.say('Bot test dari Padang aktif! Coba !jam');
    });

    client.on('ChatMessage', async (msg) => {
      const text = msg.content.trim().toLowerCase();
      const user = msg.sender.username;
      if (text === '!hello') await client.say(`Halo @${user}!`);
      if (text === '!jam') {
        const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        await client.say(`Jam di Padang: ${time} WIB`);
      }
      if (text === '!padang') await client.say('Rendang terbaik dari Sumbar!');
    });

    await client.join();
    clients[channel] = client;
    res.json({ message: `Bot aktif di #${channel}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
