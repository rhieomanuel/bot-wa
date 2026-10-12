import { isGroupAllowed, allowedGroups } from '../config/groups.js';
import 'dotenv/config';

const OWNER = process.env.OWNER_NUMBER;
const MODE = process.env.MODE || 'private';

export function isOwner(senderNumber) {
  return senderNumber === OWNER;
}

export function isAllowed(senderNumber, chatId, isGroup) {
  if (isOwner(senderNumber)) return { allowed: true };

  if (MODE === 'private' && !isGroup) {
    return { allowed: false, reason: 'private_mode' };
  }

  if (isGroup) {
    if (!isGroupAllowed(chatId)) {
      return { allowed: false, reason: 'group_not_allowed' };
    }
    const groupConfig = allowedGroups.get(chatId);
    if (groupConfig && groupConfig.active === false) {
      return { allowed: false, reason: 'group_inactive' };
    }
  }

  return { allowed: true };
}
