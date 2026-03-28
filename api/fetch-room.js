module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Parameter username wajib diisi.' });
  }

  const cleanUser = username.replace('@', '').trim();

  try {
    const response = await fetch(`https://www.tiktok.com/@${cleanUser}/live`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        'Referer': 'https://www.tiktok.com/',
      },
      redirect: 'follow',
    });

    const html = await response.text();

    // Coba berbagai pola untuk extract room ID
    const patterns = [
      /"roomId"\s*:\s*"(\d+)"/,
      /"room_id"\s*:\s*"(\d+)"/,
      /roomId=(\d+)/,
      /"liveRoomId"\s*:\s*"(\d+)"/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return res.json({
          success: true,
          username: cleanUser,
          roomId: match[1],
        });
      }
    }

    return res.status(404).json({
      success: false,
      error: `@${cleanUser} sedang tidak live atau room ID tidak ditemukan.`,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Gagal mengambil data: ' + err.message,
    });
  }
};
