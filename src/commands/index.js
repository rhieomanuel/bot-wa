import menu from './menu.js';
import downloader from './downloader.js';
import groupControl from './groupControl.js';
import id from './id.js';

export const commands = [menu, downloader, groupControl, id];

export function findCommand(cmdName) {
  return commands.find(
    c => c.name === cmdName || (c.aliases && c.aliases.includes(cmdName))
  );
}

