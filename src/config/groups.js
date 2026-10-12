// Konfigurasi whitelist grup
export const allowedGroups = new Map();

export function addGroup(groupId, groupName = '') {
  allowedGroups.set(groupId, { name: groupName, active: true });
}

export function removeGroup(groupId) {
  allowedGroups.delete(groupId);
}

export function isGroupAllowed(groupId) {
  return allowedGroups.has(groupId);
}

export function listGroups() {
  return Array.from(allowedGroups.entries());
}
