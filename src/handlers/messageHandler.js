import { findCommand } from '../commands/index.js';
import { isAllowed } from '../middlewares/auth.js';

export async function handleMessage(sock, msg) {
  if (!msg.message) return;

const chatId = msg.key.remoteJid;
console.log('[DEBUG] chatId:', chatId, 'tipe:', typeof chatId);
  const isGroup = chatId.endsWith('@g.us');
  const senderJid = isGroup ? msg.key.participant : msg.key.remoteJid;
  let senderNumber = senderJid?.split('@')[0]?.split(':')[0];

  // Kalau pesan dari diri sendiri, anggap owner
  if (msg.key.fromMe) {
    senderNumber = process.env.OWNER_NUMBER;
  }

  // Handle LID: kalau sender adalah bot sendiri, anggap owner
  const botNumber = sock.user?.id?.split(':')[0]?.split('@')[0];
  if (senderNumber === botNumber) {
    senderNumber = process.env.OWNER_NUMBER;
  }

  // Ambil teks pesan
  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    '';

  if (!text) return;

  const prefix = process.env.BOT_PREFIX || '.';
  if (!text.startsWith(prefix)) return;

  const args = text.slice(prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();

  // Cek izin
  const auth = isAllowed(senderNumber, chatId, isGroup);
  if (!auth.allowed) return;

  const command = findCommand(cmdName);
  if (!command) return;

  if (command.ownerOnly && senderNumber !== process.env.OWNER_NUMBER) {
    return;
  }

  try {
    await command.execute(sock, msg, args, chatId, isGroup);
  } catch (err) {
    console.error(`[ERROR] ${cmdName}:`, err.message);
  }
}

