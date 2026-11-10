import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ChevronLeft,ChevronUp,ChevronDown,Search,SquarePen,Ellipsis,Share,Copy,Trash2,Check, X, Pencil} from 'lucide-react';
import {builtins} from './data.mjs';
import {applyPosition,parsePosition,readPosition,savePosition} from './force.mjs';
import {readNotes,saveNotes,type Note} from './storage';
import './styles.css';
function App(){
 const [own,setOwn]=useState(readNotes),[active,setActive]=useState<string|null>(null),[position,setPosition]=useState(()=>readPosition(localStorage)),[query,setQuery]=useState(''),[searching,setSearching]=useState(false),[menu,setMenu]=useState(false),[editing,setEditing]=useState(false),[filter,setFilter]=useState(''),[match,setMatch]=useState(0),[notice,setNotice]=useState(''),[collapsed,setCollapsed]=useState(false);
 const scroll=useRef<HTMLElement>(null),input=useRef<HTMLInputElement>(null),pending=useRef<number|null>(null);
 const builtin=builtins.find(n=>n.id===active),custom=own.find(n=>n.id===active);
 const entries=builtin?(builtin.id==='landmarks'?applyPosition(builtin.items,position):[...builtin.items]):[];
 const title=builtin?.title??custom?.title??'',body=builtin?entries.map((v,i)=>`${i+1}. ${v}`).join('\n'):custom?.body??'';
 const forceQuery=active==='landmarks'&&parsePosition(query)!==null;
 const lines=builtin?entries.map((v,i)=>`${i+1}. ${v}`):body.split('\n');
 const matches=query&&!forceQuery?lines.flatMap((line,i)=>line.toLocaleLowerCase('de').includes(query.toLocaleLowerCase('de'))?[i]:[]):[];
 const show=(message:string)=>{setNotice(message);window.setTimeout(()=>setNotice(''),2400);};
 const close=()=>{setActive(null);setSearching(false);setEditing(false);setMenu(false);setQuery('');};
 useEffect(()=>{const pop=()=>close();window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop);},[]);
 useEffect(()=>{const resize=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--vh',`${v?.height??window.innerHeight}px`);if(pending.current!==null)jump(pending.current);};resize();window.visualViewport?.addEventListener('resize',resize);return()=>window.visualViewport?.removeEventListener('resize',resize);},[]);
 function jump(i:number){const node=document.getElementById(`line-${i}`);if(node&&scroll.current)scroll.current.scrollTop=node.offsetTop-scroll.current.offsetTop-45;}
 function open(id:string){history.pushState({note:id},'');setActive(id);setQuery('');setMatch(0);setCollapsed(false);requestAnimationFrame(()=>{if(scroll.current)scroll.current.scrollTop=0;});}
 function persist(next:Note[]){setOwn(next);if(!saveNotes(next))show('Die Notiz konnte nicht gespeichert werden. Bitte Speicherplatz prüfen.');}
 function change(field:'title'|'body',value:string){persist(own.map(n=>n.id===active?{...n,[field]:value,updated:new Date().toISOString()}:n));}
 function create(){const n={id:crypto.randomUUID(),title:'',body:'',updated:new Date().toISOString()};persist([...own,n]);open(n.id);setEditing(true);}
 function submit(e:React.FormEvent){e.preventDefault();const p=active==='landmarks'?parsePosition(query):null;if(p!==null){savePosition(localStorage,p);setPosition(p);setSearching(false);setQuery('');input.current?.blur();pending.current=p-1;requestAnimationFrame(()=>jump(p-1));setTimeout(()=>jump(p-1),350);setTimeout(()=>{jump(p-1);pending.current=null;},650);}else if(matches.length){jump(matches[0]);setMatch(0);input.current?.blur();}}
 async function copy(){setMenu(false);try{await navigator.clipboard.writeText(`${title}\n\n${body}`);show('Kopiert');}catch{show('Text zum Kopieren gedrückt halten.');}}
 async function share(){try{if(navigator.share)await navigator.share({title:title||'Notiz',text:`${title}\n\n${body}`});else await copy();}catch{}}
 function remove(){setMenu(false);if(confirm('Diese Notiz löschen?')){persist(own.filter(n=>n.id!==active));history.back();}}
 function highlight(text:string){if(!query||forceQuery)return text;const i=text.toLocaleLowerCase('de').indexOf(query.toLocaleLowerCase('de'));return i<0?text:<>{text.slice(0,i)}<mark>{text.slice(i,i+query.length)}</mark>{text.slice(i+query.length)}</>;}
 return <div className={`app ${active?'detail':'overview'}`}>
 <header><nav>{active?<><button className="back" onClick={()=>history.back()}><ChevronLeft size={28}/>Notizen</button><div className="actions">{editing?<button onClick={()=>setEditing(false)}>Fertig</button>:<><button aria-label="Teilen" onClick={share}><Share/></button><button aria-label="Mehr" aria-expanded={menu} onClick={()=>setMenu(!menu)}><Ellipsis className="circle"/></button></>}</div></>:<span className="small-title">{collapsed?'Notizen':''}</span>}</nav>
 {active&&searching&&<form className="find" onSubmit={submit}><label className="searchbox"><Search size={18}/><input ref={input} autoFocus type="search" enterKeyHint="search" placeholder="In Notiz suchen" value={query} onChange={e=>{setQuery(e.target.value);setMatch(0);}} aria-label="In Notiz suchen"/></label><button type="button" onClick={()=>{setSearching(false);setQuery('');}}>Abbrechen</button></form>}
 </header>
 <main ref={scroll} onScroll={e=>setCollapsed(e.currentTarget.scrollTop>45)} key={active??'list'}>
 {!active?<><h1>Notizen</h1><label className="searchbox list-search"><Search size={19}/><input type="search" placeholder="Suchen" aria-label="Notizen durchsuchen" value={filter} onChange={e=>setFilter(e.target.value)}/></label><section className="note-list">{[...builtins.map(n=>({id:n.id,title:n.title,preview:n.items.slice(0,3).join(', ')})),...own.map(n=>({id:n.id,title:n.title||'Neue Notiz',preview:n.body||'Kein zusätzlicher Text'}))].filter(n=>`${n.title} ${n.preview} ${builtins.find(b=>b.id===n.id)?.items.join(' ')??own.find(b=>b.id===n.id)?.body??''}`.toLocaleLowerCase('de').includes(filter.toLocaleLowerCase('de'))).map(n=><button className="note-row" key={n.id} onClick={()=>open(n.id)}><strong>{n.title}</strong><span><time>Heute</time> {n.preview}</span></button>)}</section></>:<article><div className="date">{new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(custom?new Date(custom.updated):new Date('2026-11-10T09:41:00'))}</div>{editing&&custom?<><input className="title-edit" aria-label="Titel" placeholder="Titel" value={custom.title} onChange={e=>change('title',e.target.value)}/><textarea autoFocus aria-label="Notiztext" placeholder="Notiz" value={custom.body} onChange={e=>change('body',e.target.value)}/></>:<><h1 className="note-title">{title||'Neue Notiz'}</h1><div className="lines">{lines.map((line,i)=><div className="line" id={`line-${i}`} key={i}>{highlight(line)||<br/>}</div>)}</div></>}</article>}
 </main>
 <footer>{active?<>{searching?<><span className="result-count">{forceQuery?'':`${matches.length?match+1:0} von ${matches.length}`}</span><div className="actions"><button aria-label="Vorheriger Treffer" disabled={!matches.length} onClick={()=>{const n=(match-1+matches.length)%matches.length;setMatch(n);jump(matches[n]);}}><ChevronUp/></button><button aria-label="Nächster Treffer" disabled={!matches.length} onClick={()=>{const n=(match+1)%matches.length;setMatch(n);jump(matches[n]);}}><ChevronDown/></button></div></>:<><button aria-label="In Notiz suchen" onClick={()=>{setSearching(true);setEditing(false);}}><Search/></button>{custom&&<button aria-label="Notiz bearbeiten" onClick={()=>setEditing(!editing)}>{editing?<Check/>:<Pencil/>}</button>}<button aria-label="Neue Notiz" onClick={create}><SquarePen/></button></>}</>:<><span/><span className="count">{builtins.length+own.length} Notizen</span><button aria-label="Neue Notiz" onClick={create}><SquarePen size={25}/></button></>}</footer>
 {menu&&<><button className="scrim" aria-label="Menü schließen" onClick={()=>setMenu(false)}/><div className="menu"><button onClick={()=>{setMenu(false);setSearching(true);}}>In Notiz suchen<Search size={19}/></button><button onClick={copy}>Kopieren<Copy size={19}/></button>{custom&&<><button onClick={()=>{setMenu(false);setEditing(true);}}>Bearbeiten<Pencil size={19}/></button><button className="danger" onClick={remove}>Notiz löschen<Trash2 size={19}/></button></>}</div></>}
 {notice&&<div className="toast" role="status">{notice}</div>}
 </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(()=>{}));
