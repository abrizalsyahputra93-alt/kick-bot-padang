import { readFile } from 'fs/promises';

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'No code' });

  const env = await readFile('.env', 'utf-8');
  const config = {};
  env.split('\n').forEach(line => {
    if (line.includes('=')) {
      const [k, v] = line.split('=');
      config[k.trim()] = v.trim();
    }
  });

  const response = await fetch('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.VITE_KICK_CLIENT_ID,
      client_secret: config.KICK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.VITE_KICK_REDIRECT_URI,
    }),
  });

  const data = await response.json();
  res.json(data);
}
