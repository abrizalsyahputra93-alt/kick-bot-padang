import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diperbolehkan' });
  }

  const { channel, token } = req.body;
  if (!channel || !token) {
    return res.status(400).json({ error: 'Channel dan token harus diisi' });
  }

  try {
    // Contoh kirim pesan ke channel
    const response = await fetch(`https://kick.com/api/v2/messages/send/${channel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'Bot aktif! Ketik !hello, !jam, atau !padang'
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: errData.message || 'Gagal kirim pesan' });
    }

    res.status(200).json({ message: 'Bot aktif di channel ' + channel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
