export default {
  name: 'dl',
  aliases: ['download', 'yt', 'tiktok', 'ig'],
  async execute(sock, msg, args, chatId, isGroup) {
    const url = args[0];
    if (!url) {
      return sock.sendMessage(chatId, { text: '❌ Kasih link. Contoh: .tiktok <url>' });
    }

    await sock.sendMessage(chatId, { text: '⏳ Memproses...' });

    try {
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
      const json = await res.json();

      if (json.code !== 0 || !json.data) {
        throw new Error(json.msg || 'Gagal dapetin video');
      }

      const videoUrl = json.data.hdplay || json.data.play;
      const title = json.data.title || 'Video TikTok';
      const author = json.data.author?.unique_id || '-';

      await sock.sendMessage(chatId, {
        video: { url: videoUrl },
        caption: `✅ ${title}\n👤 @${author}`,
      });

    } catch (err) {
      await sock.sendMessage(chatId, { text: `❌ Gagal: ${err.message}` });
    }
  },
};
