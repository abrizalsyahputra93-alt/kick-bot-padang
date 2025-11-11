import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({error:'Code OAuth tidak ditemukan'});

  const CLIENT_ID = process.env.VITE_KICK_CLIENT_ID;
  const CLIENT_SECRET = process.env.KICK_CLIENT_SECRET;
  const REDIRECT_URI = process.env.VITE_KICK_REDIRECT_URI;

  try {
    const response = await fetch('https://kick.com/oauth/token', {
      method:'POST',
      headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type:'authorization_code',
        redirect_uri:REDIRECT_URI
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({error:err.message});
  }
}
