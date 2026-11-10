export const TARGET='Schiefer Turm von Pisa';
export function parsePosition(value){const s=String(value).trim();if(!/^(?:[1-9]\d?|100)$/.test(s))return null;return Number(s);}
export function applyPosition(original,position){const next=[...original];if(parsePosition(position)===null)return next;const from=next.indexOf(TARGET);if(from<0||position>next.length)return next;[next[from],next[position-1]]=[next[position-1],next[from]];return next;}
export function readPosition(storage){try{return parsePosition(storage.getItem('notizen.position'));}catch{return null;}}
export function savePosition(storage,position){if(parsePosition(position)===null)return false;try{storage.setItem('notizen.position',String(position));return true;}catch{return false;}}
