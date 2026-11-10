export type Note={id:string;title:string;body:string;updated:string};
export function readNotes():Note[]{try{const data=JSON.parse(localStorage.getItem('notizen.own')||'[]');return Array.isArray(data)?data.filter(n=>typeof n.id==='string'&&typeof n.title==='string'&&typeof n.body==='string'&&typeof n.updated==='string'):[];}catch{return [];}}
export function saveNotes(notes:Note[]){try{localStorage.setItem('notizen.own',JSON.stringify(notes));return true;}catch{return false;}}
