(function(){
"use strict";

/* ---------- Content ---------- */
const L = [
 ["أ","أَلِف","أَسَد","🦁",0],["ب","بَاء","بَطَّة","🦆",1],["ت","تَاء","تُفَّاحَة","🍎",1],["ث","ثَاء","ثَعْلَب","🦊",1],
 ["ج","جِيم","جَمَل","🐫",1],["ح","حَاء","حِصَان","🐎",1],["خ","خَاء","خَرُوف","🐑",1],["د","دَال","دُبّ","🐻",0],
 ["ذ","ذَال","ذُرَة","🌽",0],["ر","رَاء","رِيشَة","🪶",0],["ز","زَاي","زَرَافَة","🦒",0],["س","سِين","سَمَكَة","🐟",1],
 ["ش","شِين","شَمْس","☀️",1],["ص","صَاد","صَارُوخ","🚀",1],["ض","ضَاد","ضِفْدَع","🐸",1],["ط","طَاء","طَائِرَة","✈️",1],
 ["ظ","ظَاء","ظَرْف","✉️",1],["ع","عَيْن","عِنَب","🍇",1],["غ","غَيْن","غَيْمَة","☁️",1],["ف","فَاء","فِيل","🐘",1],
 ["ق","قَاف","قِطَّة","🐈",1],["ك","كَاف","كَلْب","🐕",1],["ل","لَام","لَيْمُون","🍋",1],["م","مِيم","مَوْز","🍌",1],
 ["ن","نُون","نَحْلَة","🐝",1],["ه","هَاء","هَدِيَّة","🎁",1],["و","وَاو","وَرْدَة","🌹",0],["ي","يَاء","يَد","✋",1]
].map(([ch,name,word,pic,join],i)=>({i,ch,name,word,pic,join:!!join}));

const GROUPS = [
 {name:"الباب",letters:[0,1,2,3]},
 {name:"غرفة الجلوس",letters:[4,5,6,7]},
 {name:"المطبخ",letters:[8,9,10,11]},
 {name:"غرفة النوم",letters:[12,13,14,15]},
 {name:"غرفة الألعاب",letters:[16,17,18,19]},
 {name:"السطح",letters:[20,21,22,23]},
 {name:"الحديقة",letters:[24,25,26,27]}
];
const FAMILIES = [[1,2,3,24,27],[4,5,6],[7,8],[9,10,26],[11,12],[13,14],[15,16],[17,18],[19,20],[21,22],[0],[23],[25]];

const GIRLS = [
 {id:"sophie",ar:"صوفي",say:"صُوفِي",en:"Sophie",color:"#E0407B",specials:["♟️","👑","🧠","🏆","♞"]},
 {id:"olivia",ar:"أوليفيا",say:"أُولِيفِيَا",en:"Olivia",color:"#2E9E4F",specials:["🩺","🎹","💃","🩰","🎀"]},
 {id:"julia",ar:"جوليا",say:"جُولِيَا",en:"Julia",color:"#7B5BD6",specials:["📚","✏️","🍎","🥁","🎓"]}
];
const G = id => GIRLS.find(g=>g.id===id);

const GAMES = {
 hear:{ic:"🔊",label:"اسمعي",say:"اِسْمَعِي وَاخْتَارِي الْحَرْف",title:"اسمعي واختاري"},
 pic:{ic:"🖼️",label:"صورة",say:"بِأَيِّ حَرْفٍ تَبْدَأُ الْكَلِمَة؟",title:"بأيّ حرف تبدأ؟"},
 trace:{ic:"✍️",label:"ارسمي",say:"اُرْسُمِي الْحَرْفَ بِإِصْبَعِكِ",title:"ارسمي الحرف"},
 forms:{ic:"🔤",label:"أشكال",say:"مَا هَذَا الْحَرْف؟",title:"ما هذا الحرف؟"},
 syl:{ic:"✨",label:"الحركات",say:"اِسْمَعِي الصَّوْتَ وَاخْتَارِي",title:"اسمعي الصوت"},
 long:{ic:"〰️",label:"المدود",say:"قَصِيرٌ أَمْ طَوِيل؟ اِسْمَعِي وَاخْتَارِي",title:"قصير أم طويل؟"},
 wpic:{ic:"🖼️",label:"اقرئي وصِلي",say:"اِقْرَئِي الْكَلِمَةَ وَاخْتَارِي الصُّورَة",title:"اقرئي واختاري الصورة"},
 whear:{ic:"👂",label:"أيّ كلمة؟",say:"اِسْمَعِي وَاخْتَارِي الْكَلِمَة",title:"اسمعي واختاري الكلمة"},
 wbuild:{ic:"🧩",label:"ركّبي",say:"رَكِّبِي الْكَلِمَة",title:"ركّبي الكلمة"},
 wread:{ic:"🎤",label:"اقرئي بصوتك",say:"اِقْرَئِي الْكَلِمَةَ بِصَوْتٍ عَالٍ",title:"اقرئي بصوتك"},
 s3pic:{ic:"🖼️",label:"جملة وصورة",say:"اِقْرَئِي الْجُمْلَةَ وَاخْتَارِي الصُّورَة",title:"اقرئي الجملة واختاري الصورة"},
 s3fill:{ic:"✏️",label:"أكملي",say:"أَكْمِلِي الْجُمْلَة",title:"أكملي الجملة"},
 s3order:{ic:"🧩",label:"رتّبي",say:"رَتِّبِي الْكَلِمَاتِ لِتَصْنَعِي جُمْلَة",title:"رتّبي الجملة"},
 s3read:{ic:"🎤",label:"اقرئي بصوتك",say:"اِقْرَئِي الْجُمْلَةَ بِصَوْتٍ عَالٍ",title:"اقرئي بصوتك"},
 s3story:{ic:"📚",label:"قصص",say:"هَيَّا نَقْرَأُ قِصَّة",title:"قصة"}
};
const ROTATION = ["hear","pic","trace","forms"];
const PRAISE = ["أَحْسَنْتِ!","مُمْتَازَة!","رَائِعَة!","بْرَافُو!"];
const WEEK_AR = ["ن","ث","ر","خ","ج","س","ح"];

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad = n => String(n).padStart(2,"0");
const ymd = (d=new Date()) => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const rnd = a => a[Math.floor(Math.random()*a.length)];
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
function weekDays(){ const d=new Date(); const dow=(d.getDay()+6)%7; return [...Array(7)].map((_,i)=>ymd(new Date(d.getFullYear(),d.getMonth(),d.getDate()-dow+i))); }
function lsGet(k,def){ try{ const v=localStorage.getItem(k); return v==null?def:JSON.parse(v); }catch(e){ return def; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function forms(i){ const c=L[i].ch; return L[i].join ? {iso:c,ini:c+"ـ",med:"ـ"+c+"ـ",fin:"ـ"+c} : {iso:c,ini:c,med:"ـ"+c,fin:"ـ"+c}; }

/* ---------- State + storage ---------- */
const defaultKid = () => ({mastery:{},stars:0,unlocked:1,stickers:[],specials:{},rot:0});
const defaultSettings = () => ({pin:null,share:5,reward:"+10 دقائق تلفزيون",weekReward:"اختيار فيلم الجمعة"});
const S = { kids:{}, jar:{}, redeem:{}, settings:defaultSettings(), online:false, readOnly:false };
(function loadCache(){ const c=lsGet("bh_cache",null); if(c){ S.kids=c.kids||{}; S.jar=c.jar||{}; S.redeem=c.redeem||{}; S.settings=Object.assign(defaultSettings(),c.settings||{}); } })();
function cache(){ lsSet("bh_cache",{kids:S.kids,jar:S.jar,redeem:S.redeem,settings:S.settings}); }
function kid(id){ return S.kids[id] ? Object.assign(defaultKid(),S.kids[id]) : defaultKid(); }

let fam=null, fs=null; const chains={}; let unsubs=[], unsubJar=null, jarWeek=null;
const KEY_ABC="ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function newFamilyKey(){ let s=""; const a=new Uint32Array(12); (window.crypto||window.msCrypto).getRandomValues(a); a.forEach(n=>s+=KEY_ABC[n%KEY_ABC.length]); return s; }
const prettyKey = k => k ? k.match(/.{1,4}/g).join("-") : "";
async function saveDoc(col,id,data){
  if(col==="settings") S.settings=data; else S[col][id]=data;
  cache();
  if(!fam) return;
  const path=col+"/"+id;
  chains[path]=(chains[path]||Promise.resolve()).then(()=>fam.collection(col).doc(id).set(data)).catch(e=>{
    if(e && e.code==="permission-denied"){ S.readOnly=true; }
    console.warn("save failed",path,e);
  });
  return chains[path];
}
async function deleteDoc(col,id){
  delete S[col][id]; cache();
  if(!fam) return;
  const path=col+"/"+id;
  chains[path]=(chains[path]||Promise.resolve()).then(()=>fam.collection(col).doc(id).delete()).catch(e=>console.warn("delete failed",path,e));
  return chains[path];
}
let resetAsk=null;
async function doReset(which){
  const ids = which==="all" ? GIRLS.map(g=>g.id) : [which];
  ids.forEach(id=>saveDoc("kids",id,defaultKid()));
  if(which==="all"){
    const jarIds=new Set(Object.keys(S.jar));
    if(fam){ try{ (await fam.collection("jar").get()).docs.forEach(d=>jarIds.add(d.id)); }catch(e){ console.warn(e); } }
    jarIds.forEach(id=>deleteDoc("jar",id));
    Object.keys(S.redeem).forEach(id=>deleteDoc("redeem",id));
    try{ Object.keys(localStorage).filter(k=>k.indexOf("bh_cele_")===0).forEach(k=>localStorage.removeItem(k)); }catch(e){}
  }
  resetAsk=null; render(); toast(which==="all"?"Everything reset":G(which).en+" reset");
}
function subscribeJar(){
  if(!fam) return;
  const wk=weekDays()[0]; if(wk===jarWeek && unsubJar) return;
  if(unsubJar) unsubJar(); jarWeek=wk;
  unsubJar=fam.collection("jar").where("date",">=",wk).onSnapshot(snap=>{
    const j={}; snap.docs.forEach(d=>{ if(d.exists) j[d.id]=d.data(); });
    S.jar=j; cache(); onRemote();
  },e=>console.warn("jar sub",e));
}
let fsReady=null;
function firestore(){
  if(fsReady) return fsReady;
  fsReady=(async()=>{
    const cfg=window.FIREBASE_CONFIG;
    if(!cfg || !cfg.apiKey || !window.firebase) return null;
    if(!firebase.apps.length) firebase.initializeApp(cfg);
    const f=firebase.firestore();
    try{ await f.enablePersistence({synchronizeTabs:true}); }catch(e){}
    return f;
  })().catch(e=>{ console.warn(e); return null; });
  return fsReady;
}
async function connect(uploadLocal){
  unsubs.forEach(u=>u()); unsubs=[]; if(unsubJar){ unsubJar(); unsubJar=null; jarWeek=null; }
  fam=null; S.online=false; S.readOnly=false;
  const key=lsGet("bh_family",null);
  fs=await firestore();
  if(!fs || !key){ render(); return; }
  fam=fs.collection("families").doc(key);
  S.online=true;
  if(uploadLocal){
    Object.keys(S.kids).forEach(id=>saveDoc("kids",id,S.kids[id]));
    Object.keys(S.jar).forEach(id=>saveDoc("jar",id,S.jar[id]));
    Object.keys(S.redeem).forEach(id=>saveDoc("redeem",id,S.redeem[id]));
    saveDoc("settings","family",S.settings);
  }
  unsubs.push(fam.collection("kids").onSnapshot(snap=>{ const k={}; snap.docs.forEach(d=>{ if(d.exists) k[d.id]=d.data(); }); S.kids=k; cache(); onRemote(); },e=>console.warn(e)));
  unsubs.push(fam.collection("redeem").onSnapshot(snap=>{ const r={}; snap.docs.forEach(d=>{ if(d.exists) r[d.id]=d.data(); }); S.redeem=r; cache(); onRemote(); },e=>console.warn(e)));
  CLIPS={};
  unsubs.push(fam.collection("settings").where("kind","==","clip").onSnapshot(snap=>{ const c={}; snap.docs.forEach(d=>{ if(d.exists) c[d.id]=d.data(); }); CLIPS=c; if(view.name==="studio" && studio.state==="idle") render(); },e=>console.warn(e)));
  unsubs.push(fam.collection("settings").doc("family").onSnapshot(d=>{ if(d.exists){ S.settings=Object.assign(defaultSettings(),d.data()); cache(); onRemote(); } },e=>console.warn(e)));
  subscribeJar();
  render();
}
function onRemote(){
  if(view.name==="home"||view.name==="pick"){ render(); checkCelebrate(); }
  else if(view.name==="parent"){ render(); }
}

/* ---------- Jar logic ---------- */
const today = () => ymd();
function jarCount(gid,date=today()){ const d=S.jar[date+"_"+gid]; return d?d.n||0:0; }
function share(){ return S.settings.share||5; }
function dayFull(date=today()){ return GIRLS.every(g=>jarCount(g.id,date)>=share()); }
function weekFullCount(){ return weekDays().filter(d=>d<=today() && dayFull(d)).length; }

/* ---------- Speech + sound ---------- */
let arVoice=null;
function pickVoice(){ try{ const vs=speechSynthesis.getVoices(); arVoice=vs.find(v=>/^ar([-_]|$)/i.test(v.lang))||null; }catch(e){} }
try{ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }catch(e){}
function say(text,rate){
  try{ speechSynthesis.cancel(); }catch(e){}
  try{ if(playRecorded(text)) return; stopClip(); }catch(e){} // the family's own recordings win over the computer voice
  try{
    const u=new SpeechSynthesisUtterance(text);
    u.lang=arVoice?arVoice.lang:"ar-SA"; if(arVoice) u.voice=arVoice;
    u.rate=rate||0.8; u.pitch=1.1;
    setTimeout(()=>speechSynthesis.speak(u),60);
  }catch(e){}
}
let AC=null;
function tone(fs,dur,type,vol){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const t=AC.currentTime;
    fs.forEach((f,i)=>{ const o=AC.createOscillator(),g=AC.createGain(); o.type=type||"sine"; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t+i*dur); g.gain.linearRampToValueAtTime(vol||0.15,t+i*dur+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001,t+i*dur+dur*1.8); o.connect(g); g.connect(AC.destination); o.start(t+i*dur); o.stop(t+i*dur+dur*2); });
  }catch(e){}
}
const sfx={ok:()=>tone([660,990],0.09),no:()=>tone([240,190],0.12,"triangle",0.1),fan:()=>tone([523,659,784,1047,1319],0.13),tap:()=>tone([520],0.05,"sine",0.06)};

/* ---------- Effects ---------- */
function toast(msg){ const t=document.createElement("div"); t.className="toast"; t.innerHTML="<div>"+esc(msg)+"</div>"; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }
function confetti(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c=$("#fx"), x=c.getContext("2d"); const W=c.width=innerWidth, H=c.height=innerHeight;
  const cols=["#E0407B","#2E9E4F","#7B5BD6","#F2B82F","#1F5FA8"];
  const ps=[...Array(140)].map(()=>({x:Math.random()*W,y:-20-Math.random()*H*0.5,vx:(Math.random()-.5)*3,vy:2+Math.random()*4,r:4+Math.random()*6,c:rnd(cols),a:Math.random()*6}));
  const t0=performance.now();
  (function f(t){ x.clearRect(0,0,W,H); ps.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.a+=0.1; x.fillStyle=p.c; x.save(); x.translate(p.x,p.y); x.rotate(p.a); x.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); x.restore(); });
    if(t-t0<3200) requestAnimationFrame(f); else x.clearRect(0,0,W,H); })(t0);
}

/* ---------- Art ---------- */
function face(gid,size){
  const g=G(gid), hair="#4A2C1A", skin="#E3A97F", cheek="#F08FA0";
  const back = gid==="olivia"
    ? [[30,54,20],[90,54,20],[38,36,22],[82,36,22],[60,28,24]]
    : [[24,62,22],[96,62,22],[22,86,18],[98,86,18],[34,38,24],[86,38,24],[60,26,26],[28,102,13],[92,102,13]];
  let s='<svg viewBox="0 0 120 120" width="'+size+'" height="'+size+'" aria-hidden="true">';
  s+='<circle cx="60" cy="60" r="58" fill="'+g.color+'" opacity=".16"/>';
  back.forEach(([x,y,r])=>s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+hair+'"/>');
  s+='<circle cx="60" cy="66" r="32" fill="'+skin+'"/>';
  [[40,44,12],[52,38,13],[66,38,13],[80,44,12]].forEach(([x,y,r])=>s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+hair+'"/>');
  if(gid==="sophie") s+='<path d="M27 52 Q60 18 93 52" stroke="#D7263D" stroke-width="7" fill="none" stroke-linecap="round"/>';
  if(gid==="julia") s+='<path d="M27 52 Q60 18 93 52" stroke="#1C1C1C" stroke-width="7" fill="none" stroke-linecap="round"/>';
  if(gid==="olivia") s+='<g transform="translate(28 40) rotate(-20)"><path d="M0 0 L-14 -9 L-14 9 Z" fill="#9CC9F0"/><path d="M0 0 L14 -9 L14 9 Z" fill="#9CC9F0"/><circle r="4.5" fill="#7FB4E3"/></g>';
  s+='<ellipse cx="48" cy="68" rx="5.5" ry="7" fill="#2B1A10"/><ellipse cx="72" cy="68" rx="5.5" ry="7" fill="#2B1A10"/>';
  s+='<circle cx="49.8" cy="65.5" r="1.9" fill="#fff"/><circle cx="73.8" cy="65.5" r="1.9" fill="#fff"/>';
  s+='<circle cx="39" cy="80" r="6" fill="'+cheek+'" opacity=".65"/><circle cx="81" cy="80" r="6" fill="'+cheek+'" opacity=".65"/>';
  if(gid==="sophie") s+='<path d="M50 83 Q60 94 70 83 Z" fill="#8A2F3A"/><rect x="52" y="83" width="6.5" height="4" fill="#fff"/><rect x="61.5" y="83" width="6.5" height="4" fill="#fff"/>';
  else s+='<path d="M51 83 Q60 91 69 83" stroke="#8A2F3A" stroke-width="3" fill="none" stroke-linecap="round"/>';
  return s+'</svg>';
}

function houseSVG(k){
  const unlocked=k.unlocked, newest=unlocked-1;
  const room=(gi,inner)=>'<g class="room'+(gi===newest?' newest':'')+'" data-act="room" data-g="'+gi+'" role="button" aria-label="'+GROUPS[gi].name+'">'+inner+'</g>';
  const letters=(gi,pos,size,fill)=> gi<unlocked
    ? GROUPS[gi].letters.map((li,n)=>'<text x="'+pos[n][0]+'" y="'+pos[n][1]+'" font-size="'+size+'" text-anchor="middle" font-family="Noto Naskh Arabic, serif" font-weight="700" fill="'+((k.mastery[li]||0)>=5?'#1E7A3A':fill)+'">'+L[li].ch+'</text>').join("")
    : '<text x="'+((pos[0][0]+pos[1][0])/2)+'" y="'+((pos[0][1]+pos[2][1])/2+8)+'" font-size="'+(size+2)+'" text-anchor="middle">🔒</text>';
  let s='<svg class="house" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid meet">';
  s+='<rect x="0" y="312" width="480" height="28" fill="#DCC38E"/>';
  // palm + garden sign
  s+='<path d="M436 312 C432 260 438 220 446 170" stroke="#8B6A3E" stroke-width="10" fill="none" stroke-linecap="round"/>';
  [[-40,-8],[-30,18],[40,-6],[30,20],[0,-30]].forEach(([dx,dy])=>s+='<path d="M446 170 Q'+(446+dx/2)+' '+(170+dy-14)+' '+(446+dx)+' '+(170+dy)+'" stroke="#3E9A5A" stroke-width="12" fill="none" stroke-linecap="round"/>');
  s+=room(6,'<rect x="392" y="236" width="84" height="56" rx="10" fill="'+(6<unlocked?'#FFF8E6':'#B9B2A6')+'" stroke="#8B6A3E" stroke-width="4"/><rect x="430" y="292" width="8" height="20" fill="#8B6A3E"/>'+letters(6,[[455,262],[413,262],[455,286],[413,286]],22,"#2A2140"));
  // villa
  s+='<rect x="40" y="92" width="340" height="220" fill="#E9D1A2" stroke="#C7A56A" stroke-width="3"/>';
  s+='<rect x="34" y="80" width="352" height="14" fill="#fff"/>';
  for(let x=34;x<=374;x+=22) s+='<rect x="'+x+'" y="68" width="12" height="13" fill="#fff"/>';
  // roof banner
  s+=room(5,'<rect x="150" y="14" width="120" height="44" rx="12" fill="'+(5<unlocked?'#fff':'#B9B2A6')+'" stroke="#C7A56A" stroke-width="3"/><path d="M210 58 L210 68" stroke="#C7A56A" stroke-width="4"/>'+letters(5,[[250,46],[223,46],[197,46],[170,46]],24,"#2A2140"));
  // windows
  [[1,62],[2,132],[3,244],[4,314]].forEach(([gi,x])=>{
    const y=124,w=44,h=116;
    const p='M'+x+' '+(y+h)+' L'+x+' '+(y+22)+' A22 22 0 0 1 '+(x+w)+' '+(y+22)+' L'+(x+w)+' '+(y+h)+' Z';
    s+=room(gi,'<path class="glass" d="'+p+'" fill="'+(gi<unlocked?'#A8D2EA':'#8E8A84')+'" stroke="#fff" stroke-width="6"/><line x1="'+(x+22)+'" y1="'+(y+4)+'" x2="'+(x+22)+'" y2="'+(y+h)+'" stroke="#fff" stroke-width="2" opacity=".6"/>'
      +letters(gi,[[x+33,y+56],[x+11,y+56],[x+33,y+96],[x+11,y+96]],21,"#1A3E66"));
  });
  // door
  const dx=180,dy=168,dw=60,dh=144;
  s+=room(0,'<path d="M'+dx+' '+(dy+dh)+' L'+dx+' '+(dy+30)+' A30 30 0 0 1 '+(dx+dw)+' '+(dy+30)+' L'+(dx+dw)+' '+(dy+dh)+' Z" fill="#4A3226" stroke="#fff" stroke-width="5"/>'
    +'<rect x="'+(dx+6)+'" y="'+(dy+36)+'" width="22" height="96" rx="4" fill="#C9A24A"/><rect x="'+(dx+32)+'" y="'+(dy+36)+'" width="22" height="96" rx="4" fill="#C9A24A"/>'
    +letters(0,[[dx+43,dy+74],[dx+17,dy+74],[dx+43,dy+118],[dx+17,dy+118]],22,"#3A2416"));
  s+='<rect x="166" y="312" width="88" height="8" fill="#9A9A9E"/><rect x="156" y="320" width="108" height="8" fill="#85858A"/>';
  return s+'</svg>';
}

function jarSVG(){
  // The jar keeps roughly the same size; balls get smaller as the daily share grows (up to 24 per girl = 72 balls).
  const sh=share(), total=sh*GIRLS.length;
  const cols=Math.max(5,Math.ceil(Math.sqrt(total/1.3))), rows=Math.ceil(total/cols);
  const sp=Math.min(28,150/cols), r=sp*0.41, jig=sp*0.14;
  const filled=[]; for(let i=0;i<sh;i++) GIRLS.forEach(g=>{ if(jarCount(g.id)>i) filled.push(g.color); });
  const W=cols*sp+30, H=rows*sp+62;
  let s='<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" aria-label="جرة النجوم">';
  s+='<rect x="'+(W/2-36)+'" y="2" width="72" height="16" rx="6" fill="#1F5FA8"/>';
  s+='<path d="M'+(W/2-30)+' 18 L'+(W/2-30)+' 30 Q8 34 8 60 L8 '+(H-14)+' Q8 '+(H-2)+' 22 '+(H-2)+' L'+(W-22)+' '+(H-2)+' Q'+(W-8)+' '+(H-2)+' '+(W-8)+' '+(H-14)+' L'+(W-8)+' 60 Q'+(W-8)+' 34 '+(W/2+30)+' 30 L'+(W/2+30)+' 18 Z" fill="#EAF6FB" stroke="#9CC3D6" stroke-width="3"/>';
  for(let n=0;n<total;n++){
    const row=Math.floor(n/cols), col=n%cols;
    const cx=15+sp/2+col*sp+(row%2?jig:-jig), cy=H-14-r-row*sp;
    s+= n<filled.length ? '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+filled[n]+'"/><circle cx="'+(cx-r*0.3)+'" cy="'+(cy-r*0.3)+'" r="'+(r*0.26)+'" fill="#fff" opacity=".55"/>'
      : '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r-1)+'" fill="none" stroke="#C4DCE7" stroke-width="1.6" stroke-dasharray="3 3"/>';
  }
  return s+'</svg>';
}

/* ---------- Views ---------- */
let me = null;
let view = {name:"pick"};
let overlay = null; // {type,...}

function go(name,extra){ view=Object.assign({name},extra||{}); overlay=null; render(); }

function render(){
  const app=$("#app");
  if(view.name==="pick") app.innerHTML=pickHTML();
  else if(view.name==="home") app.innerHTML=homeHTML();
  else if(view.name==="game") { app.innerHTML=gameHTML(); afterGameRender(); }
  else if(view.name==="stickers") app.innerHTML=stickersHTML();
  else if(view.name==="parent") app.innerHTML=parentHTML();
  else if(view.name==="studio") app.innerHTML=studioHTML();
  renderOverlay();
}

function pickHTML(){
  return '<div class="screen pick"><h1>مَن ستلعب اليوم؟</h1><div class="girls">'
    + GIRLS.map(g=>'<button class="girlcard" data-act="pickgirl" data-id="'+g.id+'" style="border-bottom:6px solid '+g.color+'">'+face(g.id,110)+'<b style="color:'+g.color+'">'+g.ar+'</b></button>').join("")
    + '</div><button class="parentbtn" data-act="parent">🔒 Parents</button></div>';
}

function topBar(){
  const g=G(me), k=kid(me);
  return '<div class="top"><button class="who" data-act="switch" aria-label="change player">'+face(me,48)+'<b style="color:'+g.color+'">'+g.ar+'</b></button>'
   + '<span class="pill"><span class="star">★</span>'+k.stars+'</span>'
   + '<button class="pill" data-act="stickers">📒 '+(k.stickers.length+Object.keys(k.specials).length+l2(k).wst.length+(l2(k).ss||0)+(l3(k).ss||0))+(unseen().length?'<i class="newdot"></i>':'')+'</button>'
   + '<span class="spacer"></span><button class="parentbtn" data-act="parent">🔒 Parents</button></div>';
}

function homeHTML(){
  const k=kid(me), sh=share(), full=dayFull(), red=S.redeem["day_"+today()];
  const wk=weekDays(), wf=weekFullCount(), wred=S.redeem["week_"+wk[0]];
  let jarRows=GIRLS.map(g=>{ const n=jarCount(g.id); return '<div class="jarrow'+(n>=sh?' done':'')+'">'+face(g.id,34)+'<div class="bar"><i style="width:'+Math.min(100,n/sh*100)+'%;background:'+g.color+'"></i></div><span>'+Math.min(n,sh)+'/'+sh+'</span></div>'; }).join("");
  let ticket = '<div class="ticket'+(red?' used':(full?'':' locked'))+'"><span style="font-size:30px">🎟️</span><span class="t">'+esc(S.settings.reward)+'</span>'
    + (red?'<b style="color:var(--good)">✓ تمّ!</b>':(full?'<button class="btn small gold" data-act="redeem" data-key="day_'+today()+'">بابا / ماما 🔓</button>':'<span>🔒</span>'))+'</div>';
  let week='<div class="week">'+wk.map((d,i)=>'<span class="'+(dayFull(d)?'full ':'')+(d===today()?'today':'')+'">'+WEEK_AR[i]+'</span>').join("")+'</div>'
    + '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;font-weight:700"><span style="font-size:24px">🎬</span><span style="flex:1">'+esc(S.settings.weekReward)+' ('+Math.min(wf,5)+'/5)</span>'
    + (wred?'<b style="color:var(--good)">✓</b>':(wf>=5?'<button class="btn small gold" data-act="redeem" data-key="week_'+wk[0]+'">🔓</button>':''))+'</div>';
  const want=lsGet("bh_level_"+me,1), lv = (want===3 && l3Open(k)) ? 3 : (want===2 && l2Open(k)) ? 2 : 1;
  const tabs='<div class="lvtabs"><button data-act="level" data-l="1" class="'+(lv===1?'on':'')+'">🏠 الحروف</button><button data-act="level" data-l="2" class="'+(lv===2?'on':'')+'">📖 القراءة'+(l2Open(k)?'':' 🔒')+'</button><button data-act="level" data-l="3" class="'+(lv===3?'on':'')+'">📚 الجمل'+(l3Open(k)?'':' 🔒')+'</button></div>';
  let games = lv===3
    ? '<div class="games g5">'+STAGES3.map((st,i)=>{ const ok=stage3State(k,i)==="open"; return '<button class="game'+(ok?'':' off')+'" data-act="'+(ok?'play':'stlock3')+'" data-type="'+st.type+'" data-s="'+i+'"><span class="ic">'+(ok?GAMES[st.type].ic:"🔒")+'</span>'+st.name+'</button>'; }).join("")+'</div>'
    : lv===1
    ? '<div class="games">'+ROTATION.map(t=>'<button class="game" data-act="play" data-type="'+t+'"><span class="ic">'+GAMES[t].ic+'</span>'+GAMES[t].label+'</button>').join("")+'</div>'
    : '<div class="games">'+STAGES.map((st,i)=>{ const ok=stageState(k,i)==="open"; const g=GAMES[st.type==="words"?"wpic":st.type]; return '<button class="game'+(ok?'':' off')+'" data-act="'+(ok?'play':'stlock')+'" data-type="'+st.type+'" data-s="'+i+'"><span class="ic">'+(ok?(st.type==="words"?"📖":g.ic):"🔒")+'</span>'+st.name+'</button>'; }).join("")+'</div>';
  return '<div class="screen">'+topBar()+'<div class="home">'
   + '<div class="house-wrap">'+tabs+(lv===1?houseSVG(k):lv===2?pathSVG(k):path3SVG(k))+'</div>'
   + '<div class="side">'
   +   '<div class="panel"><button class="btn play" data-act="play" data-type="'+(lv===1?'auto':lv===2?'auto2':'auto3')+'">▶ العبي</button>'+games+(lv===2?nextStickerHTML(k):lv===3?nextSticker3HTML(k):'')+'</div>'
   +   '<div class="panel"><h2 style="margin:0 0 8px">جرّة النجوم</h2><div class="jarbox">'+jarSVG()+'<div class="jarstat">'+jarRows+'</div></div>'+ticket+'</div>'
   +   '<div class="panel"><h2 style="margin:0">هذا الأسبوع</h2>'+week+'</div>'
   + '</div></div></div>';
}

function stickersHTML(){
  const k=kid(me), g=G(me);
  const fresh=unseen();
  const specials=Object.keys(k.specials).sort().map(d=>'<div'+(fresh.includes("s"+d)?' class="fresh"':'')+'>'+k.specials[d]+'<small>'+d.slice(5)+'</small></div>').join("");
  return '<div class="screen">'+topBar()+'<div class="scroll" style="flex:1;padding-bottom:16px"><div class="panel">'
   + '<h2 style="margin:0 0 10px;display:flex;align-items:center;gap:10px">📒 ملصقات '+g.ar+'<button class="btn small ghost" style="margin-inline-start:auto" data-act="home">🏠</button></h2>'
   + '<div class="stk">'+L.map(l=>k.stickers.includes(l.i)?'<div'+(fresh.includes("l"+l.i)?' class="fresh"':'')+'>'+l.pic+'<small>'+l.word+'</small></div>':'<div class="no">'+l.ch+'</div>').join("")+'</div>'
   + (l3(k).sc?L3SETS.map((st,si)=>'<h2 style="margin:16px 0 10px">🌟 ألبوم '+st.name+'</h2><div class="stk">'+st.items.map((e,j)=>{ const n=si*10+j, got=n<(l3(k).ss||0); return got?'<div'+(fresh.includes("y"+n)?' class="fresh"':'')+'>'+e+'</div>':'<div class="no mystery">'+e+'</div>'; }).join("")+'</div>').join(""):'')
   + (l2(k).sc?L2SETS.map((st,si)=>'<h2 style="margin:16px 0 10px">✨ ألبوم '+st.name+'</h2><div class="stk">'+st.items.map((e,j)=>{ const n=si*10+j, got=n<(l2(k).ss||0); return got?'<div'+(fresh.includes("x"+n)?' class="fresh"':'')+'>'+e+'</div>':'<div class="no mystery">'+e+'</div>'; }).join("")+'</div>').join(""):'')
   + (l2(k).wst.length?'<h2 style="margin:16px 0 10px">📖 كلمات قرأتِها</h2><div class="stk">'+l2(k).wst.map(w=>'<div'+(fresh.includes("w"+w)?' class="fresh"':'')+'>'+picHTML(WORDS[w].pic,38)+'<small>'+WORDS[w].w+'</small></div>').join("")+'</div>':'')
   + (specials?'<h2 style="margin:16px 0 10px">⭐ ملصقات الفريق</h2><div class="stk">'+specials+'</div>':'')
   + '</div></div></div>';
}

/* ---------- Room sheet / letter card ---------- */
function roomSheet(gi){
  const k=kid(me), grp=GROUPS[gi];
  if(gi>=k.unlocked) return '<div class="sheet center"><h3 style="justify-content:center">🔒 '+grp.name+'</h3><p style="font-size:20px">أكملي حروف '+GROUPS[gi-1].name+' لفتح هذه الغرفة</p><button class="btn" data-act="close">حسنًا</button></div>';
  return '<div class="sheet"><h3>'+grp.name+'<button class="iconbtn x" data-act="close" aria-label="close">✕</button></h3><div class="lcards">'
    + grp.letters.map(li=>{ const m=Math.min(5,k.mastery[li]||0); return '<button class="lcard" data-act="letter" data-i="'+li+'"><span class="ch">'+L[li].ch+'</span><span class="pic">'+L[li].pic+'</span><span class="w">'+L[li].word+'</span><span class="mdots">'+[0,1,2,3,4].map(n=>'<i class="'+(n<m?'on':'')+'"></i>').join("")+'</span></button>'; }).join("")
    + '</div></div>';
}
function letterSheet(i){
  const f=forms(i), l=L[i];
  const fs=l.join?[["آخر",f.fin],["وسط",f.med],["أول",f.ini],["وحده",f.iso]]:[["آخر",f.fin],["وحده",f.iso]];
  return '<div class="sheet center"><h3>'+l.name+'<button class="iconbtn x" data-act="close" aria-label="close">✕</button></h3>'
   + '<button data-act="sayletter" data-i="'+i+'" style="font-size:90px;line-height:1">'+l.pic+'</button>'
   + '<div style="font-family:var(--f-letter);font-size:40px;font-weight:700">'+l.word+'</div>'
   + '<div class="formsrow">'+fs.map(([n,v])=>'<div><b>'+v+'</b><small>'+n+'</small></div>').join("")+'</div>'
   + '<div class="row"><button class="btn" data-act="sayletter" data-i="'+i+'">🔊 اسمعي</button><button class="btn gold" data-act="practice" data-i="'+i+'">✍️ ارسمي</button></div></div>';
}

/* ---------- PIN ---------- */
let pinBuf="";
function pinSheet(){
  const creating=!S.settings.pin;
  return '<div class="sheet parent" style="max-width:380px"><h3>'+(creating?'Create a parent PIN':'Parent PIN')+'<button class="iconbtn x" data-act="close" aria-label="close">✕</button></h3>'
   + (creating?'<p style="margin:0 0 6px">Choose 4 digits. You will need this to open the parents area and to approve rewards.</p>':'')
   + '<div class="pinshow">'+[0,1,2,3].map(n=>'<i class="'+(n<pinBuf.length?'on':'')+'"></i>').join("")+'</div>'
   + '<div class="pinmsg" id="pinmsg"></div>'
   + '<div class="pin">'+[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(d=>d===""?'<span></span>':'<button data-act="pin" data-d="'+d+'">'+d+'</button>').join("")+'</div></div>';
}
function pinPress(d){
  if(d==="⌫"){ pinBuf=pinBuf.slice(0,-1); renderOverlay(); return; }
  if(pinBuf.length>=4) return;
  pinBuf+=d; renderOverlay();
  if(pinBuf.length<4) return;
  const entered=pinBuf; pinBuf="";
  if(!S.settings.pin){ saveDoc("settings","family",Object.assign({},S.settings,{pin:entered})); finishPin(); return; }
  if(entered===S.settings.pin){ finishPin(); }
  else { setTimeout(()=>{ renderOverlay(); const m=$("#pinmsg"); if(m) m.textContent="Wrong PIN"; },150); sfx.no(); }
}
function finishPin(){
  const then=overlay.then; overlay=null;
  if(then.kind==="parent") go("parent");
  else if(then.kind==="redeem"){
    saveDoc("redeem",then.key,{at:new Date().toISOString(),girl:me||null});
    sfx.fan(); confetti(); say("اِسْتَمْتِعْنَ!"); render();
  }
}

/* ---------- Overlay ---------- */
function renderOverlay(){
  let el=$("#veil"); if(el) el.remove();
  if(!overlay) return;
  let html="";
  if(overlay.type==="room") html=roomSheet(overlay.g);
  else if(overlay.type==="letter") html=letterSheet(overlay.i);
  else if(overlay.type==="pin") html=pinSheet();
  else if(overlay.type==="end") html=endSheet();
  else if(overlay.type==="sticker") html=stickerSheet();
  else if(overlay.type==="msg") html='<div class="sheet center endbox"><div style="font-size:80px">'+overlay.icon+'</div><h3>'+esc(overlay.text)+'</h3><button class="btn" data-act="close">👍</button></div>';
  el=document.createElement("div"); el.className="veil"; el.id="veil"; el.innerHTML=html;
  el.addEventListener("click",e=>{ if(e.target===el && overlay && overlay.type!=="end" && overlay.type!=="sticker"){ overlay=null; renderOverlay(); } });
  document.body.appendChild(el);
}

/* ---------- Question generation ---------- */
function pool(k){ const a=[]; for(let g=0;g<k.unlocked;g++) a.push(...GROUPS[g].letters); return a; }
function pickLetters(k,n){
  const p=pool(k), newest=GROUPS[k.unlocked-1].letters, out=[];
  for(let t=0;t<n;t++){
    const w=p.map(i=>(out.includes(i)?0.15:1)*((6-Math.min(5,k.mastery[i]||0))+(newest.includes(i)?3:0)));
    let sum=w.reduce((a,b)=>a+b,0), r=Math.random()*sum, pick=p[0];
    for(let j=0;j<p.length;j++){ r-=w[j]; if(r<=0){ pick=p[j]; break; } }
    out.push(pick);
  }
  return out;
}
function options(k,target){
  const p=pool(k), fam=(FAMILIES.find(f=>f.includes(target))||[]).filter(i=>i!==target);
  const opts=[target];
  const famIn=shuffle(fam.filter(i=>p.includes(i)));
  if(famIn.length) opts.push(famIn[0]);
  const rest=shuffle(p.filter(i=>!opts.includes(i)));
  while(opts.length<3 && rest.length) opts.push(rest.pop());
  const all=shuffle(L.map(l=>l.i).filter(i=>!opts.includes(i)));
  while(opts.length<3) opts.push(all.pop());
  return shuffle(opts);
}
function makeRound(type,only){
  if(L3TYPES.includes(type)) return makeRound3(type);
  if(L2TYPES.includes(type)) return makeRound2(type);
  const k=kid(me);
  if(type==="auto"){ type=ROTATION[k.rot%ROTATION.length]; }
  const n = type==="trace" ? (only!=null?1:2) : 4;
  const targets = only!=null ? [only] : pickLetters(k,n);
  const qs=targets.map(t=>{
    const q={t,opts:type==="trace"?null:options(k,t),tries:0,done:false,ok:false};
    if(type==="forms"){ const f=forms(t); q.form = L[t].join ? rnd([f.ini,f.med,f.fin]) : f.fin; }
    return q;
  });
  return {type,qs,cur:0,practice:only!=null};
}

/* ---------- Game screen ---------- */
let round=null, trace=null;
function startRound(type,only){
  round=makeRound(type,only);
  view={name:"game"}; overlay=null; render();
  say(GAMES[round.type].say);
  setTimeout(()=>promptCurrent(),1900);
}
function promptCurrent(){
  if(!round || view.name!=="game") return;
  if(round.level===3){ promptCurrent3(); return; }
  if(STAGE_OF[round.type]!=null){ promptCurrent2(); return; }
  const q=round.qs[round.cur], l=L[q.t];
  if(round.type==="hear") say(l.name);
  else if(round.type==="pic") say(l.word);
  else if(round.type==="trace") say(l.name);
}
function gameHTML(){
  if(round.level===3) return gameHTML3();
  if(STAGE_OF[round.type]!=null) return gameHTML2();
  const r=round, q=r.qs[r.cur], l=L[q.t], gm=GAMES[r.type];
  const dots='<div class="dots">'+r.qs.map((x,n)=>'<i class="'+(x.done?(x.ok?'ok':'miss'):(n===r.cur?'cur':''))+'"></i>').join("")+'</div>';
  let body='';
  if(r.type==="hear"){
    body='<div class="prompt"><button class="speak" data-act="replay" aria-label="listen again">🔊</button>'+gm.title+'</div>';
  } else if(r.type==="pic"){
    body='<div class="prompt">'+gm.title+'<button class="speak" data-act="replay" aria-label="listen again">🔊</button></div><button class="bigpic" data-act="replay">'+l.pic+'</button>';
  } else if(r.type==="forms"){
    body='<div class="prompt">'+gm.title+'</div><div class="bigform">'+q.form+'</div>';
  } else if(r.type==="trace"){
    body='<div class="prompt"><button class="speak" data-act="replay" aria-label="listen again">🔊</button>'+gm.title+' <span style="font-family:var(--f-letter)">'+l.name+'</span></div><div class="trace-wrap" id="tw"><canvas id="tc"></canvas></div><div class="trace-tools"><button class="btn ghost" data-act="tclear">🧽 امسحي</button></div>';
  }
  if(r.type!=="trace"){
    body+='<div class="opts">'+q.opts.map(o=>'<button class="opt" data-act="answer" data-o="'+o+'" id="o'+o+'">'+L[o].ch+'</button>').join("")+'</div>';
    body+='<div class="reveal" id="reveal"></div>';
  }
  return '<div class="screen"><div class="gtop"><button class="iconbtn" data-act="quit" aria-label="back home">✕</button>'+dots+face(me,52)+'</div><div class="stage">'+body+'</div></div>';
}
function answer(o){
  const q=round.qs[round.cur]; if(q.done) return;
  const btn=$("#o"+o);
  if(o===q.t){
    q.done=true; q.ok=(q.tries===0);
    btn.classList.add("right"); sfx.ok();
    const l=L[q.t];
    const rv=$("#reveal"); if(rv) rv.textContent=l.pic+"  "+l.word;
    setTimeout(()=>say(rnd(PRAISE)+" "+l.word),250);
    bumpMastery(q.t, q.ok?1:0);
    setTimeout(nextQ,1900);
  } else {
    if(btn.classList.contains("wrong")) return;
    q.tries++; btn.classList.add("wrong"); sfx.no();
    if(q.tries===1) bumpMastery(q.t,-1);
    setTimeout(()=>{ if(round.type==="forms") say("حَاوِلِي مَرَّةً أُخْرَى"); else promptCurrent(); },350);
  }
}
let pendingKid=null;
function bumpMastery(i,d){
  const k=pendingKid||kid(me);
  const before=k.mastery[i]||0;
  k.mastery=Object.assign({},k.mastery,{[i]:Math.max(0,Math.min(5,before+d))});
  pendingKid=k;
}
function nextQ(){
  if(!round) return;
  if(round.cur<round.qs.length-1){ round.cur++; render(); setTimeout(promptCurrent,300); }
  else endRound();
}

/* Tracing */
function afterGameRender(){
  if(round.type!=="trace") return;
  const q=round.qs[round.cur], wrap=$("#tw"), cv=$("#tc");
  const size=Math.max(220,Math.min(innerWidth-48, innerHeight-260, 460));
  const dpr=window.devicePixelRatio||1;
  cv.width=size*dpr; cv.height=size*dpr; cv.style.width=size+"px"; cv.style.height=size+"px";
  const ctx=cv.getContext("2d"); ctx.scale(dpr,dpr);
  const N=90, mask=document.createElement("canvas"); mask.width=mask.height=N;
  const ink=document.createElement("canvas"); ink.width=ink.height=N;
  const mctx=mask.getContext("2d"), ictx=ink.getContext("2d");
  const ch=L[q.t].ch, color=G(me).color;
  trace={ctx,size,N,mctx,ictx,ch,color,drawing:false,last:null,strokes:0,done:false};
  const fontFam='"Noto Naskh Arabic", serif';
  function layout(c,S){
    c.font='700 100px '+fontFam; const m=c.measureText(ch);
    const bw=(m.actualBoundingBoxLeft+m.actualBoundingBoxRight)||60, bh=(m.actualBoundingBoxAscent+m.actualBoundingBoxDescent)||80;
    const fs=100*Math.min(0.7*S/bw,0.7*S/bh);
    c.font='700 '+fs+'px '+fontFam; const m2=c.measureText(ch);
    const x=S/2+(m2.actualBoundingBoxLeft-m2.actualBoundingBoxRight)/2, y=S/2+(m2.actualBoundingBoxAscent-m2.actualBoundingBoxDescent)/2;
    return {x,y};
  }
  function drawGuide(){
    ctx.clearRect(0,0,size,size);
    ctx.textAlign="left"; ctx.textBaseline="alphabetic"; ctx.direction="ltr";
    const p=layout(ctx,size);
    ctx.textAlign="left";
    ctx.fillStyle="#EFE6D3"; ctx.fillText(ch,p.x,p.y);
    ctx.setLineDash([6,8]); ctx.lineWidth=2.5; ctx.strokeStyle="#B9AC90"; ctx.strokeText(ch,p.x,p.y); ctx.setLineDash([]);
    mctx.clearRect(0,0,N,N); mctx.direction="ltr"; mctx.textBaseline="alphabetic"; const pm=layout(mctx,N); mctx.fillStyle="#000"; mctx.fillText(ch,pm.x,pm.y);
    ictx.clearRect(0,0,N,N);
  }
  trace.reset=drawGuide;
  const ready=document.fonts && document.fonts.load ? document.fonts.load('700 100px "Noto Naskh Arabic"',ch) : Promise.resolve();
  ready.catch(()=>{}).then(drawGuide);
  const pos=e=>{ const b=cv.getBoundingClientRect(); return [e.clientX-b.left,e.clientY-b.top]; };
  cv.addEventListener("pointerdown",e=>{ if(trace.done) return; cv.setPointerCapture(e.pointerId); trace.drawing=true; trace.last=pos(e); dot(trace.last); });
  cv.addEventListener("pointermove",e=>{ if(!trace.drawing) return; const p=pos(e); seg(trace.last,p); trace.last=p; });
  const up=()=>{ if(!trace.drawing) return; trace.drawing=false; trace.strokes++; evaluate(); };
  cv.addEventListener("pointerup",up); cv.addEventListener("pointercancel",up);
  function seg(a,b){
    ctx.strokeStyle=color; ctx.lineCap="round"; ctx.lineJoin="round"; ctx.lineWidth=size*0.075;
    ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.stroke();
    const s=N/size; ictx.strokeStyle="#000"; ictx.lineCap="round"; ictx.lineWidth=size*0.075*s;
    ictx.beginPath(); ictx.moveTo(a[0]*s,a[1]*s); ictx.lineTo(b[0]*s,b[1]*s); ictx.stroke();
  }
  function dot(p){ seg(p,[p[0]+0.1,p[1]+0.1]); }
}
function letterParts(isM,N){
  // Split the letter into its separate pieces (main body, dots, hamza) so each one can be checked.
  const lab=new Int32Array(N*N).fill(-1), parts=[];
  for(let i=0;i<N*N;i++){
    if(!isM[i] || lab[i]>=0) continue;
    const id=parts.length, cells=[], stack=[i]; lab[i]=id;
    while(stack.length){
      const c=stack.pop(); cells.push(c);
      const x=c%N, y=(c-x)/N;
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const xx=x+dx, yy=y+dy; if(xx<0||yy<0||xx>=N||yy>=N) return; const j=yy*N+xx; if(isM[j] && lab[j]<0){ lab[j]=id; stack.push(j); } });
    }
    parts.push(cells);
  }
  return parts.filter(c=>c.length>=4);
}
function evaluate(){
  const t=trace, N=t.N;
  const m=t.mctx.getImageData(0,0,N,N).data, k=t.ictx.getImageData(0,0,N,N).data;
  const isM=new Uint8Array(N*N), near=new Uint8Array(N*N), ink=new Uint8Array(N*N);
  for(let i=0;i<N*N;i++){ isM[i]=m[i*4+3]>60?1:0; ink[i]=k[i*4+3]>60?1:0; }
  const D=4;
  for(let y=0;y<N;y++) for(let x=0;x<N;x++) if(isM[y*N+x]) for(let dy=-D;dy<=D;dy++) for(let dx=-D;dx<=D;dx++){ const xx=x+dx,yy=y+dy; if(xx>=0&&yy>=0&&xx<N&&yy<N) near[yy*N+xx]=1; }
  let mc=0,cov=0,ic=0,out=0;
  for(let i=0;i<N*N;i++){ if(isM[i]){ mc++; if(ink[i]) cov++; } if(ink[i]){ ic++; if(!near[i]) out++; } }
  const coverage=mc?cov/mc:0, outside=ic?out/ic:1;
  // Every piece of the letter must be traced: the body (60%+) and each dot or hamza (at least a quarter of it, about one finger tap).
  const parts=letterParts(isM,N), missing=parts.filter(c=>c.filter(i=>ink[i]).length/c.length<(c.length===Math.max(...parts.map(p=>p.length))?0.6:0.25));
  const q=round.qs[round.cur];
  if(coverage>=0.6 && outside<0.35 && !missing.length){
    t.done=true; q.done=true; q.ok=true;
    sfx.ok(); say(rnd(PRAISE)); bumpMastery(q.t,1);
    setTimeout(nextQ,1500);
  } else if(coverage>=0.6 && outside<0.35 && missing.length){
    // Body is done but a dot (or the hamza) is not: point at it and remind her.
    const sc=t.size/N;
    missing.forEach(c=>{
      let x0=N,y0=N,x1=0,y1=0; c.forEach(i=>{ const x=i%N, y=(i-x)/N; x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y); });
      const cx=(x0+x1+1)/2*sc, cy=(y0+y1+1)/2*sc, r=Math.max(x1-x0+1,y1-y0+1)*sc/2+12;
      t.ctx.save(); t.ctx.setLineDash([6,6]); t.ctx.lineWidth=4; t.ctx.strokeStyle="#F2B82F"; t.ctx.beginPath(); t.ctx.arc(cx,cy,r,0,Math.PI*2); t.ctx.stroke(); t.ctx.restore();
    });
    sfx.no(); say(q.t===0 ? "لَا تَنْسَيِ الْهَمْزَة" : "لَا تَنْسَيِ النِّقَاط");
  } else if(t.strokes>=6 && coverage<0.6){
    say("لِنُحَاوِلْ مِنْ جَدِيد"); setTimeout(()=>t.reset&&t.reset(),700); t.strokes=0;
  } else if(outside>=0.35 && t.strokes>=2){
    say("اُرْسُمِي فَوْقَ الْخَطّ"); setTimeout(()=>t.reset&&t.reset(),700); t.strokes=0;
  }
}

/* End of round */
let endInfo=null;
function endRound(){
  const r=round, k=pendingKid||kid(me); pendingKid=null;
  const correct=r.qs.filter(q=>q.ok).length;
  const need = r.type==="trace" ? 0 : r.type==="wbuild"||r.type==="s3story" ? 1 : r.type==="wread"||r.type==="s3read"||r.type==="s3order" ? 2 : 3;
  const pass = correct>=need;
  const msgs=[];
  k.stars=(k.stars||0)+correct;
  if(!r.practice) k.rot=(k.rot||0)+1;
  // stickers for mastered letters
  const newStickers=[];
  Object.keys(k.mastery).forEach(i=>{ i=+i; if(k.mastery[i]>=5 && !k.stickers.includes(i)){ k.stickers=k.stickers.concat([i]); newStickers.push(i); } });
  // unlock next room
  let unlockedRoom=null;
  if(k.unlocked<GROUPS.length){
    const newest=GROUPS[k.unlocked-1].letters;
    if(newest.filter(i=>(k.mastery[i]||0)>=3).length>=3){ k.unlocked++; unlockedRoom=GROUPS[k.unlocked-1].name; }
  }
  // reading level: new path stations and word stickers
  let unlockedStage=null; const newWords=[], newL2=[];
  if(r.stageBefore!=null){
    const after=stageCount(k); if(after>r.stageBefore) unlockedStage=STAGES[after-1].name;
    const l=l2(k); Object.keys(l.words).forEach(w=>{ w=+w; if(l.words[w]>=3 && !l.wst.includes(w)) newWords.push(w); });
    if(newWords.length) k.l2=Object.assign({},l,{wst:l.wst.concat(newWords)});
    const l3=l2(k), earned=l2Earned(l3);
    for(let n=(l3.ss||0); n<earned; n++) newL2.push(n);
    if(newL2.length) k.l2=Object.assign({},l3,{ss:earned});
  }
  // sentences level: stations and album stickers
  const newL3=[];
  if(r.level===3){
    const after=stage3Count(k); if(after>r.stage3Before) unlockedStage = after>=4 ? "قصص واقرئي بصوتك" : STAGES3[after-1].name;
    const l=l3(k), earned=l3Earned(l);
    for(let n=(l.ss||0); n<earned; n++) newL3.push(n);
    if(newL3.length) k.l3=Object.assign({},l,{ss:earned});
  }
  const wasFull=dayFull();
  if(pass && !r.practice){
    const id=today()+"_"+me, cur=S.jar[id]||{date:today(),girl:me,n:0,stars:0};
    saveDoc("jar",id,{date:today(),girl:me,n:(cur.n||0)+1,stars:(cur.stars||0)+correct});
  }
  let gotSpecial=false;
  if(dayFull() && !k.specials[today()]){ const g=G(me); k.specials=Object.assign({},k.specials,{[today()]:g.specials[Object.keys(k.specials).length%g.specials.length]}); gotSpecial=true; }
  saveDoc("kids",me,k);
  endInfo={l3:r.level===3,l2:r.stageBefore!=null,correct,total:r.qs.length,pass,need,practice:r.practice,newStickers,unlockedRoom,unlockedStage,justFull:!wasFull&&dayFull()};
  const reveals=newStickers.map(i=>({pic:L[i].pic,label:L[i].word,say:"مُلْصَقٌ جَدِيد! "+L[i].word}));
  newWords.forEach(w=>reveals.push({pic:WORDS[w].pic.startsWith("face:")?face(WORDS[w].pic.slice(5),170):WORDS[w].pic,label:WORDS[w].w,say:"مُلْصَقٌ جَدِيد! "+WORDS[w].w}));
  newL3.forEach(n=>reveals.push({pic:L3STK[n].e,label:"ألبوم "+L3SETS[L3STK[n].set].name,say:"مُلْصَقٌ جَدِيد!"}));
  newL2.forEach(n=>reveals.push({pic:L2STK[n].e,label:"ألبوم "+L2SETS[L2STK[n].set].name,say:"مُلْصَقٌ جَدِيد!"}));
  if(gotSpecial) reveals.push({pic:k.specials[today()],label:"ملصق الفريق",say:"مُلْصَقُ الْفَرِيق!"});
  markUnseen(newStickers.map(i=>"l"+i).concat(newWords.map(w=>"w"+w)).concat(newL2.map(n=>"x"+n)).concat(newL3.map(n=>"y"+n)).concat(gotSpecial?["s"+today()]:[]));
  if(reveals.length){ showStickers(reveals,false); return; }
  overlay={type:"end"}; renderOverlay(); endSounds();
}
function endSounds(){
  const e=endInfo;
  if(e.justFull){ sfx.fan(); confetti(); lsSet("bh_cele_"+today(),1); setTimeout(()=>say("اِمْتَلَأَتِ الْجَرَّة! أَحْسَنْتُنَّ"),300); }
  else if(e.unlockedRoom){ sfx.fan(); setTimeout(()=>say("فَتَحْتِ غُرْفَةً جَدِيدَة!"),300); }
  else if(e.unlockedStage){ sfx.fan(); confetti(); setTimeout(()=>say("فَتَحْتِ مَحَطَّةً جَدِيدَة!"),300); }
  else if(e.pass){ setTimeout(()=>say(rnd(PRAISE)),200); }
  else setTimeout(()=>say("قَرِيبًا! حَاوِلِي مَرَّةً أُخْرَى"),200);
}
function endSheet(){
  const e=endInfo, sh=share(), n=jarCount(me), left=Math.max(0,sh-n);
  let s='<div class="sheet endbox">';
  if(e.practice) s+='<div style="font-size:70px">✍️</div><h3>أحسنتِ!</h3>';
  else {
    s+='<div class="stars">'+[...Array(e.total)].map((_,i)=>'<span class="'+(i<e.correct?'':'off')+'">★</span>').join("")+'</div>';
    s+= e.pass ? '<h3>أحسنتِ! <span style="color:'+G(me).color+'">+1</span> في الجرّة</h3>' : '<h3>قريبًا! حاولي مرة ثانية</h3><p style="margin:0">تحتاجين '+e.need+' نجوم لتضيفي إلى الجرّة</p>';
  }
  if(e.unlockedStage) s+='<div class="panel" style="background:#FFF3C9;font-size:22px;font-weight:800">🔓 محطة جديدة: '+e.unlockedStage+'!</div>';
  if(e.unlockedRoom) s+='<div class="panel" style="background:#FFF3C9;font-size:22px;font-weight:800">🔓 فتحتِ '+e.unlockedRoom+'!</div>';
  if(e.newStickers.length) s+='<div class="panel" style="background:#F6F0E2;font-size:22px;font-weight:800">ملصق جديد! '+e.newStickers.map(i=>L[i].pic).join(" ")+'</div>';
  if(e.l2) s+=nextStickerHTML(kid(me));
  if(e.l3) s+=nextSticker3HTML(kid(me));
  if(e.justFull) s+='<div class="panel" style="background:#FFF3C9;font-size:22px;font-weight:800">🎉 امتلأت الجرّة! 🎟️ '+esc(S.settings.reward)+'</div>';
  else if(!e.practice) s+='<div style="font-weight:700">'+(left?('باقي لكِ '+left+' اليوم'):'✓ أكملتِ حصّتكِ اليوم')+'</div>';
  s+='<div class="row"><button class="btn gold" data-act="again">🔁 مرة أخرى</button><button class="btn ghost" data-act="home">🏠 البيت</button></div></div>';
  return s;
}

function checkCelebrate(){
  if(view.name!=="home" || !dayFull() || lsGet("bh_cele_"+today(),0)) return;
  lsSet("bh_cele_"+today(),1); sfx.fan(); confetti(); toast("🎉 امتلأت الجرّة!");
}
/* Sticker reveal: a full-screen moment for every new sticker */
function unseen(){ return lsGet("bh_unseen_"+me,[]); }
function markUnseen(ids){ if(ids.length) lsSet("bh_unseen_"+me, unseen().concat(ids)); }
function seenAll(){ lsSet("bh_unseen_"+me,[]); document.querySelectorAll(".newdot").forEach(e=>e.remove()); }
function showStickers(list,thenHome){ overlay={type:"sticker",list,idx:0,thenHome}; renderOverlay(); celebrateSticker(list[0]); }
function celebrateSticker(it){ sfx.fan(); confetti(); setTimeout(()=>say(it.say),500); }
function stickerSheet(){
  const it=overlay.list[overlay.idx], last=overlay.idx===overlay.list.length-1;
  return '<div class="sheet stkreveal"><div class="rays"></div><h3>⭐ ملصق جديد! ⭐</h3><div class="bigsticker">'+it.pic+'</div><div class="stklabel">'+esc(it.label)+'</div>'
    + '<div class="row">'+(last?'<button class="btn gold" data-act="stknext">رائع! 🎉</button><button class="btn ghost" data-act="stkbook">📒 ملصقاتي</button>':'<button class="btn gold" data-act="stknext">التالي ▶</button>')+'</div></div>';
}
function stickerNext(){
  if(overlay.idx<overlay.list.length-1){ overlay.idx++; renderOverlay(); celebrateSticker(overlay.list[overlay.idx]); return; }
  if(overlay.thenHome){ overlay=null; renderOverlay(); return; }
  overlay={type:"end"}; renderOverlay(); endSounds();
}
function ensureSpecial(){
  if(!me || !dayFull()) return null;
  const k=kid(me); if(k.specials[today()]) return null;
  const g=G(me); k.specials=Object.assign({},k.specials,{[today()]:g.specials[Object.keys(k.specials).length%g.specials.length]});
  saveDoc("kids",me,k); markUnseen(["s"+today()]);
  return {pic:k.specials[today()],label:"ملصق الفريق",say:"مُلْصَقُ الْفَرِيق!"};
}

/* ======================= Level 2: reading ======================= */
const HAR={a:"َ",i:"ِ",u:"ُ"};
function syl(t,v){
  if(t===0) return {a:"أَ",i:"إِ",u:"أُ",aa:"آ",ii:"إِي",uu:"أُو"}[v];
  const c=L[t].ch;
  return {a:c+HAR.a,i:c+HAR.i,u:c+HAR.u,aa:c+HAR.a+"ا",ii:c+HAR.i+"ي",uu:c+HAR.u+"و"}[v];
}
// Simple vowelled words, each with a picture. A word appears once all its letters are open in the house.
const WORDS=[
 ["بَاب","🚪"],["دُبّ","🐻"],["أَب","👨"],["أُمّ","👩"],["بَحْر","🌊"],["تَاج","👑"],["دَجَاج","🐔"],["سَحَاب","☁️"],["جَرَس","🔔"],
 ["بَيْت","🏠"],["بِنْت","👧"],["وَلَد","👦"],["قِطّ","🐈"],["فِيل","🐘"],["نَار","🔥"],["شَمْس","☀️"],["قَمَر","🌙"],["مَوْز","🍌"],
 ["وَرْد","🌹"],["كَلْب","🐕"],["سَمَك","🐟"],["جَمَل","🐫"],["يَد","✋"],["فَم","👄"],["زَيْت","🫒"],["ثَوْب","👗"],["خُبْز","🍞"],
 ["لَبَن","🥛"],["عَيْن","👁️"],["نَمِر","🐯"],["دِيك","🐓"],["كُرَة","⚽"],["بَيْض","🥚"],["حُوت","🐋"],["ثَلْج","❄️"],["صَقْر","🦅"],
 ["طَبْل","🥁"],["شَاي","🍵"],["عَسَل","🍯"],["غَزَال","🦌"],["هَاتِف","📱"],["صُوفِي","face:sophie"],["أُولِيفْيَا","face:olivia"],["جُولْيَا","face:julia"]
].map(([w,pic],i)=>({i,w,pic}));
const stripH = s => s.replace(/[ً-ْٰـ]/g,"");
function letterIdx(ch){ const m={"ا":0,"أ":0,"إ":0,"آ":0,"ة":2,"ى":27}; return ch in m ? m[ch] : L.findIndex(l=>l.ch===ch); }
WORDS.forEach(o=>{ o.chars=[...stripH(o.w)]; o.letters=[...new Set(o.chars.map(letterIdx))]; });
function picHTML(p,size){ return p.startsWith("face:") ? face(p.slice(5),size) : '<span style="font-size:'+size+'px;line-height:1">'+p+'</span>'; }

// Level 2 collectible stickers: a new one every few correct answers, in themed albums.
const L2SETS=[
 {name:"البحر",   items:["🐠","🐙","🦀","🐬","🐳","🦈","🐢","🦑","🐚","🐡"]},
 {name:"الفضاء",  items:["🚀","🪐","🌙","⭐","☄️","🛸","🌍","👩‍🚀","🔭","🌌"]},
 {name:"الحلويات",items:["🍦","🍩","🧁","🍭","🍪","🍫","🍰","🎂","🍬","🍓"]},
 {name:"الحيوانات",items:["🦄","🐼","🦋","🐰","🐨","🐧","🦔","🐹","🦜","🐞"]}
];
const L2STK=[].concat(...L2SETS.map((s,si)=>s.items.map(e=>({e,set:si}))));
const PER_STICKER=6;
function l2Earned(l){ return Math.min(L2STK.length, Math.floor((l.sc||0)/PER_STICKER)); }
function nextStickerHTML(k){
  const l=l2(k), got=l2Earned(l);
  if(got>=L2STK.length) return '<div class="nextstk"><span class="ns-pic">🏆</span><b>جمعتِ كل الملصقات!</b></div>';
  const have=(l.sc||0)%PER_STICKER, nx=L2STK[got];
  return '<div class="nextstk"><span class="ns-pic mystery">'+nx.e+'</span><div style="flex:1"><b>الملصق القادم</b><div class="ns-dots">'
    +[...Array(PER_STICKER)].map((_,i)=>'<i class="'+(i<have?'on':'')+'">★</i>').join("")+'</div></div><small>'+(PER_STICKER-have)+' ⭐</small></div>';
}
const STAGES=[
 {type:"syl",  name:"الحركات",     sample:"بَ بِ بُ", need:15},
 {type:"long", name:"المدود",      sample:"با بو بي", need:15},
 {type:"words",name:"الكلمات",     sample:"بَاب",     need:20},
 {type:"wread",name:"اقرئي بصوتك", sample:"🎤",       need:0}
];
const L2TYPES=["syl","long","wpic","whear","wbuild","wread","words","auto2"];
const STAGE_OF={syl:0,long:1,wpic:2,whear:2,wbuild:2,wread:3};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition||null;
let micBlocked=false;
function l2(k){ return Object.assign({pts:[0,0,0,0],words:{},wst:[],open:false},k.l2||{}); }
function l2Open(k){ return k.unlocked>=3 || l2(k).open; }
function stageFromPts(p){ let s=1; if(p[0]>=15) s=2; if(s>=2&&p[1]>=15) s=3; if(s>=3&&p[2]>=20) s=4; return s; }
function stageCount(k){ const l=l2(k); return Math.max(l.stage||1, stageFromPts(l.pts)); } // a station never closes again once opened
function availWords(k){ const P=new Set(pool(k)); return WORDS.filter(o=>o.letters.every(i=>P.has(i))); }
function stageState(k,s){ // "open" | "locked" | reason text
  if(s>=stageCount(k)) return "locked";
  if(s>=2 && availWords(k).length<4) return "افتحي غرفًا أكثر في بيت الحروف لتظهر الكلمات";
  if(s===3 && (!SR || micBlocked)) return "الميكروفون غير متاح على هذا الجهاز";
  return "open";
}
function pickWords(k,n,from){
  const W=from||availWords(k), m=l2(k).words, out=[];
  for(let t=0;t<n;t++){
    const w=W.map(o=>(out.includes(o.i)?0.1:1)*(4-Math.min(3,m[o.i]||0)));
    let r=Math.random()*w.reduce((a,b)=>a+b,0), pick=W[0].i;
    for(let j=0;j<W.length;j++){ r-=w[j]; if(r<=0){ pick=W[j].i; break; } }
    out.push(pick);
  }
  return out;
}
function otherWords(k,target,n){
  const A=availWords(k).filter(o=>o.i!==target && o.pic!==WORDS[target].pic);
  const same=shuffle(A.filter(o=>o.chars[0]===WORDS[target].chars[0])), rest=shuffle(A.filter(o=>o.chars[0]!==WORDS[target].chars[0]));
  return same.concat(rest).slice(0,n).map(o=>o.i);
}
function makeRound2(type){
  const k=kid(me);
  if(type==="auto2"){
    const open=STAGES.map((s,i)=>i).filter(i=>stageState(k,i)==="open");
    const top=open[open.length-1];
    type=STAGES[(Math.random()<0.6||open.length===1)?top:rnd(open)].type;
  }
  if(type==="words") type=rnd(["wpic","whear","wbuild"]);
  const stage=STAGE_OF[type];
  let qs=[];
  if(type==="syl"){
    qs=pickLetters(k,4).map(t=>{
      const v=rnd(["a","i","u"]);
      const opts = Math.random()<0.6 ? ["a","i","u"].map(x=>({html:syl(t,x),ok:x===v})) : options(k,t).map(x=>({html:syl(x,v),ok:x===t}));
      return {stage,say:syl(t,v),opts:shuffle(opts),tries:0,done:false,ok:false};
    });
  } else if(type==="long"){
    qs=pickLetters(k,4).map(t=>{
      const v=rnd(["a","i","u"]), o=rnd(["a","i","u"].filter(x=>x!==v));
      const cands=[{html:syl(t,v),key:"s"},{html:syl(t,v+v),key:"l"},{html:syl(t,o+o),key:"o"}];
      const target=Math.random()<0.5?"s":"l";
      return {stage,say:cands.find(c=>c.key===target).html,opts:shuffle(cands.map(c=>({html:c.html,ok:c.key===target}))),tries:0,done:false,ok:false};
    });
  } else {
    const n = type==="wbuild"?2 : type==="wread"?3 : 4;
    qs=pickWords(k,n).map(w=>{
      const q={stage,w,tries:0,done:false,ok:false,helped:false};
      if(type==="wpic") q.opts=shuffle([w].concat(otherWords(k,w,2))).map(x=>({html:picHTML(WORDS[x].pic,64),ok:x===w}));
      if(type==="whear") q.opts=shuffle([w].concat(otherWords(k,w,2))).map(x=>({html:WORDS[x].w,ok:x===w,word:true}));
      if(type==="wbuild"){
        const extra=rnd(pool(k).filter(i=>!WORDS[w].letters.includes(i))); 
        const chars=WORDS[w].chars.slice();
        q.tiles=shuffle(chars.map((c,j)=>({c,used:false,id:j})).concat(extra!=null?[{c:extra===0?"ا":L[extra].ch,used:false,id:99}]:[]));
        q.built=0;
      }
      return q;
    });
  }
  return {type,qs,cur:0,practice:false,stageBefore:stageCount(k)};
}
function promptCurrent2(){
  const q=round.qs[round.cur];
  if(round.type==="syl"||round.type==="long") say(q.say,0.7);
  else if(round.type==="whear"||round.type==="wbuild") say(WORDS[q.w].w);
}
function gameHTML2(){
  const r=round, q=r.qs[r.cur], gm=GAMES[r.type];
  const dots='<div class="dots">'+r.qs.map((x,n)=>'<i class="'+(x.done?(x.ok?'ok':'miss'):(n===r.cur?'cur':''))+'"></i>').join("")+'</div>';
  const speak='<button class="speak" data-act="replay" aria-label="listen again">🔊</button>';
  let body='';
  if(r.type==="syl"||r.type==="long"||r.type==="whear"){
    body='<div class="prompt">'+speak+gm.title+'</div><div class="opts">'+q.opts.map((o,i)=>'<button class="opt'+(o.word?' optw':'')+'" data-act="answer2" data-o="'+i+'" id="p'+i+'">'+o.html+'</button>').join("")+'</div><div class="reveal" id="reveal"></div>';
  } else if(r.type==="wpic"){
    body='<div class="prompt">'+gm.title+'<button class="speak small" data-act="help" aria-label="help">🔊</button></div><div class="bigword">'+WORDS[q.w].w+'</div><div class="opts">'+q.opts.map((o,i)=>'<button class="opt" data-act="answer2" data-o="'+i+'" id="p'+i+'">'+o.html+'</button>').join("")+'</div><div class="reveal" id="reveal"></div>';
  } else if(r.type==="wbuild"){
    const o=WORDS[q.w], built=o.chars.slice(0,q.built).join("");
    body='<div class="prompt">'+speak+gm.title+'</div><div style="display:flex;align-items:center;gap:18px">'+picHTML(o.pic,96)
      +'<div class="bigword build">'+(built||'&nbsp;')+'<span class="slotsleft">'+'•'.repeat(o.chars.length-q.built)+'</span></div></div>'
      +'<div class="tiles">'+q.tiles.map((t,i)=>'<button class="tile'+(t.used?' used':'')+'" data-act="tile" data-o="'+i+'" id="t'+i+'"'+(t.used?' disabled':'')+'>'+t.c+'</button>').join("")+'</div>';
  } else if(r.type==="wread"){
    body='<div class="prompt">'+gm.title+'</div><div class="bigword">'+WORDS[q.w].w+'</div>'
      +'<button class="mic" data-act="mic" id="micbtn" aria-label="microphone">🎤</button><div class="micstat" id="micstat">اضغطي على الميكروفون واقرئي</div><div class="reveal" id="reveal"></div>';
  }
  return '<div class="screen"><div class="gtop"><button class="iconbtn" data-act="quit" aria-label="back home">✕</button>'+dots+face(me,52)+'</div><div class="stage">'+body+'</div></div>';
}
function bumpL2(q,d){
  if(!d) return;
  const k=pendingKid||kid(me), l=l2(k), pts=l.pts.slice();
  pts[q.stage]=Math.max(0,(pts[q.stage]||0)+d);
  const words=Object.assign({},l.words);
  if(q.w!=null) words[q.w]=Math.max(0,Math.min(3,(words[q.w]||0)+d));
  const sc=(l.sc||0)+(d>0?1:0);
  k.l2=Object.assign({},l,{pts,words,sc,stage:Math.max(l.stage||1,stageFromPts(pts))}); pendingKid=k;
}
function showWordReveal(q){ const rv=$("#reveal"); if(rv && q.w!=null) rv.innerHTML=picHTML(WORDS[q.w].pic,44)+'  '+WORDS[q.w].w; }
function answer2(i){
  const q=round.qs[round.cur]; if(q.done) return;
  const btn=$("#p"+i);
  if(q.opts[i].ok){
    q.done=true; q.ok=(q.tries===0 && !q.helped);
    btn.classList.add("right"); sfx.ok(); bumpL2(q,q.ok?1:0);
    if(q.w!=null){ showWordReveal(q); setTimeout(()=>say(rnd(PRAISE)+" "+WORDS[q.w].w),250); }
    else setTimeout(()=>say(rnd(PRAISE)),250);
    setTimeout(nextQ,1900);
  } else {
    if(btn.classList.contains("wrong")) return;
    q.tries++; btn.classList.add("wrong"); sfx.no();
    if(q.tries===1) bumpL2(q,-1);
    setTimeout(()=>{ if(round.type==="wpic") say("حَاوِلِي مَرَّةً أُخْرَى"); else promptCurrent2(); },350);
  }
}
function tile(i){
  const q=round.qs[round.cur], t=q.tiles[i], o=WORDS[q.w]; if(q.done||t.used) return;
  if(t.c===o.chars[q.built]){
    t.used=true; q.built++; sfx.tap();
    if(q.built===o.chars.length){
      q.done=true; q.ok=q.tries<=1; bumpL2(q,q.ok?1:0); render(); sfx.ok();
      setTimeout(()=>say(rnd(PRAISE)+" "+o.w),200); setTimeout(nextQ,2000);
    } else render();
  } else {
    q.tries++; sfx.no(); if(q.tries===2) bumpL2(q,-1);
    const b=$("#t"+i); if(b){ b.classList.add("wrong"); setTimeout(()=>b.classList.remove("wrong"),400); }
    if(q.tries>=3) setTimeout(()=>say(o.w),300);
  }
}
/* Read aloud with speech recognition */
const normAr = s => stripH(s).replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[^ء-ي\s]/g,"").trim();
function lev(a,b){ const d=[...Array(b.length+1)].map((_,j)=>j); for(let i=1;i<=a.length;i++){ let prev=d[0]; d[0]=i; for(let j=1;j<=b.length;j++){ const tmp=d[j]; d[j]=Math.min(d[j]+1,d[j-1]+1,prev+(a[i-1]===b[j-1]?0:1)); prev=tmp; } } return d[b.length]; }
function heard(alts,word){
  const t=normAr(word);
  return alts.some(a=>{
    const n=normAr(a); if(n.replace(/\s/g,"")===t) return true;
    return n.split(/\s+/).some(tok=>{ const x=tok.replace(/^ال/,""); return tok===t||x===t||(t.length>=3&&(lev(tok,t)<=1||lev(x,t)<=1)); });
  });
}
let listening=false;
function mic(){
  const q=round.qs[round.cur]; if(q.done||listening||!SR) return;
  try{ window.speechSynthesis&&speechSynthesis.cancel(); }catch(e){}
  const btn=$("#micbtn"), st=$("#micstat");
  const rec=new SR(); rec.lang="ar-AE"; rec.interimResults=false; rec.maxAlternatives=5;
  let got=false; listening=true; if(btn) btn.classList.add("on"); if(st) st.textContent="أسمعكِ… اقرئي الآن";
  rec.onresult=e=>{ got=true; const alts=[...e.results[0]].map(a=>a.transcript); readResult(q,alts); };
  rec.onerror=e=>{ got=true; listening=false; if(btn) btn.classList.remove("on");
    if(e.error==="not-allowed"||e.error==="service-not-allowed"){ micBlocked=true; if(st) st.textContent="الميكروفون غير مسموح. اطلبي من بابا أو ماما السماح به."; q.done=true; setTimeout(nextQ,2500); }
    else if(st) st.textContent= e.error==="no-speech" ? "لم أسمع شيئًا. اضغطي واقرئي بصوت أعلى" : "حاولي مرة أخرى";
  };
  rec.onend=()=>{ listening=false; if(btn) btn.classList.remove("on"); if(!got && st) st.textContent="لم أسمع شيئًا. اضغطي واقرئي بصوت أعلى"; };
  try{ rec.start(); }catch(e){ listening=false; if(btn) btn.classList.remove("on"); }
}
function readResult(q,alts){
  listening=false; const st=$("#micstat"), btn=$("#micbtn"); if(btn) btn.classList.remove("on");
  const o=WORDS[q.w];
  if(heard(alts,o.w)){
    q.done=true; q.ok=q.tries<=1 && !q.helped; bumpL2(q,q.ok?1:0); sfx.ok();
    if(st) st.textContent="✓"; showWordReveal(q); setTimeout(()=>say(rnd(PRAISE)+" "+o.w),200); setTimeout(nextQ,2200);
  } else {
    q.tries++; sfx.no();
    if(q.tries===1){ bumpL2(q,-1); if(st) st.textContent="قريبًا! حاولي مرة أخرى"; }
    else if(q.tries===2){ q.helped=true; if(st) st.textContent="اسمعي واقرئي معي"; say(o.w,0.7); }
    else { q.done=true; q.ok=false; showWordReveal(q); if(st) st.textContent=""; say(o.w,0.7); setTimeout(nextQ,2400); }
  }
}
/* Reading path on the home screen */
function pathSVG(k){
  const pos=[[380,286],[262,224],[150,150],[262,72]], l=l2(k);
  let s='<svg class="house" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid meet">';
  s+='<rect x="0" y="0" width="480" height="340" rx="16" fill="#DDF0D2"/>';
  s+='<path d="M470 330 C420 300 400 300 380 286 S300 250 262 224 S170 190 150 150 S180 90 262 72 S360 40 420 40" stroke="#E9D1A2" stroke-width="30" fill="none" stroke-linecap="round"/>';
  // little house (start) and library (finish)
  s+='<g transform="translate(410 270)"><rect x="0" y="16" width="56" height="40" fill="#E9D1A2" stroke="#C7A56A" stroke-width="2"/><rect x="-4" y="10" width="64" height="8" fill="#fff"/><path d="M22 56 V40 a6 6 0 0 1 12 0 V56 Z" fill="#4A3226"/></g>';
  s+='<g transform="translate(372 6)"><rect x="0" y="22" width="96" height="48" rx="4" fill="#fff" stroke="#1F5FA8" stroke-width="3"/><path d="M-6 24 L48 0 L102 24 Z" fill="#1F5FA8"/><text x="48" y="56" text-anchor="middle" font-size="26">📚</text></g>';
  STAGES.forEach((st,i)=>{
    const [x,y]=pos[i], state=stageState(k,i), open=state==="open", frac=st.need?Math.min(1,(l.pts[i]||0)/st.need):1;
    const C=2*Math.PI*40;
    s+='<g class="room" data-act="'+(open?'play':'stlock')+'" data-type="'+st.type+'" data-s="'+i+'" role="button" aria-label="'+st.name+'">';
    s+='<circle cx="'+x+'" cy="'+y+'" r="40" fill="'+(open?'#fff':'#C9C3B6')+'" stroke="'+(open?'#F1EADB':'#B1AA9C')+'" stroke-width="8"/>';
    if(open && st.need) s+='<circle cx="'+x+'" cy="'+y+'" r="40" fill="none" stroke="#F2B82F" stroke-width="8" stroke-dasharray="'+(frac*C)+' '+C+'" transform="rotate(-90 '+x+' '+y+')" stroke-linecap="round"/>';
    s+= open ? '<text x="'+x+'" y="'+(y+8)+'" text-anchor="middle" font-size="'+(st.sample.length>4?18:24)+'" font-family="Noto Naskh Arabic, serif" font-weight="700" fill="#2A2140">'+st.sample+'</text>'
             : '<text x="'+x+'" y="'+(y+9)+'" text-anchor="middle" font-size="26">🔒</text>';
    s+='<text x="'+x+'" y="'+(y+62)+'" text-anchor="middle" font-size="17" font-weight="800" fill="#2A2140" font-family="Baloo Bhaijaan 2, sans-serif">'+st.name+'</text></g>';
  });
  return s+'</svg>';
}

/* ======================= Level 3: sentences and stories ======================= */
// Each sentence: vowelled text and a picture made of emoji and/or the girls' faces (face:id).
const SENT=[
 ["القِطُّ نَائِمٌ.","🐈 💤"],["القِطُّ يَأْكُلُ.","🐈 🍽️"],["الكَلْبُ يَجْرِي.","🐕 💨"],["الكَلْبُ نَائِمٌ.","🐕 💤"],
 ["البَطَّةُ فِي المَاءِ.","🦆 💧"],["السَّمَكَةُ فِي البَحْرِ.","🐟 🌊"],["الشَّمْسُ كَبِيرَةٌ.","☀️"],["القَمَرُ فِي السَّمَاءِ.","🌙 ✨"],
 ["صُوفِي تَلْعَبُ الشِّطْرَنْجَ.","face:sophie ♟️"],["أُولِيفْيَا تَعْزِفُ البِيَانُو.","face:olivia 🎹"],["جُولْيَا تَقْرَعُ الطَّبْلَ.","face:julia 🥁"],
 ["البِنْتُ تَأْكُلُ مَوْزَةً.","👧 🍌"],["الوَلَدُ يَأْكُلُ مَوْزَةً.","👦 🍌"],["البِنْتُ تَشْرَبُ الحَلِيبَ.","👧 🥛"],["الوَلَدُ يَشْرَبُ الحَلِيبَ.","👦 🥛"],
 ["الفِيلُ كَبِيرٌ.","🐘"],["الفَأْرُ صَغِيرٌ.","🐭"],["البَيْتُ جَمِيلٌ.","🏠 ✨"],["الوَرْدَةُ حَمْرَاءُ.","🌹"],["التُّفَّاحَةُ حَمْرَاءُ.","🍎"],
 ["المَوْزَةُ صَفْرَاءُ.","🍌"],["الطَّائِرَةُ فِي السَّمَاءِ.","✈️ ☁️"],["السَّيَّارَةُ سَرِيعَةٌ.","🚗 💨"],["أُمِّي تَطْبُخُ.","👩 🍳"],
 ["أَبِي يَقْرَأُ كِتَابًا.","👨 📖"],["المَطَرُ يَنْزِلُ.","🌧️"],["الأَرْنَبُ يَأْكُلُ جَزَرَةً.","🐇 🥕"],["البَقَرَةُ تُعْطِينَا الحَلِيبَ.","🐄 🥛"],
 ["الطَّائِرُ عَلَى الشَّجَرَةِ.","🐦 🌳"],["نَحْنُ فِي المَدْرَسَةِ.","🏫 🎒"],["جُولْيَا طَوِيلَةٌ.","face:julia 📏"],
 ["صُوفِي وَأُولِيفْيَا أُخْتَانِ.","face:sophie face:olivia"],["أُولِيفْيَا تُحِبُّ الرَّقْصَ.","face:olivia 💃"]
].map(([s,pic],i)=>({i,s,pic,words:s.replace(/[.!؟]/g,"").split(" ")}));
const STORIES=[
 {title:"يَوْمُ المَدْرَسَةِ",lines:[["اِسْتَيْقَظَتْ صُوفِي صَبَاحًا.","face:sophie ☀️"],["حَمَلَتْ أُولِيفْيَا حَقِيبَتَهَا.","face:olivia 🎒"],["رَكِبَتْ جُولْيَا البَاصَ إِلَى المَدْرَسَةِ.","face:julia 🚌 🏫"]],
  qs:[["مَنْ رَكِبَتِ البَاصَ؟",[["face:julia","جُولْيَا",1],["face:sophie","صُوفِي",0],["face:olivia","أُولِيفْيَا",0]]],
      ["إِلَى أَيْنَ ذَهَبَتْ جُولْيَا؟",[["🏫","المَدْرَسَةِ",1],["🌊","البَحْرِ",0],["🏠","البَيْتِ",0]]]]},
 {title:"فِي الحَدِيقَةِ",lines:[["ذَهَبَتِ البَنَاتُ إِلَى الحَدِيقَةِ.","face:sophie face:olivia face:julia 🌳"],["رَأَتِ البَنَاتُ فَرَاشَةً جَمِيلَةً.","🦋"],["لَعِبَتْ أُولِيفْيَا بِالكُرَةِ.","face:olivia ⚽"]],
  qs:[["مَاذَا رَأَتِ البَنَاتُ؟",[["🦋","فَرَاشَةً",1],["🐘","فِيلًا",0],["🐟","سَمَكَةً",0]]],
      ["مَنْ لَعِبَتْ بِالكُرَةِ؟",[["face:olivia","أُولِيفْيَا",1],["face:julia","جُولْيَا",0],["face:sophie","صُوفِي",0]]]]},
 {title:"الحَفْلَةُ",lines:[["صَنَعَتْ مَامَا كَعْكَةً كَبِيرَةً.","👩 🎂"],["وَضَعَتْ صُوفِي الشُّمُوعَ.","face:sophie 🕯️"],["غَنَّتْ جُولْيَا وَصَفَّقَ الجَمِيعُ.","face:julia 🎤 👏"]],
  qs:[["مَاذَا صَنَعَتْ مَامَا؟",[["🎂","كَعْكَةً",1],["🍞","خُبْزًا",0],["🍌","مَوْزًا",0]]],
      ["مَنْ غَنَّتْ؟",[["face:julia","جُولْيَا",1],["face:sophie","صُوفِي",0],["face:olivia","أُولِيفْيَا",0]]]]},
 {title:"عَلَى البَحْرِ",lines:[["ذَهَبَتِ العَائِلَةُ إِلَى البَحْرِ.","👨‍👩‍👧‍👧 🌊"],["بَنَتْ صُوفِي قَلْعَةً مِنَ الرَّمْلِ.","face:sophie 🏰"],["سَبَحَتْ أُولِيفْيَا مَعَ بَابَا.","face:olivia 🏊‍♀️ 👨"]],
  qs:[["مَاذَا بَنَتْ صُوفِي؟",[["🏰","قَلْعَةً",1],["🏠","بَيْتًا",0],["🚗","سَيَّارَةً",0]]],
      ["مَعَ مَنْ سَبَحَتْ أُولِيفْيَا؟",[["👨","بَابَا",1],["👩","مَامَا",0],["face:julia","جُولْيَا",0]]]]},
 {title:"القِطَّةُ الصَّغِيرَةُ",lines:[["وَجَدَتْ جُولْيَا قِطَّةً صَغِيرَةً.","face:julia 🐈"],["كَانَتِ القِطَّةُ جَائِعَةً.","🐈 🍽️"],["أَعْطَتْ أُولِيفْيَا القِطَّةَ حَلِيبًا.","face:olivia 🥛"]],
  qs:[["مَنْ وَجَدَتِ القِطَّةَ؟",[["face:julia","جُولْيَا",1],["face:olivia","أُولِيفْيَا",0],["face:sophie","صُوفِي",0]]],
      ["مَاذَا شَرِبَتِ القِطَّةُ؟",[["🥛","حَلِيبًا",1],["💧","مَاءً",0],["🍵","شَايًا",0]]]]},
 {title:"الشِّطْرَنْجُ",lines:[["لَعِبَتْ صُوفِي الشِّطْرَنْجَ مَعَ بَابَا.","face:sophie ♟️ 👨"],["فَكَّرَتْ صُوفِي كَثِيرًا.","face:sophie 🤔"],["فَازَتْ صُوفِي وَفَرِحَتْ!","face:sophie 🏆"]],
  qs:[["مَعَ مَنْ لَعِبَتْ صُوفِي؟",[["👨","بَابَا",1],["👩","مَامَا",0],["face:julia","جُولْيَا",0]]],
      ["مَنْ فَازَتْ؟",[["face:sophie","صُوفِي",1],["face:olivia","أُولِيفْيَا",0],["face:julia","جُولْيَا",0]]]]}
];
function picRow(pic,size){ return '<span class="picrow">'+pic.split(" ").map(t=>picHTML(t,size)).join("")+'</span>'; }
const STAGES3=[
 {type:"s3pic",  name:"جملة وصورة", sample:"🐈 💤", need:15},
 {type:"s3fill", name:"أكملي",      sample:"___",   need:15},
 {type:"s3order",name:"رتّبي",      sample:"١٢٣",   need:15},
 {type:"s3read", name:"اقرئي بصوتك",sample:"🎤",    need:0},
 {type:"s3story",name:"قصص",        sample:"📚",    need:0}
];
const L3TYPES=["s3pic","s3fill","s3order","s3read","s3story","auto3"];
const STAGE3_OF={s3pic:0,s3fill:1,s3order:2,s3read:3,s3story:4};
const L3SETS=[
 {name:"الموسيقى", items:["🎹","🥁","🎸","🎺","🎻","🎷","🎤","🎵","🎶","🪕"]},
 {name:"الرياضة",  items:["⚽","🏀","🎾","🏐","🤸‍♀️","⛸️","🏊‍♀️","🚴‍♀️","♟️","🏅"]},
 {name:"الحفلة",   items:["🎈","🎉","🎁","🪅","🎀","🧸","🪄","🎊","🍿","👑"]},
 {name:"الطبيعة",  items:["🌸","🌻","🌈","🍄","🌵","🌴","🍁","🌷","🌼","🌳"]}
];
const L3STK=[].concat(...L3SETS.map((s,si)=>s.items.map(e=>({e,set:si}))));
function l3(k){ return Object.assign({pts:[0,0,0,0,0],open:false,sc:0,ss:0,stage:1},k.l3||{}); }
function l3Open(k){ return l2Earned(l2(k))>=L2STK.length || l3(k).open; }
function stage3FromPts(p){ let s=1; if(p[0]>=15) s=2; if(s>=2&&p[1]>=15) s=3; if(s>=3&&p[2]>=15) s=4; return s; }
function stage3Count(k){ const l=l3(k); return Math.max(l.stage||1, stage3FromPts(l.pts)); }
function stage3State(k,i){
  const c=stage3Count(k);
  const open = i<=2 ? i<c : c>=4;
  if(!open) return "locked";
  if(i===3 && (!SR||micBlocked)) return "الميكروفون غير متاح على هذا الجهاز";
  return "open";
}
function l3Earned(l){ return Math.min(L3STK.length, Math.floor((l.sc||0)/PER_STICKER)); }
function nextSticker3HTML(k){
  const l=l3(k), got=l3Earned(l);
  if(got>=L3STK.length) return '<div class="nextstk"><span class="ns-pic">🏆</span><b>جمعتِ كل ملصقات الجمل!</b></div>';
  const have=(l.sc||0)%PER_STICKER;
  return '<div class="nextstk"><span class="ns-pic mystery">'+L3STK[got].e+'</span><div style="flex:1"><b>الملصق القادم</b><div class="ns-dots">'
    +[...Array(PER_STICKER)].map((_,i)=>'<i class="'+(i<have?'on':'')+'">★</i>').join("")+'</div></div><small>'+(PER_STICKER-have)+' ⭐</small></div>';
}
const PARTICLES=["فِي","عَلَى","إِلَى","مِنَ","مَعَ"];
const ALLWORDS=[...new Set(SENT.flatMap(o=>o.words))];
function shareWord(a,b){ const n=w=>normAr(w).replace(/^ال/,""); const A=new Set(a.words.map(n)); return b.words.some(w=>A.has(n(w))); }
function pickSents(n){ return shuffle(SENT.map(o=>o.i)).slice(0,n); }
function makeRound3(type){
  const k=kid(me);
  if(type==="auto3"){ const open=STAGES3.map((s,i)=>i).filter(i=>stage3State(k,i)==="open"); type=STAGES3[(Math.random()<0.5||open.length===1)?open[open.length-1]:rnd(open)].type; }
  const stage=STAGE3_OF[type], base={type,cur:0,practice:false,level:3,stage3Before:stage3Count(k)};
  if(type==="s3story"){
    const st=rnd(STORIES.map((s,i)=>i)), S3=STORIES[st];
    const qs=S3.qs.map(([q,opts])=>({stage,prompt:q,opts:shuffle(opts.map(([pic,label,ok])=>({html:picHTML(pic,56)+'<span>'+label+'</span>',ok:!!ok,story:true}))),tries:0,done:false,ok:false}));
    return Object.assign(base,{qs,story:st,page:0});
  }
  const n = type==="s3order"?3 : type==="s3read"?3 : 4;
  const qs=pickSents(n).map(si=>{
    const o=SENT[si], q={stage,s:si,tries:0,done:false,ok:false,helped:false};
    if(type==="s3pic"){
      const others=shuffle(SENT.filter(x=>x.i!==si && x.pic!==o.pic)); const close=others.filter(x=>shareWord(o,x)), far=others.filter(x=>!shareWord(o,x));
      q.opts=shuffle([o].concat(close.concat(far).slice(0,2))).map(x=>({html:picRow(x.pic,52),ok:x.i===si}));
    }
    if(type==="s3fill"){
      const cand=o.words.map((w,j)=>j).filter(j=>!PARTICLES.includes(o.words[j]) && stripH(o.words[j]).length>=3);
      q.blank=rnd(cand.length?cand:[o.words.length-1]);
      const ans=o.words[q.blank], hasAl=stripH(ans).startsWith("ال");
      const pool=shuffle(ALLWORDS.filter(w=>stripH(w)!==stripH(ans) && !PARTICLES.includes(w) && stripH(w).startsWith("ال")===hasAl));
      q.opts=shuffle([ans].concat(pool.slice(0,2))).map(w=>({html:w,ok:w===ans,word:true}));
    }
    if(type==="s3order"){ let t; do{ t=shuffle(o.words.map((w,j)=>({w,j,used:false}))); }while(o.words.length>1 && t.every((x,j)=>x.j===j)); q.tiles=t; q.built=0; }
    return q;
  });
  return Object.assign(base,{qs});
}
function promptCurrent3(){
  const r=round, q=r.qs[r.cur];
  if(r.type==="s3order") say(SENT[q.s].s,0.75);
  else if(r.type==="s3story" && r.page<STORIES[r.story].lines.length) return;
  else if(r.type==="s3story") say(q.prompt);
}
function gameHTML3(){
  const r=round, gm=GAMES[r.type], q=r.qs[r.cur];
  const dots='<div class="dots">'+r.qs.map((x,n)=>'<i class="'+(x.done?(x.ok?'ok':'miss'):(n===r.cur?'cur':''))+'"></i>').join("")+'</div>';
  const top='<div class="screen"><div class="gtop"><button class="iconbtn" data-act="quit" aria-label="back home">✕</button>'+dots+face(me,52)+'</div><div class="stage">';
  let body='';
  if(r.type==="s3story"){
    const S3=STORIES[r.story];
    if(r.page<S3.lines.length){
      const [line,pic]=S3.lines[r.page];
      body='<div class="prompt">📚 '+S3.title+'</div>'+picRow(pic,80)+'<div class="bigsent">'+line+'</div>'
        +'<div class="row"><button class="speak" data-act="s3say" aria-label="listen">🔊</button><button class="btn gold" data-act="s3page">'+(r.page<S3.lines.length-1?'التالي ◀':'الأسئلة ◀')+'</button></div>'
        +'<div class="storydots">'+S3.lines.map((_,i)=>'<i class="'+(i<=r.page?'on':'')+'"></i>').join("")+'</div>';
      return top+body+'</div></div>';
    }
    body='<div class="prompt"><button class="speak" data-act="replay" aria-label="listen again">🔊</button>'+q.prompt+'</div><div class="opts">'+q.opts.map((o,i)=>'<button class="opt optpic" data-act="answer3" data-o="'+i+'" id="p'+i+'">'+o.html+'</button>').join("")+'</div><div class="reveal" id="reveal"></div>';
    return top+body+'</div></div>';
  }
  const o=SENT[q.s];
  if(r.type==="s3pic"){
    body='<div class="prompt">'+gm.title+'<button class="speak small" data-act="help3" aria-label="help">🔊</button></div><div class="bigsent">'+o.s+'</div><div class="opts">'+q.opts.map((x,i)=>'<button class="opt optpic" data-act="answer3" data-o="'+i+'" id="p'+i+'">'+x.html+'</button>').join("")+'</div><div class="reveal" id="reveal"></div>';
  } else if(r.type==="s3fill"){
    const shown=o.words.map((w,j)=>j===q.blank?(q.done?'<span class="filled">'+w+'</span>':'<span class="blank">؟</span>'):w).join(" ");
    body='<div class="prompt">'+gm.title+'<button class="speak small" data-act="help3" aria-label="help">🔊</button></div>'+picRow(o.pic,64)+'<div class="bigsent">'+shown+'</div><div class="opts">'+q.opts.map((x,i)=>'<button class="opt optw" data-act="answer3" data-o="'+i+'" id="p'+i+'">'+x.html+'</button>').join("")+'</div>';
  } else if(r.type==="s3order"){
    const built=q.tiles.filter(t=>t.used).sort((a,b)=>a.j-b.j).map(t=>t.w).join(" ");
    body='<div class="prompt"><button class="speak" data-act="replay" aria-label="listen again">🔊</button>'+gm.title+'</div>'+picRow(o.pic,64)
      +'<div class="bigsent build">'+(built||'&nbsp;')+'<span class="slotsleft">'+'•'.repeat(o.words.length-q.built)+'</span></div>'
      +'<div class="tiles">'+q.tiles.map((t,i)=>'<button class="tile wtile'+(t.used?' used':'')+'" data-act="tile3" data-o="'+i+'" id="t'+i+'"'+(t.used?' disabled':'')+'>'+t.w+'</button>').join("")+'</div>';
  } else if(r.type==="s3read"){
    body='<div class="prompt">'+gm.title+'</div><div class="bigsent">'+o.s+'</div><button class="mic" data-act="mic3" id="micbtn" aria-label="microphone">🎤</button><div class="micstat" id="micstat">اضغطي على الميكروفون واقرئي الجملة</div><div class="reveal" id="reveal"></div>';
  }
  return top+body+'</div></div>';
}
function bumpL3(q,d){
  if(!d) return;
  const k=pendingKid||kid(me), l=l3(k), pts=l.pts.slice();
  pts[q.stage]=Math.max(0,(pts[q.stage]||0)+d);
  k.l3=Object.assign({},l,{pts,sc:(l.sc||0)+(d>0?1:0),stage:Math.max(l.stage||1,stage3FromPts(pts))}); pendingKid=k;
}
function answer3(i){
  const q=round.qs[round.cur]; if(q.done) return;
  const btn=$("#p"+i);
  if(q.opts[i].ok){
    q.done=true; q.ok=(q.tries===0 && !q.helped); btn.classList.add("right"); sfx.ok(); bumpL3(q,q.ok?1:0);
    if(round.type==="s3fill"){ render(); setTimeout(()=>say(SENT[q.s].s,0.75),250); setTimeout(nextQ,2600); return; }
    if(round.type==="s3pic"){ const rv=$("#reveal"); if(rv) rv.textContent="✓"; setTimeout(()=>say(rnd(PRAISE)+" "+SENT[q.s].s,0.8),250); setTimeout(nextQ,2600); return; }
    setTimeout(()=>say(rnd(PRAISE)),250); setTimeout(nextQ,1900);
  } else {
    if(btn.classList.contains("wrong")) return;
    q.tries++; btn.classList.add("wrong"); sfx.no(); if(q.tries===1) bumpL3(q,-1);
    setTimeout(()=>say("حَاوِلِي مَرَّةً أُخْرَى"),350);
  }
}
function tile3(i){
  const q=round.qs[round.cur], t=q.tiles[i]; if(q.done||t.used) return;
  if(t.j===q.built){
    t.used=true; q.built++; sfx.tap();
    if(q.built===q.tiles.length){ q.done=true; q.ok=q.tries<=1; bumpL3(q,q.ok?1:0); render(); sfx.ok(); setTimeout(()=>say(rnd(PRAISE)+" "+SENT[q.s].s,0.8),200); setTimeout(nextQ,2800); }
    else render();
  } else {
    q.tries++; sfx.no(); if(q.tries===2) bumpL3(q,-1);
    const b=$("#t"+i); if(b){ b.classList.add("wrong"); setTimeout(()=>b.classList.remove("wrong"),400); }
  }
}
function heardSentence(alts,sentence){
  const target=SENT.find(o=>o.s===sentence).words.map(w=>normAr(w).replace(/^ال/,""));
  return alts.some(a=>{
    const toks=normAr(a).split(/\s+/).map(t=>t.replace(/^و?ال/,""));
    const hit=target.filter(t=>toks.some(x=>x===t||(t.length>=3&&lev(x,t)<=1))).length;
    return hit>=Math.ceil(target.length*0.75);
  });
}
function mic3(){
  const q=round.qs[round.cur]; if(q.done||listening||!SR) return;
  try{ window.speechSynthesis&&speechSynthesis.cancel(); }catch(e){}
  const btn=$("#micbtn"), st=$("#micstat");
  const rec=new SR(); rec.lang="ar-AE"; rec.interimResults=false; rec.maxAlternatives=5;
  let got=false; listening=true; if(btn) btn.classList.add("on"); if(st) st.textContent="أسمعكِ… اقرئي الجملة";
  rec.onresult=e=>{ got=true; listening=false; if(btn) btn.classList.remove("on"); readResult3(q,[...e.results[0]].map(a=>a.transcript)); };
  rec.onerror=e=>{ got=true; listening=false; if(btn) btn.classList.remove("on");
    if(e.error==="not-allowed"||e.error==="service-not-allowed"){ micBlocked=true; if(st) st.textContent="الميكروفون غير مسموح. اطلبي من بابا أو ماما السماح به."; q.done=true; setTimeout(nextQ,2500); }
    else if(st) st.textContent= e.error==="no-speech" ? "لم أسمع شيئًا. اضغطي واقرئي بصوت أعلى" : "حاولي مرة أخرى"; };
  rec.onend=()=>{ listening=false; if(btn) btn.classList.remove("on"); if(!got && st) st.textContent="لم أسمع شيئًا. اضغطي واقرئي بصوت أعلى"; };
  try{ rec.start(); }catch(e){ listening=false; if(btn) btn.classList.remove("on"); }
}
function readResult3(q,alts){
  const st=$("#micstat"), o=SENT[q.s];
  if(heardSentence(alts,o.s)){
    q.done=true; q.ok=q.tries<=1 && !q.helped; bumpL3(q,q.ok?1:0); sfx.ok();
    if(st) st.textContent="✓"; const rv=$("#reveal"); if(rv) rv.innerHTML=picRow(o.pic,48); setTimeout(()=>say(rnd(PRAISE)),200); setTimeout(nextQ,2200);
  } else {
    q.tries++; sfx.no();
    if(q.tries===1){ bumpL3(q,-1); if(st) st.textContent="قريبًا! حاولي مرة أخرى"; }
    else if(q.tries===2){ q.helped=true; if(st) st.textContent="اسمعي واقرئي معي"; say(o.s,0.7); }
    else { q.done=true; q.ok=false; const rv=$("#reveal"); if(rv) rv.innerHTML=picRow(o.pic,48); if(st) st.textContent=""; say(o.s,0.7); setTimeout(nextQ,3000); }
  }
}
function path3SVG(k){
  const pos=[[390,290],[270,240],[150,185],[150,80],[300,60]], l=l3(k);
  let s='<svg class="house" viewBox="0 0 480 340" preserveAspectRatio="xMidYMid meet">';
  s+='<rect x="0" y="0" width="480" height="340" rx="16" fill="#E4DDF6"/>';
  s+='<path d="M470 330 C430 305 410 300 390 290 S300 255 270 240 S180 215 150 185 S120 110 150 80 S250 50 300 60 S400 40 440 40" stroke="#F3E3B8" stroke-width="30" fill="none" stroke-linecap="round"/>';
  s+='<g transform="translate(400 4)"><rect x="6" y="28" width="60" height="46" fill="#fff" stroke="#7B5BD6" stroke-width="3"/><path d="M0 30 L36 2 L72 30 Z" fill="#7B5BD6"/><text x="36" y="62" text-anchor="middle" font-size="24">🏰</text></g>';
  STAGES3.forEach((st,i)=>{
    const [x,y]=pos[i], state=stage3State(k,i), open=state==="open", frac=st.need?Math.min(1,(l.pts[i]||0)/st.need):1, C=2*Math.PI*36;
    s+='<g class="room" data-act="'+(open?'play':'stlock3')+'" data-type="'+st.type+'" data-s="'+i+'" role="button" aria-label="'+st.name+'">';
    s+='<circle cx="'+x+'" cy="'+y+'" r="36" fill="'+(open?'#fff':'#C9C3B6')+'" stroke="'+(open?'#EDE7F9':'#B1AA9C')+'" stroke-width="8"/>';
    if(open && st.need) s+='<circle cx="'+x+'" cy="'+y+'" r="36" fill="none" stroke="#7B5BD6" stroke-width="8" stroke-dasharray="'+(frac*C)+' '+C+'" transform="rotate(-90 '+x+' '+y+')" stroke-linecap="round"/>';
    s+= open ? '<text x="'+x+'" y="'+(y+8)+'" text-anchor="middle" font-size="22" font-family="Noto Naskh Arabic, serif" font-weight="700" fill="#2A2140">'+st.sample+'</text>'
             : '<text x="'+x+'" y="'+(y+9)+'" text-anchor="middle" font-size="24">🔒</text>';
    s+='<text x="'+x+'" y="'+(y+58)+'" text-anchor="middle" font-size="16" font-weight="800" fill="#2A2140" font-family="Baloo Bhaijaan 2, sans-serif">'+st.name+'</text></g>';
  });
  return s+'</svg>';
}

/* ======================= Family voice: recorded clips ======================= */
// Clips live in the family's "settings" collection as documents with kind:"clip", so they sync to every tablet.
let CLIPS={}; const BUF={}; let clipNodes=[], clipSeq=0;
const clipNorm = t => String(t).replace(/[،,!?؟.]/g,"").replace(/\s+/g," ").trim();
function clipId(t){ const s=clipNorm(t); let h=5381; for(let i=0;i<s.length;i++) h=((h*33)^s.charCodeAt(i))>>>0; return "clip_"+h.toString(36)+"_"+s.length; }
function getAC(){ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==="suspended") AC.resume().catch(()=>{}); return AC; }
function b64ToBuf(b64){ const bin=atob(b64), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u.buffer; }
function clipBuffer(id){
  const c=CLIPS[id]; if(!c) return Promise.reject();
  const key=id+"@"+(c.at||"");
  if(!BUF[key]) BUF[key]=getAC().decodeAudioData(b64ToBuf(c.a));
  return BUF[key];
}
function stopClip(){ clipSeq++; clipNodes.forEach(n=>{ try{ n.stop(); }catch(e){} }); clipNodes=[]; }
// Find recordings that cover the whole text (whole phrase, or word by word). Returns null if anything is missing.
function clipsFor(text){
  const whole=clipId(text); if(CLIPS[whole]) return [whole];
  const toks=clipNorm(text).split(" "), out=[]; let i=0;
  while(i<toks.length){
    let hit=null;
    for(let j=toks.length;j>i;j--){ const id=clipId(toks.slice(i,j).join(" ")); if(CLIPS[id]){ hit=[id,j]; break; } }
    if(!hit) return null; out.push(hit[0]); i=hit[1];
  }
  return out.length?out:null;
}
function playClips(ids){
  stopClip(); const my=clipSeq;
  Promise.all(ids.map(clipBuffer)).then(bufs=>{
    if(my!==clipSeq) return;
    const ac=getAC(); let t=ac.currentTime+0.05;
    bufs.forEach((b,n)=>{ const c=CLIPS[ids[n]], s=Math.max(0,c.s||0), e=Math.min(b.duration,c.e||b.duration);
      const src=ac.createBufferSource(); src.buffer=b; src.connect(ac.destination); src.start(t,s,Math.max(0.05,e-s)); clipNodes.push(src); t+=Math.max(0.05,e-s)+0.12; });
  }).catch(()=>{});
}
function playRecorded(text){ const ids=clipsFor(text); if(!ids) return false; playClips(ids); return true; }

/* Recording studio (parents) */
const PHRASES=[
 ...PRAISE, "حَاوِلِي مَرَّةً أُخْرَى","لِنُحَاوِلْ مِنْ جَدِيد","اُرْسُمِي فَوْقَ الْخَطّ","لَا تَنْسَيِ النِّقَاط","لَا تَنْسَيِ الْهَمْزَة",
 "قَرِيبًا! حَاوِلِي مَرَّةً أُخْرَى","اِمْتَلَأَتِ الْجَرَّة! أَحْسَنْتُنَّ","فَتَحْتِ غُرْفَةً جَدِيدَة!","فَتَحْتِ مَحَطَّةً جَدِيدَة!",
 "مُلْصَقٌ جَدِيد!","مُلْصَقُ الْفَرِيق!","هَذِهِ الْغُرْفَةُ مُقْفَلَة","اِسْتَمْتِعْنَ!","هَيَّا نَقْرَأ!","اِفْتَحِي ثَلَاثَ غُرَفٍ لِتَبْدَئِي الْقِرَاءَة"
];
function studioGroups(){
  const seen=new Set(), groups=[];
  const add=(key,title,tip,texts)=>{ const items=[]; texts.forEach(t=>{ const id=clipId(t); if(!seen.has(id)){ seen.add(id); items.push({t,id}); } }); groups.push({key,title,tip,items}); };
  const sylls=vs=>{ const a=[]; L.forEach(l=>vs.forEach(v=>a.push(syl(l.i,v)))); return a; };
  add("syl","Vowel sounds","Say only the sound, short and clear: بَ is “ba”, not the letter name.",sylls(["a","i","u"]));
  add("long","Long vowels","Stretch the vowel a little: با is “baa”, بو is “buu”, بي is “bii”.",sylls(["aa","ii","uu"]));
  add("names","Letter names","The name of the letter, as taught at school: ألِف، باء، تاء…",L.map(l=>l.name));
  add("l1words","Letter-house words","The picture word for each letter.",L.map(l=>l.word));
  add("rwords","Reading words","Read each word clearly, the way you would want them to read it.",WORDS.map(o=>o.w));
  add("sentences","Sentences","Read each sentence naturally, not word by word.",SENT.map(o=>o.s));
  add("stories","Stories","Story lines, questions and answers. Read like a bedtime story.",[].concat(...STORIES.map(s=>[s.title].concat(s.lines.map(l=>l[0])).concat(...s.qs.map(q=>[q[0]].concat(q[1].map(o=>o[1])))))));
  add("phrases","Phrases","Instructions and praise. Use a happy, warm voice.",
    Object.keys(GAMES).map(k=>GAMES[k].say).concat(PHRASES).concat(GIRLS.map(g=>"أَهْلًا يَا "+g.say)).concat(GROUPS.map(g=>g.name)));
  return groups;
}
let studio={g:0,i:0,state:"idle",rec:null,blob:null,b64:null,mime:"",s:0,e:0,msg:""};
function studioHTML(){
  const groups=studioGroups(), grp=groups[studio.g], it=grp.items[studio.i], c=CLIPS[it.id];
  const total=groups.reduce((a,g)=>a+g.items.length,0), done=groups.reduce((a,g)=>a+g.items.filter(x=>CLIPS[x.id]).length,0);
  const who=lsGet("bh_recby","Baba");
  let s='<div class="screen scroll" style="padding-bottom:24px"><div class="sheet parent studio" style="width:min(860px,100%);margin:12px auto;max-height:none">';
  s+='<h3>🎙 Recording studio<button class="btn small ghost x" data-act="studioback">Done</button></h3>';
  if(!fam) s+='<div class="note warn">This tablet is not linked to the family, so recordings cannot be saved. Link it in Parents first.</div>';
  s+='<div class="note">Recorded <b>'+done+' / '+total+'</b>. Anything not recorded yet keeps using the computer voice. Recording as '
    + '<span class="seg">'+["Baba","Mama"].map(n=>'<button data-act="recby" data-n="'+n+'" class="'+(n===who?'on':'')+'">'+n+'</button>').join("")+'</span></div>';
  s+='<div class="sgroups">'+groups.map((g,n)=>'<button class="'+(n===studio.g?'on':'')+'" data-act="sgroup" data-n="'+n+'">'+g.title+' <small>'+g.items.filter(x=>CLIPS[x.id]).length+'/'+g.items.length+'</small></button>').join("")+'</div>';
  s+='<p class="stip">'+esc(grp.tip)+'</p>';
  s+='<div class="scard"><div class="snav"><button class="btn small ghost" data-act="sprev">◀ Prev</button><span>'+(studio.i+1)+' / '+grp.items.length+'</span><button class="btn small ghost" data-act="snext">Next ▶</button></div>'
    + '<div class="stext" dir="rtl">'+esc(it.t)+'</div>'
    + '<div class="sstate">'+(c?'✓ Recorded by '+esc(c.by||"")+' ':'Not recorded yet')+(studio.msg?' · '+esc(studio.msg):'')+'</div>';
  if(studio.state==="recording") s+='<div class="row"><button class="recbtn on" data-act="srec">■</button></div><div class="sstate">Recording… tap to stop</div>';
  else if(studio.state==="review") s+='<div class="row"><button class="btn ghost" data-act="slisten">▶ Listen</button><button class="btn gold" data-act="ssave">✓ Save &amp; next</button><button class="btn ghost" data-act="sredo">↺ Redo</button></div>';
  else if(studio.state==="saving") s+='<div class="sstate">Saving…</div>';
  else s+='<div class="row"><button class="recbtn" data-act="srec"'+(fam?'':' disabled')+'>🎙</button></div><div class="row">'
    + (c?'<button class="btn small ghost" data-act="splay">▶ Play saved</button>':'')
    + '<button class="btn small ghost" data-act="stts">🔈 Computer voice</button>'
    + (c?'<button class="btn small ghost" data-act="sdel" style="color:var(--bad)">Remove recording</button>':'')+'</div>';
  s+='</div><div class="schips" dir="rtl">'+grp.items.map((x,n)=>'<button class="'+(CLIPS[x.id]?'done ':'')+(n===studio.i?'cur':'')+'" data-act="sjump" data-n="'+n+'">'+esc(x.t)+'</button>').join("")+'</div>';
  return s+'</div></div>';
}
function studioItem(){ const g=studioGroups()[studio.g]; return g.items[studio.i]; }
function studioMove(d){ const n=studioGroups()[studio.g].items.length; studio.i=(studio.i+d+n)%n; studio.state="idle"; studio.msg=""; render(); }
let recStream=null, recTimer=null;
async function studioRecord(){
  if(studio.state==="recording"){ stopRecording(); return; }
  stopClip(); try{ window.speechSynthesis&&speechSynthesis.cancel(); }catch(e){}
  try{
    recStream = recStream || await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  }catch(e){ studio.msg="Microphone not allowed. Allow it in Chrome's site settings and try again."; render(); return; }
  const mime=["audio/webm;codecs=opus","audio/webm","audio/mp4"].find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m))||"";
  const rec=new MediaRecorder(recStream, mime?{mimeType:mime,audioBitsPerSecond:48000}:undefined), chunks=[];
  rec.ondataavailable=e=>{ if(e.data.size) chunks.push(e.data); };
  rec.onstop=()=>{ clearTimeout(recTimer); finishRecording(new Blob(chunks,{type:rec.mimeType||mime||"audio/webm"})); };
  studio.rec=rec; studio.state="recording"; studio.msg=""; rec.start(); render();
  recTimer=setTimeout(stopRecording, studio.g<2?3500:6000);
}
function stopRecording(){ clearTimeout(recTimer); if(studio.rec && studio.rec.state==="recording") studio.rec.stop(); }
async function finishRecording(blob){
  try{
    const buf=await blob.arrayBuffer();
    const audio=await getAC().decodeAudioData(buf.slice(0));
    // trim silence at both ends
    const d=audio.getChannelData(0), sr=audio.sampleRate; let peak=0; for(let i=0;i<d.length;i++){ const v=Math.abs(d[i]); if(v>peak) peak=v; }
    if(peak<0.02){ studio.state="idle"; studio.msg="I could not hear anything. Try again a bit closer."; render(); return; }
    const th=Math.max(0.015,peak*0.08); let a=0,b=d.length-1; while(a<d.length&&Math.abs(d[a])<th) a++; while(b>0&&Math.abs(d[b])<th) b--;
    studio.s=Math.max(0,a/sr-0.08); studio.e=Math.min(audio.duration,b/sr+0.15);
    studio.blob=blob; studio.mime=blob.type; studio.decoded=audio;
    const r=new FileReader(); r.onload=()=>{ studio.b64=String(r.result).split(",")[1]; studio.state="review"; render(); studioListen(); }; r.readAsDataURL(blob);
  }catch(e){ console.warn(e); studio.state="idle"; studio.msg="Recording failed. Try again."; render(); }
}
function studioListen(){ if(!studio.decoded) return; stopClip(); const ac=getAC(), src=ac.createBufferSource(); src.buffer=studio.decoded; src.connect(ac.destination); src.start(ac.currentTime+0.02,studio.s,Math.max(0.05,studio.e-studio.s)); clipNodes.push(src); }
async function studioSave(){
  const it=studioItem(); if(!fam||!studio.b64) return;
  studio.state="saving"; render();
  const data={kind:"clip",t:it.t,a:studio.b64,m:studio.mime,s:+studio.s.toFixed(3),e:+studio.e.toFixed(3),by:lsGet("bh_recby","Baba"),at:new Date().toISOString()};
  try{ await fam.collection("settings").doc(it.id).set(data); CLIPS[it.id]=data; studio.b64=null; studio.decoded=null; studio.msg="Saved"; studio.state="idle"; studioMove(1); }
  catch(e){ console.warn(e); studio.state="review"; studio.msg="Could not save. Check the internet connection."; render(); }
}
async function studioDelete(){ const it=studioItem(); if(!fam) return; try{ await fam.collection("settings").doc(it.id).delete(); delete CLIPS[it.id]; studio.msg="Removed"; }catch(e){ studio.msg="Could not remove"; } render(); }
function ttsOnly(text){ stopClip(); try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=arVoice?arVoice.lang:"ar-SA"; if(arVoice) u.voice=arVoice; u.rate=0.8; speechSynthesis.speak(u); }catch(e){} }

/* ---------- Parent area ---------- */
function parentHTML(){
  const sh=share(), wk=weekDays();
  let s='<div class="screen scroll" style="padding-bottom:24px"><div class="sheet parent" style="width:min(820px,100%);margin:12px auto;max-height:none">';
  s+='<h3>Parents<button class="btn small ghost x" data-act="leaveparent">Done</button></h3>';
  const fkey=lsGet("bh_family",null);
  if(!window.FIREBASE_CONFIG || !window.FIREBASE_CONFIG.apiKey) s+='<div class="note warn">Sync is not set up yet (no Firebase config). Progress is saved on this tablet only.</div>';
  else if(!fkey) s+='<div class="note warn"><b>Link this tablet to the family</b> so the star jar is shared.<br>On the <b>first</b> tablet: <button class="btn small" data-act="famnew">Start family</button><br>On the other tablets, type the family code shown on the first one:<div style="display:flex;gap:8px;margin-top:6px"><input type="text" id="famcode" placeholder="XXXX-XXXX-XXXX" style="direction:ltr;font-family:monospace;text-transform:uppercase" autocomplete="off"><button class="btn small" data-act="famjoin">Join</button></div></div>';
  else s+= S.readOnly ? '<div class="note warn">The sync server refused to save. Check the Firestore rules.</div>'
       : '<div class="note ok">Synced with the family. Family code: <b style="font-family:monospace;font-size:18px">'+prettyKey(fkey)+'</b> (type it on the other tablets). <button class="btn small ghost" data-act="famleave">Unlink this tablet</button></div>';
  s+= arVoice ? '<div class="note ok">Arabic voice: '+esc(arVoice.name)+'</div>' : '<div class="note warn">No Arabic voice found on this tablet. On Android: Settings → Text-to-speech → Google → install Arabic voice data, then reload.</div>';
  s+='<div class="note">🎙 <b>Family voice:</b> '+Object.keys(CLIPS).length+' recordings. <button class="btn small" data-act="openstudio">Open recording studio</button></div>';
  s+='<h4>Today · '+today()+'</h4><table><tr><th>Girl</th><th>Activities</th><th>Stars today</th><th>Rooms</th><th>Stickers</th></tr>'
    + GIRLS.map(g=>{ const k=kid(g.id), d=S.jar[today()+"_"+g.id]||{}; return '<tr><td><b style="color:'+g.color+'">'+g.en+'</b></td><td>'+(d.n||0)+' / '+sh+'</td><td>'+(d.stars||0)+'</td><td>'+k.unlocked+' / 7</td><td>'+k.stickers.length+' / 28</td></tr>'; }).join("")+'</table>';
  const red=S.redeem["day_"+today()];
  s+='<h4>Today\'s reward</h4><div class="note">'+(dayFull()? (red?'Redeemed at '+new Date(red.at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}):'Jar is full, reward not yet redeemed. <button class="btn small gold" data-act="redeemnow" data-key="day_'+today()+'">Approve now</button>') : 'Jar not full yet.')+'</div>';
  const wf=weekFullCount(), wred=S.redeem["week_"+wk[0]];
  s+='<h4>This week</h4><div class="note">'+wf+' of 7 days full (bonus at 5). '+(wred?'Weekly bonus redeemed.':(wf>=5?'<button class="btn small gold" data-act="redeemnow" data-key="week_'+wk[0]+'">Approve weekly bonus</button>':''))+'</div>';
  s+='<h4>Letters</h4>';
  GIRLS.forEach(g=>{ const k=kid(g.id); s+='<div style="margin-top:10px"><b style="color:'+g.color+'">'+g.en+'</b><div class="lgrid">'+L.map(l=>{ const m=k.mastery[l.i]||0; const c=m>=5?'m5':m>=3?'m3':m>=1?'m1':''; return '<span class="'+c+'" title="'+m+'/5">'+l.ch+'</span>'; }).join("")+'</div></div>'; });
  s+='<div class="legend"><span><i style="background:#EEE7D8"></i>not started</span><span><i style="background:#FBE7B0"></i>learning</span><span><i style="background:#F2C94C"></i>getting there</span><span><i style="background:#7CC48C"></i>mastered</span></div>';
  s+='<h4>Reading (level 2)</h4><table><tr><th>Girl</th><th>Status</th><th>Sounds</th><th>Long vowels</th><th>Words</th><th>Words read</th></tr>'
    + GIRLS.map(g=>{ const k=kid(g.id), l=l2(k); return '<tr><td><b style="color:'+g.color+'">'+g.en+'</b></td><td>'+(l2Open(k)?'Station '+stageCount(k)+' / 4':'Locked (opens at room 3)')+'</td><td>'+Math.min(l.pts[0],15)+' / 15</td><td>'+Math.min(l.pts[1],15)+' / 15</td><td>'+Math.min(l.pts[2],20)+' / 20</td><td>'+l.wst.length+'</td></tr>'; }).join("")+'</table>'
    + '<p style="margin:6px 0;color:var(--muted)">Reading opens by itself when a girl reaches the third room. Each station opens the next one after enough correct answers. '+(SR?'Read-aloud uses Chrome speech recognition (needs internet; Chrome asks for the microphone once).':'This tablet\'s browser does not support speech recognition, so the read-aloud station stays closed.')+'</p>'
    + '<button class="btn small ghost" data-act="l2openall">Open reading now for all three</button>';
  s+='<h4>Sentences (level 3)</h4><table><tr><th>Girl</th><th>Status</th><th>Picture</th><th>Complete</th><th>Order</th><th>Stickers</th></tr>'
    + GIRLS.map(g=>{ const k=kid(g.id), l=l3(k); return '<tr><td><b style="color:'+g.color+'">'+g.en+'</b></td><td>'+(l3Open(k)?'Station '+Math.min(stage3Count(k),4)+' / 4':'Locked ('+l2Earned(l2(k))+' / 40 reading stickers)')+'</td><td>'+Math.min(l.pts[0],15)+' / 15</td><td>'+Math.min(l.pts[1],15)+' / 15</td><td>'+Math.min(l.pts[2],15)+' / 15</td><td>'+(l.ss||0)+' / 40</td></tr>'; }).join("")+'</table>'
    + '<p style="margin:6px 0;color:var(--muted)">Sentences open when a girl has collected all 40 reading-album stickers. Stories and read-aloud open after the first three stations.</p>'
    + '<button class="btn small ghost" data-act="l3openall">Open sentences now for all three</button>';
  s+='<h4>Settings</h4><table><tr><td>Daily share per girl</td><td><span class="seg">'+[3,5,8,16,24].map(n=>'<button data-act="setshare" data-n="'+n+'" class="'+(n===sh?'on':'')+'">'+n+'</button>').join("")+'</span></td></tr>'
   + '<tr><td>Daily reward (shown to the girls)</td><td><input type="text" id="rw" value="'+esc(S.settings.reward)+'"></td></tr>'
   + '<tr><td>Weekly bonus</td><td><input type="text" id="wrw" value="'+esc(S.settings.weekReward)+'"></td></tr>'
   + '<tr><td></td><td><button class="btn small" data-act="savesettings">Save rewards</button> <button class="btn small ghost" data-act="changepin">Change PIN</button></td></tr></table>';
  s+='<h4>Reset</h4>';
  if(resetAsk){
    const what = resetAsk==="all" ? "all progress for all three girls, the star jar and rewards" : "all of "+G(resetAsk).en+"'s letters, stars and stickers";
    s+='<div class="note warn">This will erase '+what+' on every tablet. It cannot be undone.<div style="display:flex;gap:8px;margin-top:8px"><button class="btn small" style="background:var(--bad);box-shadow:none" data-act="resetyes">Yes, reset</button><button class="btn small ghost" data-act="resetno">Cancel</button></div></div>';
  } else {
    s+='<div style="display:flex;gap:8px;flex-wrap:wrap">'+GIRLS.map(g=>'<button class="btn small ghost" data-act="resetask" data-w="'+g.id+'">Reset '+g.en+'</button>').join("")+'<button class="btn small ghost" style="color:var(--bad)" data-act="resetask" data-w="all">Reset everything</button></div>';
    s+='<p style="margin:6px 0 0;color:var(--muted)">Resetting one girl clears her letters, stars and stickers. "Reset everything" also empties the star jar and the reward history. The PIN, settings and family link stay.</p>';
  }
  s+='</div></div>';
  return s;
}

/* ---------- Events ---------- */
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]"); if(!b) return;
  const a=b.dataset.act; if(view.name!=="studio") sfx.tap();
  switch(a){
    case "pickgirl": me=b.dataset.id; lsSet("bh_girl",me); say("أَهْلًا يَا "+G(me).say); { const sp=ensureSpecial(); go("home"); if(sp) setTimeout(()=>showStickers([sp],true),900); else setTimeout(checkCelebrate,400); } break;
    case "switch": go("pick"); break;
    case "home": round=null; go("home"); break;
    case "stickers": go("stickers"); seenAll(); break;
    case "stknext": stickerNext(); break;
    case "stkbook": overlay=null; round=null; go("stickers"); seenAll(); break;
    case "room": { const gi=+b.dataset.g; overlay={type:"room",g:gi}; renderOverlay(); const k=kid(me); say(gi<k.unlocked?GROUPS[gi].name:"هَذِهِ الْغُرْفَةُ مُقْفَلَة"); break; }
    case "letter": { const i=+b.dataset.i; overlay={type:"letter",i}; renderOverlay(); say(L[i].name+"، "+L[i].word); break; }
    case "sayletter": { const i=+b.dataset.i; say(L[i].name+"، "+L[i].word); break; }
    case "practice": startRound("trace",+b.dataset.i); break;
    case "close": overlay=null; renderOverlay(); break;
    case "play": startRound(b.dataset.type); break;
    case "replay": promptCurrent(); break;
    case "answer": answer(+b.dataset.o); break;
    case "openstudio": studio=Object.assign(studio,{state:"idle",msg:""}); go("studio"); break;
    case "studioback": stopRecording(); stopClip(); if(recStream){ recStream.getTracks().forEach(t=>t.stop()); recStream=null; } go("parent"); break;
    case "recby": lsSet("bh_recby",b.dataset.n); render(); break;
    case "sgroup": studio.g=+b.dataset.n; studio.i=0; studio.state="idle"; studio.msg=""; render(); break;
    case "sprev": studioMove(-1); break;
    case "snext": studioMove(1); break;
    case "sjump": studio.i=+b.dataset.n; studio.state="idle"; studio.msg=""; render(); break;
    case "srec": studioRecord(); break;
    case "sredo": studio.state="idle"; studioRecord(); break;
    case "slisten": studioListen(); break;
    case "ssave": studioSave(); break;
    case "splay": { const it=studioItem(); if(CLIPS[it.id]) playClips([it.id]); break; }
    case "stts": ttsOnly(studioItem().t); break;
    case "sdel": studioDelete(); break;
    case "answer2": answer2(+b.dataset.o); break;
    case "answer3": answer3(+b.dataset.o); break;
    case "tile3": tile3(+b.dataset.o); break;
    case "mic3": mic3(); break;
    case "help3": { const q=round.qs[round.cur]; if(!q.done){ q.helped=true; say(SENT[q.s].s,0.75); } break; }
    case "s3say": { const S3=STORIES[round.story]; say(S3.lines[round.page][0],0.75); break; }
    case "s3page": round.page++; render(); if(round.page>=STORIES[round.story].lines.length) setTimeout(promptCurrent3,300); break;
    case "stlock3": { const k=kid(me), s=+b.dataset.s, st=stage3State(k,s);
      overlay={type:"msg",icon:"🔒",text: st==="locked" ? "أكملي المحطة السابقة لفتح "+STAGES3[s].name : st}; renderOverlay(); break; }
    case "l3openall": GIRLS.forEach(g=>{ const k=kid(g.id); k.l3=Object.assign({},l3(k),{open:true}); saveDoc("kids",g.id,k); }); toast("Sentences level opened"); render(); break;
    case "help": { const q=round.qs[round.cur]; if(!q.done){ q.helped=true; say(WORDS[q.w].w); } break; }
    case "tile": tile(+b.dataset.o); break;
    case "mic": mic(); break;
    case "level": { const want=+b.dataset.l, k=kid(me);
      if(want===2 && !l2Open(k)){ overlay={type:"msg",icon:"📖",text:"افتحي 3 غرف في بيت الحروف لتبدئي القراءة"}; renderOverlay(); say("اِفْتَحِي ثَلَاثَ غُرَفٍ لِتَبْدَئِي الْقِرَاءَة"); break; }
      if(want===3 && !l3Open(k)){ const got=l2Earned(l2(k)); overlay={type:"msg",icon:"📚",text:"اجمعي كل ملصقات القراءة لتفتحي الجمل ("+got+" / "+L2STK.length+")"}; renderOverlay(); say("اِجْمَعِي كُلَّ مُلْصَقَاتِ الْقِرَاءَة"); break; }
      lsSet("bh_level_"+me,want); render(); if(want===2) say("هَيَّا نَقْرَأ!"); if(want===3) say("هَيَّا نَقْرَأُ الْجُمَل!"); break; }
    case "stlock": { const k=kid(me), s=+b.dataset.s, st=stageState(k,s);
      const text = st==="locked" ? "أكملي المحطة السابقة لفتح "+STAGES[s].name : st;
      overlay={type:"msg",icon:"🔒",text}; renderOverlay(); break; }
    case "l2openall": GIRLS.forEach(g=>{ const k=kid(g.id); k.l2=Object.assign({},l2(k),{open:true}); saveDoc("kids",g.id,k); }); toast("Reading level opened"); render(); break;
    case "tclear": if(trace&&!trace.done){ trace.strokes=0; trace.reset(); } break;
    case "quit": round=null; pendingKid=null; try{window.speechSynthesis&&window.speechSynthesis.cancel();}catch(e){} go("home"); break;
    case "again": startRound(round.practice?"trace":round.type, round.practice?round.qs[0].t:undefined); break;
    case "parent": pinBuf=""; overlay={type:"pin",then:{kind:"parent"}}; renderOverlay(); break;
    case "redeem": pinBuf=""; overlay={type:"pin",then:{kind:"redeem",key:b.dataset.key}}; renderOverlay(); break;
    case "pin": pinPress(b.dataset.d); break;
    case "leaveparent": resetAsk=null; go(me?"home":"pick"); break;
    case "redeemnow": saveDoc("redeem",b.dataset.key,{at:new Date().toISOString(),girl:null}); render(); break;
    case "setshare": saveDoc("settings","family",Object.assign({},S.settings,{share:+b.dataset.n})); render(); break;
    case "savesettings": { const rw=$("#rw").value.trim()||defaultSettings().reward, wrw=$("#wrw").value.trim()||defaultSettings().weekReward; saveDoc("settings","family",Object.assign({},S.settings,{reward:rw,weekReward:wrw})); toast("Saved"); break; }
    case "famnew": lsSet("bh_family",newFamilyKey()); connect(true); toast("Family started"); break;
    case "famjoin": { const v=($("#famcode").value||"").toUpperCase().replace(/[^A-Z0-9]/g,""); if(v.length!==12){ toast("The code has 12 letters"); break; } lsSet("bh_family",v); connect(false); toast("Linked"); break; }
    case "famleave": try{ localStorage.removeItem("bh_family"); }catch(e){} connect(false); break;
    case "resetask": resetAsk=b.dataset.w; render(); break;
    case "resetno": resetAsk=null; render(); break;
    case "resetyes": doReset(resetAsk); break;
    case "changepin": saveDoc("settings","family",Object.assign({},S.settings,{pin:null})); pinBuf=""; overlay={type:"pin",then:{kind:"parent"}}; renderOverlay(); break;
  }
});
document.addEventListener("visibilitychange",()=>{ if(!document.hidden && fam) subscribeJar(); if(!document.hidden && view.name==="home") render(); });

/* ---------- Boot ---------- */
function start(data){
  me = (data && data.girl) || lsGet("bh_girl",null);
  if(me && !G(me)) me=null;
  view = me ? {name:"home"} : {name:"pick"};
  render();
  connect();
}
if("serviceWorker" in navigator && location.protocol==="https:"){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
start({});
})();
