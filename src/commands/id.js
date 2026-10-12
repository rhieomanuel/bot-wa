export default {
  name: 'id',
  async execute(sock, msg, args, chatId, isGroup) {
    const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
    let text = `📋 *Info Chat*\n\n`;
    text += `Chat ID: \`${chatId}\`\n`;
    text += `Sender: \`${sender}\`\n`;
    text += `Tipe: ${isGroup ? 'Grup' : 'Pribadi'}\n`;
    await sock.sendMessage(chatId, { text });
  },
}

