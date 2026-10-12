import { listGroups, addGroup, removeGroup, allowedGroups } from '../config/groups.js';
import { isOwner } from '../middlewares/auth.js';

export default {
  name: 'group',
  aliases: ['groups'],
  ownerOnly: true,
  async execute(sock, msg, args, chatId, isGroup) {
    const sender = msg.key.participant || msg.key.remoteJid;

    if (!isOwner(sender.split('@')[0])) {
      return sock.sendMessage(chatId, { text: '❌ Lu bukan owner.' });
    }

    if (args.length === 0) {
      const groups = listGroups();
      if (groups.length === 0) {
        return sock.sendMessage(chatId, { text: '📭 Belum ada grup yang di-connect.' });
      }
      let text = '📋 *Daftar Grup Terhubung*\n\n';
      for (const [id, cfg] of groups) {
        text += `• ${cfg.name || 'Tanpa nama'}\n`;
        text += `  ID: ${id}\n`;
        text += `  Status: ${cfg.active ? '✅ ON' : '❌ OFF'}\n\n`;
      }
      return sock.sendMessage(chatId, { text });
    }

    const action = args[0]?.toLowerCase();
    const targetId = args[1];

    if (!targetId || !targetId.endsWith('@g.us')) {
      return sock.sendMessage(chatId, { text: '❌ Format: .group on <groupId> atau .group off <groupId>' });
    }

    if (action === 'on') {
      const existing = allowedGroups.get(targetId);
      if (existing) {
        existing.active = true;
      } else {
        addGroup(targetId);
      }
      return sock.sendMessage(chatId, { text: `✅ Grup ${targetId} diaktifkan.` });
    }

    if (action === 'off') {
      const existing = allowedGroups.get(targetId);
      if (existing) {
        existing.active = false;
        return sock.sendMessage(chatId, { text: `⏸️ Grup ${targetId} dinonaktifkan.` });
      } else {
        return sock.sendMessage(chatId, { text: `⚠️ Grup belum terdaftar.` });
      }
    }

    if (action === 'add') {
      addGroup(targetId);
      return sock.sendMessage(chatId, { text: `➕ Grup ${targetId} ditambahkan ke whitelist.` });
    }

    if (action === 'remove') {
      removeGroup(targetId);
      return sock.sendMessage(chatId, { text: `➖ Grup ${targetId} dihapus dari whitelist.` });
    }

    return sock.sendMessage(chatId, { text: '❌ Perintah tidak dikenal.' });
  },
};
