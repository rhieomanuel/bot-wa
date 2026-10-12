export default {
  name: 'menu',
  async execute(sock, msg, args, chatId, isGroup) {
    const menu = `╭───「 *${process.env.BOT_NAME || 'MyBot'}* 」───
│
│ 📥 *Downloader*
│ .yt <url>  — YouTube
│ .tiktok <url> — TikTok
│ .ig <url> — Instagram
│
│ 👥 *Grup*
│ .group — Kelola grup
│
│ ⚙️ *Owner*
│ .group on/off <id>
│
╰───────────────────`;
    await sock.sendMessage(chatId, { text: menu });
  },
};
