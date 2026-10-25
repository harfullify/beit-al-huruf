/* ---------- core: players, saving, sound, speech, helpers ---------- */
const KIDS=[
  {id:'sophie',name:'Sophie',color:'#E0407B',dark:'#A82A5A',soft:'#FBE3EC',acc:'headband',accColor:'#D3302F'},
  {id:'olivia',name:'Olivia',color:'#2E9E4F',dark:'#1F7339',soft:'#E1F3E6',acc:'bow',accColor:'#A9D4F0'},
  {id:'julia',name:'Julia',color:'#7B5BD6',dark:'#5638A8',soft:'#ECE6FA',acc:'headband',accColor:'#1E1E1E'}
];
const KEY='numberCity.v1';
let DB={kids:{},voice:true};
let CUR=null,R=null,Q=[],G=0;

function load(){try{const raw=localStorage.getItem(KEY);if(raw){const d=JSON.parse(raw);if(d&&d.kids)DB=Object.assign({kids:{},voice:true},d);}}catch(e){}}
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){}}
function touch(id){if(id&&DB.kids[id])DB.kids[id].updated=Date.now();saveLocal();if(id&&typeof pushSoon==='function')pushSoon(id);}
function save(){touch(CUR);}
function newProf(){return{skills:{},stars:0,cards:0,set:'house',got:{},done:[],gold:[],pending:0,rounds:0,secs:0,placed:false};}
function prof(id){if(!DB.kids[id])DB.kids[id]=newProf();return DB.kids[id];}
function P(){return prof(CUR);}
function K(){return KIDS.find(k=>k.id===CUR);}
function st(p,id){if(!p.skills[id])p.skills[id]={h:[],m:false,g:false,miss:0,n:0,t:0};return p.skills[id];}
function totalCards(p){return Object.values(p.got).reduce((a,b)=>a+b,0);}
function need(c){return c===0?8:c===1?16:16+15*(c-1);}

const $=s=>document.querySelector(s);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function app(html){$('#app').innerHTML=html;try{window.scrollTo(0,0);}catch(e){}}
function theme(k){const r=document.documentElement.style;r.setProperty('--me',k?k.color:'#2F6FD6');r.setProperty('--me-soft',k?k.soft:'#E3ECFB');r.setProperty('--me-dark',k?k.dark:'#1F4FA6');}

/* sound */
let AC=null;
function ac(){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();}catch(e){AC=null;}return AC;}
function tone(f,d,w=0,type='sine',vol=.16){const a=ac();if(!a)return;try{const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;const t=a.currentTime+w;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.05);}catch(e){}}
const SFX={
  right(){tone(660,.18);tone(880,.28,.12);},
  again(){tone(330,.22,0,'triangle',.1);},
  card(){[523,659,784,1047].forEach((f,i)=>tone(f,.32,i*.12,'triangle'));},
  big(){[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.4,i*.11,'triangle'));}
};

/* speech: British English to match school maths words */
let VOICE=null;
function pickVoice(){try{const vs=speechSynthesis.getVoices();VOICE=vs.find(v=>/en[-_]GB/i.test(v.lang)&&/female/i.test(v.name))||vs.find(v=>/en[-_]GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null;}catch(e){}}
try{speechSynthesis.onvoiceschanged=pickVoice;pickVoice();}catch(e){}
function speak(t,done){let fired=false;const fin=()=>{if(fired)return;fired=true;if(done)done();};
  if(done)setTimeout(fin,Math.min(6000,1000+String(t||'').length*80));
  if(!DB.voice||!t){if(done)setTimeout(fin,250);return;}
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t).replace(/−/g,' take away ').replace(/\+/g,' plus ').replace(/=/g,' equals '));u.lang='en-GB';u.rate=.9;u.pitch=1.05;if(VOICE)u.voice=VOICE;u.onend=fin;u.onerror=fin;speechSynthesis.speak(u);}catch(e){}}
function hush(){try{speechSynthesis.cancel();}catch(e){}}

function confetti(n){for(let i=0;i<n;i++){const s=document.createElement('span');s.className='conf';s.textContent=pick(['⭐','✨','🎉','🌟']);s.style.left=rnd(2,96)+'vw';s.style.animationDelay=(Math.random()*.9)+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),3600);}}

const SPK='<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';

/* the girls, drawn as on their posters */
function avatarInner(k){
  const hair='#4A2C1D',skin='#D9A27A';
  const full=[[30,52],[27,70],[31,88],[38,36],[52,28],[68,28],[82,36],[92,52],[95,70],[90,88]];
  const half=[[31,54],[29,70],[38,38],[52,29],[68,29],[82,38],[91,54],[92,70],[60,20]];
  let s=`<path d="M22 120 Q24 98 60 96 Q96 98 98 120Z" fill="${k.color}"/>`;
  s+=(k.id==='olivia'?half:full).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="13" fill="${hair}"/>`).join('');
  s+=`<rect x="54" y="88" width="12" height="10" fill="${skin}"/><ellipse cx="60" cy="64" rx="28" ry="31" fill="${skin}"/>`;
  s+=[[40,42],[50,37],[60,35],[70,37],[80,42]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="${hair}"/>`).join('');
  s+='<ellipse cx="49" cy="64" rx="6" ry="7" fill="#3A2216"/><ellipse cx="71" cy="64" rx="6" ry="7" fill="#3A2216"/><circle cx="51" cy="61" r="2.2" fill="#fff"/><circle cx="73" cy="61" r="2.2" fill="#fff"/>';
  s+='<circle cx="42" cy="75" r="5.5" fill="#F07C98" opacity=".55"/><circle cx="78" cy="75" r="5.5" fill="#F07C98" opacity=".55"/>';
  if(k.id==='sophie')s+='<path d="M50 78 Q60 91 70 78Z" fill="#7A2E2E"/><rect x="52.5" y="78" width="6.3" height="4.5" fill="#fff"/><rect x="61.2" y="78" width="6.3" height="4.5" fill="#fff"/>';
  else s+='<path d="M51 79 Q60 87 69 79" stroke="#7A2E2E" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(k.acc==='headband')s+=`<path d="M34 50 Q60 22 86 50" stroke="${k.accColor}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  else s+=`<g transform="translate(88 40)"><path d="M0 0 L-14 -9 L-14 9Z M0 0 L14 -9 L14 9Z" fill="${k.accColor}" stroke="#6FA8CC" stroke-width="1.5"/><circle r="4.5" fill="#8EC1E3"/></g>`;
  return s;
}
function avatar(k){return `<svg viewBox="0 0 120 120" aria-hidden="true">${avatarInner(k)}</svg>`;}

/* small drawing helpers used by the maths games */
const THINGS=[['🍎','apples'],['🍓','strawberries'],['🐟','fish'],['⭐','stars'],['🎈','balloons'],['🐪','camels'],['🌴','palm trees'],['🦋','butterflies'],['🍪','cookies'],['🚗','cars'],['🐥','chicks'],['🌸','flowers'],['🐞','ladybirds'],['🧁','cupcakes']];
function objsHTML(n,e,o={}){
  const cols=n<=5?n:(n<=10?5:10);
  const fs=o.small?(n>10?'clamp(18px,4vw,28px)':'clamp(22px,4.6vw,36px)'):(n<=5?'clamp(44px,11vw,76px)':n<=10?'clamp(34px,9vw,58px)':'clamp(22px,6.6vw,42px)');
  const gone=o.gone||0;let s=`<div class="objs" style="grid-template-columns:repeat(${cols},auto);font-size:${fs}">`,c=0;
  for(let i=0;i<n;i++){const g=i>=n-gone;let lab='';if(o.labels&&!g){c++;lab=`<b class="n">${(o.from||0)+c}</b>`;}s+=`<span class="ob${g?' gone':''}">${e}${lab}</span>`;}
  return s+'</div>';
}
const SHAPES={circle:'<circle cx="50" cy="50" r="40"/>',square:'<rect x="12" y="12" width="76" height="76" rx="4"/>',triangle:'<path d="M50 10 L92 88 L8 88Z"/>',rectangle:'<rect x="4" y="27" width="92" height="46" rx="4"/>',star:'<path d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 72 L22 92 L33 58 L5 38 L39 38Z"/>',heart:'<path d="M50 88 C10 60 4 34 22 22 C36 13 48 22 50 32 C52 22 64 13 78 22 C96 34 90 60 50 88Z"/>',oval:'<ellipse cx="50" cy="50" rx="45" ry="29"/>',hexagon:'<path d="M28 10 L72 10 L94 50 L72 90 L28 90 L6 50Z"/>'};
const SHCOL=['#E0407B','#2F6FD6','#2E9E4F','#F4B23A','#7B5BD6','#E86A2B'];
function shapeSVG(name,col,size,outline){return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" ${outline?'fill="none" stroke="#1D2944" stroke-width="4" stroke-dasharray="8 6"':`fill="${col}"`} aria-hidden="true">${SHAPES[name]}</svg>`;}
const DICE={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function dice(n,h){return `<div class="dice">${[...Array(9)].map((_,i)=>`<i class="${DICE[n].includes(i)?'':'e'}"></i>`).join('')}</div>`+(h?`<p class="hintline">Count the dots: ${[...Array(n)].map((_,i)=>i+1).join(', ')}</p>`:'');}
function tenFrame(n,h){return `<div class="tf">${[...Array(10)].map((_,i)=>`<i class="${i<n?'f':''}">${h&&i<n?`<b>${i+1}</b>`:''}</i>`).join('')}</div>`+(h&&n>5?'<p class="hintline">The top row is 5. Count on from 5.</p>':'');}
function towerHTML(k,total,h){const cols=total>10?2:1,per=Math.min(10,total);let s='<div class="grp" style="align-items:flex-end">';for(let c=0;c<cols;c++){s+='<div class="tower">';for(let i=0;i<per;i++){const idx=c*10+i,f=idx<k;s+=`<i class="${f?'f':''}">${!f&&h?idx-k+1:''}</i>`;}s+='</div>';}return s+`<span class="tag">${k}</span></div>`;}
function trainHTML(seq,miss,h,step){let s='<div class="train"><span class="engine" aria-hidden="true">🚂</span>';seq.forEach((v,i)=>{if(h&&i>0)s+=`<span class="jump">+${step}</span>`;s+=i===miss?'<span class="car q">?</span>':`<span class="car">${v}</span>`;});return s+'</div>';}
function numLine(max,hl){let s='<div class="nlwrap"><div class="nl">';for(let i=0;i<=max;i++)s+=`<i class="${hl.includes(i)?'h':''}">${i}</i>`;return s+'</div><p class="hintline">Bigger numbers are further along the line.</p></div>';}
function clockSVG(h,m,hint){const ha=((h%12)+m/60)*30,ma=m*6,r=Math.PI/180;let s='<svg viewBox="0 0 200 200" width="220" height="220" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="#fff" stroke="#1D2944" stroke-width="8"/>';for(let i=1;i<=12;i++){const a=(i*30-90)*r;s+=`<text x="${(100+72*Math.cos(a)).toFixed(1)}" y="${(108+72*Math.sin(a)).toFixed(1)}" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="22" font-weight="600" fill="#1D2944">${i}</text>`;}s+=`<line x1="100" y1="100" x2="${(100+68*Math.sin(ma*r)).toFixed(1)}" y2="${(100-68*Math.cos(ma*r)).toFixed(1)}" stroke="${hint?'#2E9E4F':'#1D2944'}" stroke-width="6" stroke-linecap="round"/><line x1="100" y1="100" x2="${(100+44*Math.sin(ha*r)).toFixed(1)}" y2="${(100-44*Math.cos(ha*r)).toFixed(1)}" stroke="${hint?'#E0407B':'#1D2944'}" stroke-width="10" stroke-linecap="round"/><circle cx="100" cy="100" r="7" fill="#1D2944"/></svg>`;return s;}
function moneyOne(v){return v===1?'<span class="coin">1</span>':`<span class="note n${v}">${v}</span>`;}
function moneyHTML(list,h){let run=0;return `<div class="money">${list.map(v=>{run+=v;return `<span class="ob">${moneyOne(v)}${h?`<b class="n">${run}</b>`:''}</span>`;}).join('')}</div>`;}
const STICK='<rect width="6" height="80" rx="3" fill="#E2B04A" stroke="#B9852A" stroke-width="1"/>';
function bundleSVG(){let s='<svg viewBox="0 0 70 90" width="56" height="74" aria-hidden="true">';for(let i=0;i<10;i++)s+=`<g transform="translate(${(2+i*6.6).toFixed(1)} 4)">${STICK}</g>`;return s+'<rect x="0" y="38" width="70" height="10" rx="4" fill="#D2453B"/></svg>';}
function oneSVG(){return `<svg viewBox="0 0 10 90" width="9" height="74" aria-hidden="true"><g transform="translate(2 4)">${STICK}</g></svg>`;}
function sticksHTML(t,o,h){let s='<div class="money">';for(let i=0;i<t;i++)s+=`<span class="ob">${bundleSVG()}${h?`<b class="n">${(i+1)*10}</b>`:''}</span>`;if(o){s+='<span class="row" style="gap:7px">';for(let i=0;i<o;i++)s+=oneSVG();s+='</span>';}s+='</div>';if(h)s+=`<p class="hintline">Count the bundles in tens${o?`, then count on the loose sticks: ${[...Array(o)].map((_,i)=>t*10+i+1).join(', ')}`:''}.</p>`;return s;}
function platesHTML(g,n,e,h){let s='<div class="grp">';for(let i=0;i<g;i++)s+=`<div class="ob"><div class="plate" style="font-size:${n>5?17:28}px">${e.repeat(n)}</div>${h?`<b class="n">${(i+1)*n}</b>`:''}</div>`;return s+'</div>';}
/* ---------- buildings, cards and the city ---------- */
function win(x){return `<path d="M${x} 136 V96 A10 10 0 0 1 ${x+20} 96 V136Z" fill="#fff"/><path d="M${x+3} 133 V97 A7 7 0 0 1 ${x+17} 97 V133Z" fill="#8CC8E8"/><path d="M${x+10} 90 V133 M${x+3} 112 H${x+17}" stroke="#fff" stroke-width="2"/>`;}
function houseLayers(k){
  let teeth='';for(let i=0;i<11;i++)teeth+=`<rect x="${66+i*16}" y="54" width="8" height="9" fill="#fff"/>`;
  return [
    '<rect x="58" y="146" width="184" height="9" rx="2" fill="#9AA0A8"/><rect x="58" y="146" width="184" height="3" fill="#B7BCC3"/>',
    '<rect x="66" y="70" width="168" height="77" fill="#E3C793" stroke="#C7A56A" stroke-width="2"/><path d="M66 108 H234" stroke="#D8B97F" stroke-width="1.5"/>',
    '<rect x="126" y="146" width="48" height="5" fill="#8E949C"/><rect x="120" y="151" width="60" height="5" fill="#A6ACB4"/><rect x="114" y="156" width="72" height="5" fill="#8E949C"/>',
    '<path d="M130 146 V110 A20 20 0 0 1 170 110 V146Z" fill="#fff"/><path d="M134 146 V112 A16 16 0 0 1 166 112 V146Z" fill="#3B2A22"/><path d="M150 97 V146" stroke="#1F1511" stroke-width="1.5"/><rect x="137.5" y="116" width="9.5" height="11" rx="1.5" fill="#D9A63A"/><rect x="153" y="116" width="9.5" height="11" rx="1.5" fill="#D9A63A"/><rect x="137.5" y="131" width="9.5" height="11" rx="1.5" fill="#D9A63A"/><rect x="153" y="131" width="9.5" height="11" rx="1.5" fill="#D9A63A"/><circle cx="147" cy="129" r="1.4" fill="#F4D27A"/><circle cx="153" cy="129" r="1.4" fill="#F4D27A"/>',
    win(78)+win(106),
    win(174)+win(202),
    `<rect x="62" y="62" width="176" height="9" fill="#fff" stroke="#E2E6EA"/>${teeth}`,
    '<path d="M40 154 Q35 122 44 92" stroke="#8B5E3C" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M44 92 Q28 82 15 93 M44 92 Q34 73 21 72 M44 92 Q53 72 67 74 M44 92 Q60 85 70 97 M44 92 Q45 76 39 65" stroke="#3E9B4F" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="92" cy="150" rx="17" ry="7" fill="#5FB35E"/><ellipse cx="208" cy="150" rx="17" ry="7" fill="#5FB35E"/><g fill="#E0407B"><circle cx="86" cy="146" r="2.2"/><circle cx="97" cy="148" r="2.2"/><circle cx="204" cy="146" r="2.2"/><circle cx="214" cy="148" r="2.2"/></g>',
    '<g transform="translate(246 136)"><rect x="0" y="8" width="46" height="13" rx="5" fill="#F3F5F7" stroke="#9AA3AD"/><path d="M8 8 L14 0 H32 L38 8Z" fill="#F3F5F7" stroke="#9AA3AD"/><path d="M15 2 H22 V8 H11Z M25 2 H31 L35 8 H25Z" fill="#8CC8E8"/><circle cx="11" cy="22" r="5" fill="#1D2944"/><circle cx="35" cy="22" r="5" fill="#1D2944"/></g>',
    `<svg x="131" y="104" width="38" height="38" viewBox="0 0 120 120">${avatarInner(k)}</svg><path d="M137 141 L163 141 L166 156 L134 156Z" fill="${k.color}"/><path d="M144 156 V163 M156 156 V163" stroke="#D9A27A" stroke-width="3.5" stroke-linecap="round"/>`
  ];
}
function houseSVG(count,hl,k){
  let s='<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="200" fill="#CBE8F6"/><circle cx="262" cy="34" r="17" fill="#FFD36E"/><g fill="#fff" opacity=".9"><ellipse cx="60" cy="34" rx="22" ry="8"/><ellipse cx="74" cy="29" rx="14" ry="8"/><ellipse cx="180" cy="22" rx="18" ry="6"/></g><rect y="152" width="300" height="48" fill="#EFD9A8"/><rect y="152" width="300" height="5" fill="#E3C890"/>';
  if(!count)s+='<rect x="62" y="62" width="176" height="94" fill="none" stroke="#B89A66" stroke-width="2.5" stroke-dasharray="7 6"/><text x="150" y="114" text-anchor="middle" font-family="Fredoka,sans-serif" font-size="16" font-weight="600" fill="#9C7F4E">Your house goes here</text>';
  houseLayers(k).slice(0,count).forEach((l,i)=>{s+=(hl&&i===count-1)?`<g class="newpc">${l}</g>`:l;});
  return s+'</svg>';
}
const BURJ='<svg viewBox="0 0 40 120" style="height:1.9em" aria-hidden="true"><path d="M19 0 H21 V24 H24 V50 H27 V76 H31 V100 H35 V120 H5 V100 H9 V76 H13 V50 H16 V24 H19Z" fill="#A9C3D6" stroke="#5F7C93" stroke-width="1.5"/><path d="M20 26 V118" stroke="#E8F1F7" stroke-width="1.5"/></svg>';
const FRAME='<svg viewBox="0 0 60 80" style="height:1.7em" aria-hidden="true"><path fill-rule="evenodd" d="M0 0 H60 V80 H0Z M12 12 V80 H48 V12Z" fill="#D9A63A" stroke="#A97A1B" stroke-width="1.5"/></svg>';
const FLAG='<svg viewBox="0 0 50 70" style="height:1.5em" aria-hidden="true"><rect x="4" y="2" width="4" height="68" fill="#6B7280"/><path d="M8 4 H46 L38 16 L46 28 H8Z" fill="#2F6FD6"/><path d="M16 18 Q24 9 30 17 Q36 9 42 16" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';

const HOUSE_NAMES=['Foundation','Sand walls','Granite steps','Gold double door','Arched windows','More arched windows','White roof','Garden and palm tree','Family car','At the door'];
const SETS={
  house:{name:'Our House',color:'#C9893B',icon:'🏠',size:10},
  school:{name:'Our School',color:'#2F6FD6',icon:'🏫',bg:'linear-gradient(180deg,#C6E6F6 0%,#E8F6FB 58%,#A8D78F 58%,#86C26F 100%)',pieces:[
    ['School building','🏫'],['Falcons flag',FLAG],['Classroom','📚'],['Playground','🛝'],['Gym','🤸'],['Music room','🥁'],['Piano','🎹'],['Art room','🎨'],['Library','📖'],['Lunch hall','🥪'],['Football pitch','⚽'],['Swimming pool','🏊'],['Science lab','🔬'],['School bus','🚌'],['School bell','🔔']]},
  town:{name:'Our Neighbourhood',color:'#2E9E4F',icon:'🏘️',bg:'linear-gradient(180deg,#CFE8F7 0%,#EEF8FC 58%,#C9C3B6 58%,#C9C3B6 63%,#BFE2A3 63%,#9DCF84 100%)',pieces:[
    ['Our street','🏘️'],['Park','🌳'],['Fountain','⛲'],['Mall','🏬'],['Supermarket','🛒'],['Bakery','🥐'],['Ice cream shop','🍦'],['Toy shop','🧸'],['Flower shop','💐'],['Bus stop','🚏'],['Fire station','🚒'],['Clinic','🏥'],['Cycle path','🚲'],['Palm trees','🌴'],['Traffic lights','🚦'],['Café','☕'],['Carousel','🎠'],['Taxi','🚕'],['Delivery bike','🛵'],['Police car','🚓']]},
  dubai:{name:'Dubai',color:'#B97A0A',icon:BURJ,bg:'linear-gradient(180deg,#FFD9A0 0%,#FBE9C9 30%,#D7EEF8 58%,#EFD9A8 58%,#D9B77B 100%)',pieces:[
    ['Burj Khalifa',BURJ],['Dubai Frame',FRAME],['Metro train','🚝'],['Abra boat','🛶'],['Beach','🏖️'],['Desert camp','🏕️'],['Camel','🐪'],['Falcon','🦅'],['Dhow','⛵'],['Fireworks','🎆'],['Museum','🏛️'],['Miracle Garden','🌷'],['Global Village','🎪'],['Aquarium','🐠'],['Ski slope','⛷️'],['Marina towers','🏙️'],['Big wheel','🎡'],['Gold souk','💍'],['Spice souk','🌶️'],['Tram','🚋'],['Airport','✈️'],['Sand dunes','🏜️'],['Palm island','🏝️'],['Zoo','🦒'],['Date palms','🌴']]}
};
['school','town','dubai'].forEach(s=>SETS[s].size=SETS[s].pieces.length);
const SET_ORDER=['house','school','town','dubai'];
const GOLD=[['🐱','Cat'],['🐶','Puppy'],['🐰','Bunny'],['🦜','Parrot'],['🦋','Butterfly'],['🌈','Rainbow'],['🎈','Balloons'],['🪁','Kite'],['🌻','Sunflower'],['🐢','Turtle'],['🦄','Unicorn'],['🐞','Ladybird'],['🐝','Bee'],['🦢','Swan'],['🐬','Dolphin'],['🐼','Panda'],['🦩','Flamingo'],['🍉','Watermelon'],['🌷','Tulips'],['🐣','Chick'],['🦔','Hedgehog'],['🦉','Owl'],['🐧','Penguin'],['🐨','Koala'],['🦊','Fox'],['🐠','Goldfish'],['🍓','Strawberries'],['🧁','Cupcake'],['🎀','Ribbon'],['⭐','Star'],['🌙','Moon'],['🐿️','Squirrel'],['🦒','Giraffe'],['🐘','Elephant']];

function slotPos(i,n){
  if(i===0)return[50,60,19];
  const m=n-1,j=i-1,per=m>14?6:5,rows=Math.ceil(m/per),r=Math.floor(j/per),inRow=Math.min(per,m-r*per),c=j%per;
  const x=(c+.5)/inRow*100+((i*37)%9-4)*.6,y=70+(r+1)*(28/rows),s=6.5+r*1.2;
  return[Math.max(7,Math.min(93,x)),Math.min(98,y),s];
}
function sceneHTML(set,count,hl,k){
  if(set==='house')return `<div class="scene">${houseSVG(count,hl,k)}</div>`;
  const S=SETS[set];let h=`<div class="scene" style="background:${S.bg}">`;
  if(!count)h+='<span class="pc" style="left:50%;top:66%;--s:14cqw;opacity:.5">🚧</span>';
  for(let i=0;i<count;i++){const[x,y,s]=slotPos(i,S.size);h+=`<span class="pc${hl&&i===count-1?' new':''}" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;--s:${s}cqw">${S.pieces[i][1]}</span>`;}
  return h+'</div>';
}
function pieceName(set,i,k){return set==='house'?(i===9?`${k.name} at the door`:HOUSE_NAMES[i]):SETS[set].pieces[i][0];}
function pieceIcon(set,i,k,hl){return set==='house'?sceneHTML('house',i+1,hl,k):SETS[set].pieces[i][1];}
function cardHTML(it,k){const S=SETS[it.set];return `<div class="card" style="--c:${S.color}"><div class="st">${S.name}</div><div class="ic">${pieceIcon(it.set,it.idx,k,true)}</div><div class="nm">${pieceName(it.set,it.idx,k)}</div><div class="st">Card ${it.idx+1} of ${S.size}</div></div>`;}
function goldHTML(it){const g=GOLD[it.gi%GOLD.length];return `<div class="card goldc" style="--c:var(--gold)"><div class="st">Gold card</div><div class="ic">${g[0]}</div><div class="nm">${g[1]}</div><div class="st">You learned: ${it.skill}</div></div>`;}
function awardCard(p){if(!p.set){p.pending++;return null;}const set=p.set,idx=p.got[set]||0;p.got[set]=idx+1;const done=idx+1>=SETS[set].size;if(done){p.done.push(set);p.set=null;}return{type:'card',set,idx,done};}
function orderSets(p){const rest=SET_ORDER.filter(s=>s!=='house'&&!p.done.includes(s)&&p.set!==s);return['house',...p.done.filter(s=>s!=='house'),...(p.set&&p.set!=='house'?[p.set]:[]),...rest];}
/* ---------- the maths games: each skill makes a question ----------
   gen(easy, pic, nChoices): easy = she missed twice in a row, so smaller numbers;
   pic = show objects (concrete/pictorial) rather than numerals only. */
const ch=a=>a.map(v=>({v}));
function near(ans,n,min,max,step=1){const c=[ans];for(const v of shuffle([ans+step,ans-step,ans+1,ans-1,ans+2*step,ans-2*step,ans+2,ans-2])){if(c.length>=n)break;if(v>=min&&v<=max&&!c.includes(v))c.push(v);}let x=min;while(c.length<n&&x<=max){if(!c.includes(x))c.push(x);x++;}return shuffle(c);}

const genCount=(lo,hi)=>(easy,pic,nc)=>{const n=rnd(lo,easy?Math.min(hi,lo+3):hi);const[e,p]=pick(THINGS);return{text:`How many ${p}?`,show:h=>objsHTML(n,e,{labels:h}),choices:ch(near(n,nc,1,hi+2)),answer:n};};

function genShapes(easy,pic,nc){const pool=easy?['circle','square','triangle','rectangle']:Object.keys(SHAPES);const t=pick(pool);const opts=shuffle([t,...shuffle(pool.filter(x=>x!==t)).slice(0,nc-1)]);const cols=shuffle(SHCOL);
  return{text:`Tap the ${t}.`,show:h=>`<div class="word">${t}</div>`+(h?shapeSVG(t,'',110,true):''),choices:opts.map((v,i)=>({v,html:shapeSVG(v,cols[i%cols.length],78)})),answer:t,answerSay:`the ${t}`};}

const genQuick=(max,frame)=>(easy,pic,nc)=>{const n=rnd(1,easy?(frame?6:3):max);return{text:'How many dots?',say:'Look quickly! How many dots?',flash:frame?4000:3000,show:h=>frame?tenFrame(n,h):dice(n,h),choices:ch(near(n,nc,1,frame?10:6)),answer:n};};

const genTrain=kind=>(easy,pic,nc)=>{let start,step=1,len=5,miss;
  if(kind==='next10'){len=4;start=rnd(1,easy?3:7);miss=3;}
  else if(kind==='to20'){start=rnd(easy?1:5,easy?10:16);miss=rnd(1,4);}
  else if(kind==='skip'){step=pick(easy?[10,2]:[2,5,10]);start=step*rnd(1,easy?2:4);miss=rnd(2,4);}
  else{step=easy?1:pick([1,1,10]);start=step===10?rnd(1,9)+10*rnd(0,4):rnd(20,94);miss=rnd(1,4);}
  const seq=[...Array(len)].map((_,i)=>start+i*step),ans=seq[miss];
  return{text:miss===len-1?'Which number comes next?':'Which number is missing?',show:h=>trainHTML(seq,miss,h,step),choices:ch(near(ans,nc,0,ans+60,step)),answer:ans};};

function genMore(easy,pic,nc){let a,b;do{a=rnd(1,easy?6:10);b=rnd(1,easy?6:10);}while(Math.abs(a-b)<(easy?2:1));const[e,p]=pick(THINGS);
  return{text:`Which has more ${p}?`,inStage:1,show:()=>'',choices:[a,b].map(v=>({v,html:objsHTML(v,e,{small:1}),hhtml:objsHTML(v,e,{small:1,labels:1})})),answer:Math.max(a,b),answerSay:`the group with ${Math.max(a,b)}`};}

function genPattern(easy,pic,nc){const u=pick(easy?[[0,1]]:[[0,1],[0,0,1],[0,1,1],[0,1,2]]);const shs=shuffle(Object.keys(SHAPES)).slice(0,3),cols=shuffle(SHCOL).slice(0,3);const it=shs.map((s,i)=>({s,c:cols[i]}));const len=u.length*2+rnd(0,u.length-1);const seq=[...Array(len)].map((_,i)=>u[i%u.length]);const ans=u[len%u.length];
  return{text:'What comes next?',show:h=>`<div class="pat">${seq.map((x,i)=>(h&&i&&i%u.length===0?'<span class="sep"></span>':'')+shapeSVG(it[x].s,it[x].c,52)).join('')}<span class="qbox">?</span></div>`+(h?'<p class="hintline">Find the part that repeats.</p>':''),choices:shuffle([0,1,2]).map(v=>({v,html:shapeSVG(it[v].s,it[v].c,70)})),answer:ans,answerSay:`the ${it[ans].s}`};}

const genBond=total=>(easy,pic,nc)=>{const lo=total===5?1:total===10?(easy?5:1):(easy?13:8);const k=rnd(lo,total-1),ans=total-k;
  return pic?{text:`How many more to make ${total}?`,show:h=>towerHTML(k,total,h),choices:ch(near(ans,nc,0,total)),answer:ans}
  :{text:`${k} and ? make ${total}`,say:`${k} and what make ${total}?`,show:h=>`<div class="big-sum">${k} + ? = ${total}</div>`+(h?towerHTML(k,total,1):''),choices:ch(near(ans,nc,0,total)),answer:ans};};

const genAdd=max=>(easy,pic,nc)=>{const lo=max===5?2:max===10?(easy?2:4):(easy?8:11),hi=easy?Math.min(max,lo+4):max;const sum=rnd(lo,hi),a=rnd(1,sum-1),b=sum-a;const[e,p]=pick(THINGS);
  const vis=h=>`<div class="grp">${objsHTML(a,e,{labels:h,small:sum>10})}<span class="op">+</span>${objsHTML(b,e,{labels:h,from:a,small:sum>10})}</div>`;
  return pic?{text:'How many altogether?',say:`${a} ${p} and ${b} more. How many altogether?`,show:vis,choices:ch(near(sum,nc,0,max+2)),answer:sum}
  :{text:`${a} + ${b} = ?`,say:`What is ${a} plus ${b}?`,show:h=>`<div class="big-sum">${a} + ${b} = ?</div>`+(h?vis(1):''),choices:ch(near(sum,nc,0,max+2)),answer:sum};};

const genTake=max=>(easy,pic,nc)=>{const lo=max===5?2:max===10?(easy?3:5):(easy?8:11),hi=easy?Math.min(max,lo+4):max;const n=rnd(lo,hi),k=rnd(1,n-1),ans=n-k;const[e,p]=pick(THINGS);
  const vis=h=>objsHTML(n,e,{gone:k,labels:h,small:n>10});
  return pic?{text:'How many are left?',say:`There are ${n} ${p}. ${k} go away. How many are left?`,show:vis,choices:ch(near(ans,nc,0,max)),answer:ans}
  :{text:`${n} − ${k} = ?`,say:`What is ${n} take away ${k}?`,show:h=>`<div class="big-sum">${n} − ${k} = ?</div>`+(h?vis(1):''),choices:ch(near(ans,nc,0,max)),answer:ans};};

function genCompare(easy,pic,nc){let a,b;do{a=rnd(0,20);b=rnd(0,20);}while(a===b||(easy&&Math.abs(a-b)<5));const big=easy||Math.random()<.65,ans=big?Math.max(a,b):Math.min(a,b);
  return{text:`Which number is ${big?'bigger':'smaller'}?`,inStage:1,show:h=>h?numLine(20,[a,b]):'',choices:[{v:a,big:1},{v:b,big:1}],answer:ans};}

function genDoubles(easy,pic,nc){const n=rnd(1,easy?5:10);const vis=h=>`<div class="grp">${objsHTML(n,'🦋',{labels:h,small:n>5})}<span class="op">+</span>${objsHTML(n,'🦋',{labels:h,from:n,small:n>5})}</div>`;
  return pic?{text:`Double ${n}. How many butterflies?`,say:`Double ${n}. ${n} and ${n} more. How many butterflies?`,show:vis,choices:ch(near(2*n,nc,0,22,2)),answer:2*n}
  :{text:`${n} + ${n} = ?`,say:`What is double ${n}?`,show:h=>`<div class="big-sum">${n} + ${n} = ?</div>`+(h?vis(1):''),choices:ch(near(2*n,nc,0,22,2)),answer:2*n};}

function genCoins(easy,pic,nc){const t=rnd(easy?2:6,easy?9:20);const list=[];let r=t;if(r>=10&&Math.random()<.75){list.push(10);r-=10;}while(r>=5&&(r>=9||Math.random()<.7)){list.push(5);r-=5;}while(r>0){list.push(1);r--;}
  return{text:'How many dirhams?',show:h=>moneyHTML(list,h)+(h?'<p class="hintline">Start with the biggest, then count on.</p>':''),choices:ch(near(t,nc,1,30)),answer:t,answerSay:`${t} dirhams`};}

const genClock=half=>(easy,pic,nc)=>{const h=rnd(1,12),m=half?30:0;const lab=(hh,mm)=>mm?`half past ${hh}`:`${hh} o'clock`;const opts=[lab(h,m)];if(half)opts.push(lab(h%12+1,30));while(opts.length<3){const o=lab(rnd(1,12),half&&Math.random()<.5?0:m);if(!opts.includes(o))opts.push(o);}
  return{text:'What time is it?',show:hi=>clockSVG(h,m,hi)+(hi?`<p class="hintline"><span style="color:#C8336C">The short hand shows the hour.</span> <span style="color:#24803F">${half?'The long hand points down to 6: half past.':"The long hand points up to 12: o'clock."}</span></p>`:''),choices:shuffle(opts).map(v=>({v,txt:1})),answer:lab(h,m)};};

const genTens=max=>(easy,pic,nc)=>{const t=rnd(1,easy?(max===50?2:4):(max===50?4:9)),o=rnd(0,easy?5:9),ans=t*10+o;const words=!pic&&max===100;
  return{text:words?`${t} tens and ${o} ones. How many?`:'How many sticks?',say:words?`${t} tens and ${o} ones. What number is that?`:'Each bundle has 10 sticks. How many sticks altogether?',show:h=>sticksHTML(t,o,h),choices:ch(near(ans,nc,0,max+9,10)),answer:ans};};

const SHOPITEMS=[['🧃','juice'],['🍦','ice cream'],['🧸','teddy'],['📕','book'],['🎈','balloon'],['🪀','yo-yo'],['🍩','doughnut'],['🪁','kite']];
function genShop(easy,pic,nc){const p=rnd(easy?2:4,easy?9:20);const[e,name]=pick(SHOPITEMS);return{text:`Pay ${p} dirhams for the ${name}.`,answer:p,interactive:1,shop:{p,e,name},answerSay:`${p} dirhams`};}

function genHalves(easy,pic,nc){const n=2*rnd(1,easy?5:10),a=n/2;
  return{text:`Share ${n} cookies on 2 plates. How many on each?`,say:`Share ${n} cookies fairly on 2 plates. How many cookies on each plate?`,show:h=>(h?'':objsHTML(n,'🍪',{small:n>10}))+`<div class="grp">${[0,1].map(()=>`<div class="plate" style="font-size:${a>5?17:28}px">${h?'🍪'.repeat(a):''}</div>`).join('')}</div>`,choices:ch(near(a,nc,1,12)),answer:a};}

function genMissing(easy,pic,nc){const c=rnd(easy?3:6,easy?10:20),b=rnd(1,c-1),a=c-b;
  return{text:`? + ${b} = ${c}`,say:`What number plus ${b} makes ${c}?`,show:h=>`<div class="grp"><div class="pan">? + ${b}</div><span class="op">=</span><div class="pan">${c}</div></div>`+(h?objsHTML(c,'🍎',{gone:b,labels:1,small:c>10})+`<p class="hintline">Take ${b} away from ${c}. Count what is left.</p>`:''),choices:ch(near(a,nc,0,20)),answer:a};}

function genGroups(easy,pic,nc){const n=pick(easy?[2,10]:[2,5,10]),g=rnd(2,easy?3:5),ans=g*n,e=pick(['🍪','🍓','🧁','🍎']);
  return{text:`${g} plates with ${n} on each. How many altogether?`,show:h=>platesHTML(g,n,e,h)+(h?`<p class="hintline">Count in ${n}s.</p>`:''),choices:ch(near(ans,nc,0,60,n)),answer:ans};}

function genAdd2d(easy,pic,nc){let a,b;if(easy||Math.random()<.5){a=10*rnd(1,5);b=10*rnd(1,9-a/10);}else{a=10*rnd(1,8)+rnd(0,5);b=rnd(1,9-a%10);}const s=a+b;
  return{text:`${a} + ${b} = ?`,say:`What is ${a} plus ${b}?`,show:h=>`<div class="big-sum">${a} + ${b} = ?</div>`+(h?`<div class="grp">${sticksHTML(Math.floor(a/10),a%10,0)}<span class="op">+</span>${sticksHTML(Math.floor(b/10),b%10,0)}</div><p class="hintline">Add the tens, then the ones.</p>`:''),choices:ch(near(s,nc,0,100,10)),answer:s};}

/* the skill ladder, easiest first (UK Year 1 to Year 2) */
const SK=[
  ['count5','Count to 5','Counting',genCount(1,5)],
  ['shapes','Shapes','Real world',genShapes],
  ['quick5','Quick look to 5','Number sense',genQuick(5,false)],
  ['count10','Count to 10','Counting',genCount(4,10)],
  ['next10','What comes next','Counting',genTrain('next10')],
  ['more10','Which has more','Number sense',genMore],
  ['pattern','Patterns','Patterns',genPattern],
  ['bond5','Make 5','Number bonds',genBond(5)],
  ['add5','Add to 5','Add and take away',genAdd(5)],
  ['quick10','Ten-frame quick look','Number sense',genQuick(10,true)],
  ['take5','Take away to 5','Add and take away',genTake(5)],
  ['count20','Count to 20','Counting',genCount(11,20)],
  ['bond10','Make 10','Number bonds',genBond(10)],
  ['add10','Add to 10','Add and take away',genAdd(10)],
  ['take10','Take away to 10','Add and take away',genTake(10)],
  ['more20','Bigger and smaller to 20','Number sense',genCompare],
  ['train20','Missing numbers to 20','Counting',genTrain('to20')],
  ['doubles','Doubles','Patterns',genDoubles],
  ['coins','Count dirhams','Real world',genCoins],
  ['oclock',"O'clock",'Real world',genClock(false)],
  ['skip','Count in 2s, 5s and 10s','Patterns',genTrain('skip')],
  ['bond20','Make 20','Number bonds',genBond(20)],
  ['add20','Add to 20','Add and take away',genAdd(20)],
  ['take20','Take away to 20','Add and take away',genTake(20)],
  ['tens50','Tens and ones to 50','Place value',genTens(50)],
  ['shop','Corner shop','Real world',genShop],
  ['halves','Halves','Patterns',genHalves],
  ['missing','Missing number','Add and take away',genMissing],
  ['halfpast','Half past','Real world',genClock(true)],
  ['train100','Numbers to 100','Place value',genTrain('to100')],
  ['groups','Equal groups','Patterns',genGroups],
  ['tens100','Tens and ones to 100','Place value',genTens(100)],
  ['add2d','Adding tens','Place value',genAdd2d]
].map(([id,name,strand,gen],i)=>({id,name,strand,gen,i}));
/* ---------- family cloud sync ----------
   Uses the same Firebase project and family code as Beit al-Huruf. Each girl's progress is one
   document: families/{code}/settings/nc_{girl}, marked kind:'numberCity' so the Arabic game ignores it.
   The newest copy wins, so a tablet that played offline catches up when it is back online. */
let FAM=null;const pushT={};
function famKey(){for(const k of['nc_family','bh_family']){try{const v=JSON.parse(localStorage.getItem(k));if(typeof v==='string'&&v.length===12)return v;}catch(e){}}return null;}
const prettyKey=k=>k?k.match(/.{1,4}/g).join('-'):'';
async function cloudInit(){
  try{const cfg=window.FIREBASE_CONFIG;if(!cfg||!cfg.apiKey||!window.firebase)return;
    if(!firebase.apps.length)firebase.initializeApp(cfg);
    const f=firebase.firestore();try{await f.enablePersistence({synchronizeTabs:true});}catch(e){}
    const key=famKey();if(!key)return;
    FAM=f.collection('families').doc(key);
    KIDS.forEach(k=>FAM.collection('settings').doc('nc_'+k.id).onSnapshot(d=>onRemoteKid(k.id,d),e=>console.warn(e)));
  }catch(e){console.warn(e);FAM=null;}
}
function pushSoon(id){if(!FAM)return;clearTimeout(pushT[id]);pushT[id]=setTimeout(()=>pushKid(id),1200);}
function pushKid(id){const p=DB.kids[id];if(!FAM||!p)return;
  FAM.collection('settings').doc('nc_'+id).set({kind:'numberCity',kid:id,updated:p.updated||Date.now(),p:JSON.parse(JSON.stringify(p))}).catch(e=>console.warn('save failed',e));}
function onRemoteKid(id,d){const p=DB.kids[id];
  if(!d.exists){if(p&&p.updated)pushKid(id);return;}
  const r=d.data()||{},ru=r.updated||0,lu=(p&&p.updated)||0;
  if(ru>lu){
    if(R&&!R.ended&&CUR===id)return;           // she is mid-round here: this tablet's copy will be newer
    DB.kids[id]=Object.assign(newProf(),r.p||{},{updated:ru});saveLocal();
    if($('.kids'))showProfiles();else if(CUR===id&&!R&&$('.home'))showHome();
  }else if(lu>ru)pushKid(id);
}
function familyPanel(){const key=famKey();
  return `<div class="panel"><h3>Family link</h3><p>${FAM?`Linked with family code <strong>${prettyKey(key)}</strong>. Progress is saved online and shared between the tablets.`:'Not linked yet. Progress is saved on this tablet only.'}</p>
  <div class="row"><input id="fam" class="code" maxlength="14" autocomplete="off" placeholder="Family code" aria-label="Family code"><button class="btn quiet" onclick="linkFam()">Link</button></div>
  <p class="soft" id="fammsg">Use the same 12-letter family code as Beit al-Huruf. A tablet already linked there links here by itself.</p></div>`;}
function linkFam(){const v=($('#fam').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(v.length!==12){$('#fammsg').textContent='The family code has 12 letters and numbers.';return;}
  try{localStorage.setItem('nc_family',JSON.stringify(v));}catch(e){}location.reload();}
/* ---------- adaptive engine ---------- */
function record(p,s,ok){const k=st(p,s.id);k.h.push(ok?1:0);if(k.h.length>8)k.h.shift();k.n++;k.t=Date.now();k.miss=ok?0:k.miss+1;
  if(!k.m&&k.h.length>=6&&k.h.filter(x=>!x).length<=1){k.m=true;if(!k.g){k.g=true;return true;}}
  else if(k.m&&k.h.slice(-4).filter(x=>!x).length>=2){k.m=false;k.h=k.h.slice(-4);}
  return false;}
function leastRecent(p,arr){return pick(arr.slice().sort((a,b)=>st(p,a.id).t-st(p,b.id).t).slice(0,3));}
function chooseSkill(p,R){
  const open=SK.filter(s=>!st(p,s.id).m),done=SK.filter(s=>st(p,s.id).m);
  if(!open.length)return leastRecent(p,done);
  if(R.missRun>=3){R.missRun=0;return done.length?leastRecent(p,done):open[0];}
  const r=Math.random();
  if(r<.2&&done.length)return leastRecent(p,done);
  if(r<.3&&open[2])return open[2];
  return open[1]&&Math.random()<.35?open[1]:open[0];
}
function applyPlacement(p){const best=R.place.best;for(let i=0;i<best;i++){const k=st(p,SK[i].id);k.h=[1,1,1,1,1,1];k.m=true;k.g=true;}p.placed=true;R.place=null;}

/* ---------- a round of 10 questions ---------- */
function startRound(){const p=P();ac();R={i:0,total:10,stars:0,missRun:0,golds:[],t0:Date.now(),place:p.placed?null:{p:0,best:-1,miss:0},ended:false};nextQ();}
function nextQ(){if(!R||R.ended)return;if(R.i>=R.total)return endRound();const p=P();
  const s=R.place?SK[Math.min(R.place.p,SK.length-1)]:chooseSkill(p,R);const k=st(p,s.id);
  const easy=k.miss>=2,prog=k.m?1:Math.min(1,k.h.filter(Boolean).length/6);
  let q;try{q=s.gen(easy,easy||prog<.5,s.i<12?3:4);q.skill=s;}catch(e){q=SK[0].gen(false,true,3);q.skill=SK[0];}
  Object.assign(R,{q,tries:0,wrong:new Set(),locked:false,paid:[],hint:false});renderQ(false);}
function renderQ(hint){const q=R.q;R.hint=hint;
  app(`<section class="screen round"><div class="q-top"><button class="btn quiet" onclick="stopRound()">Stop</button><div class="dots" aria-label="Question ${R.i+1} of ${R.total}">${[...Array(R.total)].map((_,i)=>`<i class="${i<R.i?'done':i===R.i?'now':''}"></i>`).join('')}</div><div class="starcount" aria-label="Stars this round">★ <b id="sc">${R.stars}</b></div></div>
  <div class="prompt"><button class="say" onclick="sayQ()" aria-label="Hear it again">${SPK}</button><span>${q.text}</span></div>
  <div class="stage" id="stage"></div><div class="choices" id="chs"></div></section>`);
  const stg=$('#stage'),chs=$('#chs');
  if(q.interactive){stg.innerHTML=shopHTML(hint);chs.hidden=true;}
  else{stg.innerHTML=q.show(hint);
    const html=q.choices.map((c,i)=>`<button class="ch${c.txt?' txt':''}${c.html?' pic':''}${c.big?' jumbo':''}${R.wrong.has(i)?' wrong':''}" data-i="${i}" onclick="pickC(this)">${c.html?(hint&&c.hhtml?c.hhtml:c.html):c.v}</button>`).join('');
    if(q.inStage){stg.insertAdjacentHTML('beforeend',`<div class="choices">${html}</div>`);chs.hidden=true;}else chs.innerHTML=html;}
  if(!hint){if(q.flash)speak(q.say||q.text,()=>coverLater(q,q.flash));else speak(q.say||q.text);}
}
function coverLater(q,ms){if(!R)return;clearTimeout(R.coverT);R.coverT=setTimeout(()=>{if(R&&R.q===q&&!R.hint&&!R.locked){const s2=$('#stage');if(s2&&!s2.querySelector('.cover'))s2.insertAdjacentHTML('beforeend','<button class="cover" onclick="peek()">How many dots did you see?<small>Tap here to look again</small></button>');}},ms);}
function peek(){const c=$('.cover');if(c)c.remove();if(R&&R.q&&!R.locked)coverLater(R.q,2500);}
function sayQ(){if(R&&R.q)speak(R.q.say||R.q.text);}
function pickC(btn){if(!R||R.locked)return;const i=+btn.dataset.i,c=R.q.choices[i];if(c.v===R.q.answer)handle(true,btn);else{R.wrong.add(i);handle(false,btn);}}
function handle(ok,btn){const q=R.q;
  if(ok){R.locked=true;if(btn)btn.classList.add('right');SFX.right();speak(pick(['Yes!','Well done!','Brilliant!','You got it!','Super!']));finishQ(true,R.tries===0);return;}
  R.tries++;SFX.again();
  if(R.tries===1){if(btn)btn.classList.add('wrong');speak(pick(['Try again!','Almost! Have another go.','Look again!']));setTimeout(()=>{if(R&&R.q===q&&!R.ended)renderQ(true);},450);}
  else{R.locked=true;if(q.interactive)R.paid=greedy(q.answer);renderQ(true);
    const i=q.choices?q.choices.findIndex(c=>c.v===q.answer):-1,b=document.querySelector(`.ch[data-i="${i}"]`);if(b)b.classList.add('show');
    speak(`It's ${q.answerSay||q.answer}.`);setTimeout(()=>finishQ(false,false),2400);}
}
function finishQ(correct,first){if(!R||R.ended)return;const p=P(),s=R.q.skill;
  if(R.place){const pl=R.place;if(first){pl.best=Math.max(pl.best,pl.p);pl.p+=3;}else{pl.miss++;pl.p=pl.best+1;}if(pl.miss>=2||pl.p>=SK.length||R.i>=R.total-1)applyPlacement(p);}
  else{if(record(p,s,first))R.golds.push(s);R.missRun=first?0:R.missRun+1;}
  if(correct){R.stars++;p.stars++;const sc=$('#sc');if(sc){sc.textContent=R.stars;const w=sc.parentNode;w.classList.remove('bump');void w.offsetWidth;w.classList.add('bump');}}
  R.i++;save();const q=R.q;setTimeout(()=>{if(R&&R.q===q)nextQ();},correct?1000:200);
}
function stopRound(){if(!R)return;if(R.i===0){R.ended=true;hush();return showHome();}R.total=R.i;endRound();}

/* corner shop: tap money, then pay */
function shopHTML(h){const s=R.q.shop,paid=R.paid||[],sum=paid.reduce((a,b)=>a+b,0);
  return `<div class="shop"><div class="row" style="justify-content:center"><span class="item" aria-hidden="true">${s.e}</span><span class="tag">${s.p} dirhams</span></div>
  <div class="paid">${paid.length?paid.map(moneyOne).join(''):'<span class="soft">Tap the money to pay</span>'}</div>
  ${h?`<p class="hintline">You have put ${sum} dirhams. You need ${s.p}.</p>`:''}
  <div class="tray"><button class="money-btn" onclick="addPay(1)" aria-label="1 dirham">${moneyOne(1)}</button><button class="money-btn" onclick="addPay(5)" aria-label="5 dirhams">${moneyOne(5)}</button>${s.p>=10?`<button class="money-btn" onclick="addPay(10)" aria-label="10 dirhams">${moneyOne(10)}</button>`:''}</div>
  <div class="row" style="justify-content:center"><button class="btn quiet" onclick="clearPay()">Start again</button><button class="btn gold" onclick="doPay()"${paid.length?'':' disabled'}>Pay</button></div></div>`;}
function addPay(v){if(!R||R.locked)return;R.paid=R.paid.concat(v);tone(v===1?720:520,.12);$('#stage').innerHTML=shopHTML(R.hint);}
function clearPay(){if(!R||R.locked)return;R.paid=[];$('#stage').innerHTML=shopHTML(R.hint);}
function doPay(){if(!R||R.locked)return;handle(R.paid.reduce((a,b)=>a+b,0)===R.q.answer,null);}
function greedy(p){const a=[];while(p>=10){a.push(10);p-=10;}while(p>=5){a.push(5);p-=5;}while(p>0){a.push(1);p--;}return a;}

/* ---------- end of round: stars, cards, gold cards ---------- */
function endRound(){const p=P(),k=K();R.ended=true;hush();
  if(R.place){if(R.i>=4)applyPlacement(p);R.place=null;}
  p.rounds++;p.secs+=Math.round((Date.now()-R.t0)/1000);
  Q=[];while(p.stars>=need(p.cards)){p.cards++;const it=awardCard(p);if(it)Q.push(it);}
  R.golds.forEach(s=>{const gi=p.gold.length;p.gold.push(gi);Q.push({type:'gold',gi,skill:s.name});});
  save();
  const n=Q.length;
  app(`<section class="screen center"><span class="avbig" style="background:${k.soft}">${avatar(k)}</span><h1>Well done, ${k.name}!</h1><div class="earned">★ ${R.stars}</div><p class="soft" style="font-size:22px">${R.stars} star${R.stars===1?'':'s'} this round</p>
  ${n?`<button class="btn huge gold" onclick="nextReveal()">Open ${n>1?`your ${n} cards`:'your card'}</button>`:`<p style="font-size:20px">${need(p.cards)-p.stars} more ★ for your next card</p><div class="row" style="justify-content:center"><button class="btn" onclick="startRound()">Play again</button><button class="btn quiet" onclick="showHome()">Home</button></div>`}</section>`);
  SFX.card();speak(n?`Well done! You got ${R.stars} stars, and ${n>1?n+' new cards':'a new card'}!`:`Well done! You got ${R.stars} stars.`);
}
function nextReveal(){const it=Q.shift();if(!it)return afterReveals();const k=K();confetti(14);SFX.card();
  if(it.type==='gold'){app(`<section class="screen center"><div class="label">Gold card</div>${goldHTML(it)}<button class="btn huge gold" onclick="nextReveal()">Next</button></section>`);speak(`A gold card! You learned ${it.skill}.`);return;}
  app(`<section class="screen center"><div class="label">New card</div><div class="reveal">${cardHTML(it,k)}${it.set!=='house'?sceneHTML(it.set,it.idx+1,true,k):''}</div><button class="btn huge gold" onclick="${it.done?`showDone('${it.set}')`:'nextReveal()'}">${it.done?'Finish it!':'Next'}</button></section>`);
  speak(`A new card: ${pieceName(it.set,it.idx,k)}!`);
}
function showDone(set){const k=K();SFX.big();confetti(40);
  app(`<section class="screen center"><h1>You built ${SETS[set].name}!</h1><div style="width:min(680px,100%)">${sceneHTML(set,SETS[set].size,false,k)}</div><button class="btn huge gold" onclick="nextReveal()">Next</button></section>`);
  speak(`Amazing! You built ${SETS[set].name}!`);}
function afterReveals(){const p=P();if(!p.set&&p.done.length<SET_ORDER.length)showPick();else showHome();}
function showPick(){const p=P();const left=SET_ORDER.filter(s=>!p.done.includes(s)&&s!==p.set);
  if(!left.length)return showCity();
  app(`<section class="screen center"><h1>What do you want to build next?</h1><div class="picks">${left.map(s=>{const S=SETS[s];return `<button class="pick" style="--c:${S.color}" onclick="choosePick('${s}')"><span class="ic" aria-hidden="true">${S.icon}</span><b>${S.name}</b><small class="soft">${S.size} cards</small></button>`;}).join('')}</div><button class="btn quiet" onclick="showHome()">Later</button></section>`);
  speak('What do you want to build next?');}
function choosePick(s){const p=P();p.set=s;Q=[];while(p.pending>0&&p.set){p.pending--;const it=awardCard(p);if(it)Q.push(it);}save();if(Q.length)nextReveal();else showHome();}

/* ---------- screens ---------- */
function showProfiles(){CUR=null;R=null;theme(null);hush();
  app(`<section class="screen center"><div class="brand"><h1>Number <span>City</span></h1><p class="sub">Who's playing?</p></div>
  <div class="kids">${KIDS.map(k=>{const p=prof(k.id);return `<button class="kid" style="--c:${k.color}" onclick="choose('${k.id}')"><span class="avbig" style="background:${k.soft}">${avatar(k)}</span><span class="nm">${k.name}</span><small>${p.set?SETS[p.set].name:'Picking a building'} · ${totalCards(p)} cards</small></button>`;}).join('')}</div>
  <button class="btn quiet" onclick="showGate()">Grown-ups</button></section>`);}
function choose(id){CUR=id;theme(K());ac();showHome();}
function topBar(k,p){const base=p.cards===0?0:need(p.cards-1),span=need(p.cards)-base,have=Math.max(0,p.stars-base);
  return `<div class="top"><button class="mini-av" onclick="showProfiles()" aria-label="Switch player">${avatar(k)}</button><span class="who">${k.name}</span><div class="bar" role="img" aria-label="${have} of ${span} stars to the next card"><i style="width:${Math.min(100,have/span*100).toFixed(0)}%"></i><b>★ ${have} / ${span}</b></div></div>`;}
function backBar(title){return `<div class="top"><button class="btn quiet" onclick="showHome()">Back</button><h2>${title}</h2></div>`;}
function showHome(){const k=K(),p=P();R=null;hush();const set=p.set,g=set?(p.got[set]||0):0;
  app(`<section class="screen">${topBar(k,p)}<div class="home">
  <div class="panel">${set?`<div class="label">Now building</div><h2>${SETS[set].name}</h2>${sceneHTML(set,g,false,k)}<p class="soft">${g} of ${SETS[set].size} cards</p>`
   :`<div class="label">Building done</div><h2>${p.done.length>=SET_ORDER.length?'You built your whole city!':'Pick what to build next'}</h2>${p.done.length<SET_ORDER.length?'<button class="btn gold" onclick="showPick()">Choose</button>':''}`}</div>
  <div class="side"><button class="btn huge" onclick="startRound()">Play</button><p class="soft">${need(p.cards)-p.stars} more ★ for your next card</p><button class="btn quiet" onclick="showAlbum()">My cards</button><button class="btn quiet" onclick="showCity()">My city</button></div>
  </div></section>`);}
function showAlbum(){const p=P(),k=K();let h=`<section class="screen">${backBar('My cards')}`;
  orderSets(p).forEach(s=>{const S=SETS[s],g=p.got[s]||0;h+=`<div class="panel"><div class="row"><h3>${S.name}</h3><span class="spacer"></span><span class="soft">${g} / ${S.size}</span></div><div class="album">`;
    for(let i=0;i<S.size;i++)h+=i<g?`<div class="slot" style="--c:${S.color}"><span class="ic">${pieceIcon(s,i,k,false)}</span><span>${pieceName(s,i,k)}</span></div>`:'<div class="slot locked">?</div>';h+='</div></div>';});
  h+=`<div class="panel"><div class="row"><h3>Gold cards</h3><span class="spacer"></span><span class="soft">${p.gold.length}</span></div>${p.gold.length?`<div class="album">${p.gold.map(i=>{const g=GOLD[i%GOLD.length];return `<div class="slot goldslot"><span class="ic">${g[0]}</span><span>${g[1]}</span></div>`;}).join('')}</div>`:'<p class="soft">Learn a new skill to win a gold card.</p>'}</div></section>`;
  app(h);}
function showCity(){const p=P(),k=K();
  app(`<section class="screen">${backBar(`${k.name}'s city`)}<div class="city">${orderSets(p).map(s=>{const g=p.got[s]||0,S=SETS[s];return `<div class="plot"><div class="cap">${S.name}${p.done.includes(s)?' ✓':''}</div>${g||p.set===s?sceneHTML(s,g,false,k):'<div class="empty">?</div>'}</div>`;}).join('')}
  <div class="decos">${p.gold.length?p.gold.map(i=>`<span title="${GOLD[i%GOLD.length][1]}">${GOLD[i%GOLD.length][0]}</span>`).join(''):'<span class="soft" style="font-size:17px">Gold cards will live here.</span>'}</div></div></section>`);}

/* ---------- grown-ups ---------- */
function showGate(){const a=rnd(6,9),b=rnd(4,9);G=a*b;
  app(`<section class="screen center gate"><h2>Grown-ups only</h2><p style="font-size:22px">What is ${a} × ${b}?</p><input id="gate" inputmode="numeric" autocomplete="off" aria-label="Answer" onkeydown="if(event.key==='Enter')checkGate()"><div class="row" style="justify-content:center"><button class="btn" onclick="checkGate()">Enter</button><button class="btn quiet" onclick="showProfiles()">Back</button></div><p id="gmsg" class="soft"></p></section>`);}
function checkGate(){if(+$('#gate').value===G)showParent(KIDS[0].id);else $('#gmsg').textContent='That answer is not right. Try again.';}
function showParent(id,msg){const k=KIDS.find(x=>x.id===id),p=prof(id);theme(k);
  const open=SK.filter(s=>!st(p,s.id).m),now=open.slice(0,2).map(s=>s.id),strands=[...new Set(SK.map(s=>s.strand))];
  app(`<section class="screen"><div class="top"><button class="btn quiet" onclick="showProfiles()">Done</button><h2>Grown-ups</h2></div>
  <div class="tabs">${KIDS.map(x=>`<button class="tab" style="--c:${x.color}" aria-pressed="${x.id===id}" onclick="showParent('${x.id}')">${x.name}</button>`).join('')}</div>
  <div class="panel"><div class="stats">${[['Stars',p.stars],['Cards',totalCards(p)],['Gold cards',p.gold.length],['Rounds',p.rounds],['Minutes',Math.round(p.secs/60)]].map(([a,b])=>`<div class="stat"><b>${b}</b>${a}</div>`).join('')}</div>
  <p><strong>Building:</strong> ${p.set?SETS[p.set].name:'not chosen yet'}${p.done.length?` · Finished: ${p.done.map(s=>SETS[s].name).join(', ')}`:''}</p>
  <p><strong>Learning now:</strong> ${p.placed?(open.slice(0,2).map(s=>s.name).join(' and ')||'everything is mastered'):'her first round is a warm-up that finds her level.'}</p></div>
  <div class="panel"><div class="row"><h3>Skill map</h3><span class="spacer"></span><span class="legend"><i class="chip m">Mastered</i><i class="chip l">Practising</i><i class="chip">Not yet</i></span></div>
  ${strands.map(sn=>`<div class="strand"><div class="label">${sn}</div><div class="chips">${SK.filter(s=>s.strand===sn).map(s=>{const x=st(p,s.id),c=x.m?'m':(now.includes(s.id)||x.h.length)?'l':'';return `<span class="chip ${c}">${s.name}${!x.m&&x.h.length?` · ${x.h.filter(Boolean).length}/${x.h.length}`:''}</span>`;}).join('')}</div></div>`).join('')}</div>
  <div class="panel"><h3>Change her level</h3><p class="soft">Skills before the one you pick count as known. They still come back for review and return to practice if she misses them.</p>
  <div class="row"><select id="lvl" aria-label="Start from skill">${SK.map(s=>`<option value="${s.i}"${s.i===(open[0]?open[0].i:SK.length-1)?' selected':''}>${s.i+1}. ${s.name}</option>`).join('')}</select><button class="btn quiet" onclick="setLevel('${id}')">Apply</button></div>${msg?`<p style="color:var(--good);font-weight:700">${msg}</p>`:''}</div>
  ${window.FIREBASE_CONFIG?familyPanel():''}
  <div class="panel"><div class="row"><button class="btn quiet" onclick="toggleVoice('${id}')">Spoken instructions: ${DB.voice?'on':'off'}</button><span class="spacer"></span><button class="btn quiet danger" onclick="resetKid('${id}',this)">Reset ${k.name}'s progress</button></div></div></section>`);}
function setLevel(id){const idx=+$('#lvl').value,p=prof(id);SK.forEach(s=>{const k=st(p,s.id);if(s.i<idx){k.h=[1,1,1,1,1,1];k.m=true;k.g=true;}else{k.h=[];k.m=false;k.miss=0;}});p.placed=true;touch(id);showParent(id,`Saved. She now practises ${SK[idx].name}.`);}
function toggleVoice(id){DB.voice=!DB.voice;saveLocal();showParent(id);}
function resetKid(id,btn){if(!btn.dataset.armed){btn.dataset.armed='1';btn.textContent='Tap again to reset';return;}DB.kids[id]=newProf();touch(id);showParent(id,'Progress reset.');}

load();showProfiles();if(typeof cloudInit==='function')cloudInit();
try{if('serviceWorker' in navigator&&location.protocol==='https:'&&window.FIREBASE_CONFIG)navigator.serviceWorker.register('sw.js').catch(()=>{});}catch(e){}
