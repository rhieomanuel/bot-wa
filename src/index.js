import 'dotenv/config';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { handleMessage } from './handlers/messageHandler.js';
import { protectSocket } from './utils/antiban.js';

const PHONE = process.env.PHONE_NUMBER;

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const { version } = await fetchLatestBaileysVersion();

  let sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
  });

// sock = protectSocket(sock); // test tanpa antiban

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, qr, lastDisconnect }) => {
    if (qr && !sock.authState.creds.registered) {
      try {
        const code = await sock.requestPairingCode(PHONE);
        console.log(`\n🔑 Pairing Code: ${code}\n`);
      } catch (err) {
        console.error('❌ Gagal minta pairing code:', err.message);
      }
    }

    if (connection === 'open') {
      console.log('✅ Bot terhubung!');
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log('🔄 Reconnecting...');
        start();
      } else {
        console.log('🚪 Logged out.');
      }
    }
  });

sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  if (!msg?.message) return;

    // Kalau pesan dari diri sendiri, proses kalau di self chat ATAU di grup
    if (msg.key.fromMe) {
      const myJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isSelfChat = msg.key.remoteJid === myJid;
      const isGroup = msg.key.remoteJid?.endsWith('@g.us');
      if (!isSelfChat && !isGroup) return;
    }

    await handleMessage(sock, msg);
  });
}

start().catch(console.error);
