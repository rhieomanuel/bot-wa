import { wrapSocket } from 'baileys-antiban';

export function protectSocket(rawSock) {
  const sock = wrapSocket(rawSock, {
    maxPerMinute: 8,
    maxPerHour: 200,
    maxPerDay: 1500,
    warmUpEnabled: true,
    warmUpDays: 7,
  });
  return sock;
}
