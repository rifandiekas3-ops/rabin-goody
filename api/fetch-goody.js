module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { roomId, sessionId, msToken } = req.query;

  if (!roomId) {
    return res.status(400).json({ error: 'Parameter roomId wajib diisi.' });
  }

  if (!sessionId) {
    return res.status(401).json({
      error: 'Session token diperlukan. Masukkan sessionid TikTok kamu di Settings.',
    });
  }

  try {
    const url = `https://webcast.tiktok.com/webcast/gift/live_goody_bag/detail/?room_id=${roomId}&aid=1988`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Cookie': `sessionid=${sessionId};${msToken ? ` ms_token=${msToken};` : ''}`,
        'Referer': 'https://www.tiktok.com/',
        'Origin': 'https://www.tiktok.com',
      },
    });

    const data = await response.json();

    if (data && data.data) {
      return res.json({ success: true, ...data });
    }

    return res.status(400).json({
      success: false,
      error: 'Goody Bag tidak ditemukan atau session tidak valid.',
      raw: data,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data: ' + err.message,
    });
  }
};
