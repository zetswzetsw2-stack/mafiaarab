import { DurableObject } from "cloudflare:workers";
const HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#101522"><title>مافيا العرب</title>
<style>
:root{--bg:#0d1220;--card:#171f31;--line:#303d56;--gold:#e8bd70;--muted:#aab6cc;--red:#ef6262;--green:#4fd1a1;--blue:#7db7ff}
*{box-sizing:border-box}
body{margin:0;background:radial-gradient(ellipse at top,#202a40 0,#0d1220 65%);color:#f4f6fc;font-family:Arial,sans-serif;min-height:100vh}
main{max-width:720px;margin:auto;padding:16px 14px 30px}
h1{text-align:center;color:var(--gold);margin:10px 0 4px;font-size:30px}
h2,h3{margin:0 0 12px}
p{line-height:1.6}
.subtitle{text-align:center;color:var(--muted);margin:0 0 18px}
.card{background:rgba(23,31,49,.96);border:1px solid var(--line);border-radius:17px;padding:15px;margin:12px 0;box-shadow:0 8px 24px #0002}
.section-title{display:flex;align-items:center;justify-content:space-between;gap:8px}
.pill{border:1px solid var(--line);border-radius:999px;padding:5px 10px;color:var(--muted);font-size:12px}
input,button{width:100%;padding:13px;border-radius:10px;margin:5px 0;font-size:16px}
input{background:#0d1423;color:white;border:1px solid #46536b;outline:none}
input:focus{border-color:var(--gold)}
button{background:linear-gradient(135deg,#f0cf8d,#c9974e);color:#171a22;border:0;font-weight:bold;cursor:pointer}
button:disabled{opacity:.45;cursor:not-allowed}
.secondary{background:#303c54;color:white}
.danger{background:#7d2d3a;color:white}
.green{background:#176c58;color:white}
.hidden{display:none!important}
.small{color:var(--muted);font-size:13px}
.item{background:#0d1423;border:1px solid #28344a;border-radius:11px;padding:10px;margin:7px 0;overflow-wrap:anywhere}
.players-list{max-height:260px;overflow:auto}
.player{display:flex;align-items:center;justify-content:space-between;gap:8px}
.player-name{min-width:0;overflow-wrap:anywhere}
.votes{color:var(--gold);font-weight:bold;white-space:nowrap}
.player button{width:auto;min-width:94px;padding:9px 11px;margin:0;font-size:14px}
.phase{font-weight:bold;font-size:18px;color:var(--gold)}
.timer{font-size:28px;font-weight:bold;color:var(--green);font-variant-numeric:tabular-nums}
.timer.warning{color:var(--red)}
#chat,#mafiaChat{height:210px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;padding:4px}
.chat-message{background:#0d1423;border:1px solid #28344a;border-radius:10px;padding:9px;overflow-wrap:anywhere}
.chat-message b{color:var(--gold)}
.private-box{border-color:#803746;background:#241721}
.private-box h3{color:#ff9b9b}
.system{color:var(--blue);font-size:13px}
.role-box{border:1px solid #947343;background:linear-gradient(135deg,#28251f,#171f31);text-align:center}
.role-name{font-size:24px;color:var(--gold);font-weight:bold;margin:8px}
.role-desc{color:var(--muted);line-height:1.7}
.action-list{display:grid;grid-template-columns:1fr;gap:6px}
.action-list button{margin:0}
.footer{text-align:center;color:#8895ac;font-size:13px;padding:20px 8px 8px}
.footer a{color:var(--gold);text-decoration:none;font-weight:bold}
.note{font-size:13px;color:var(--muted);line-height:1.7}
.topline{display:flex;align-items:center;justify-content:space-between;gap:12px}
.topline button{width:auto;padding:9px 12px;font-size:13px}
.notice{padding:10px;border-radius:10px;background:#0d1423;color:var(--muted);line-height:1.6}
.phase-night{color:#ff8d8d}
.phase-vote{color:#8dc4ff}
@media(min-width:560px){.twocol{display:grid;grid-template-columns:1fr 1fr;gap:12px}.twocol .card{margin:6px 0}}
</style></head><body><main>
<h1>🎭 مافيا العرب</h1><p class="subtitle">فكّر جيداً… فليس كل من يتكلم بريئاً</p>
<div class="card" id="status">أهلاً بك! أنشئ غرفة أو انضم إلى أصدقائك.</div>
<section id="home">
<div class="twocol">
<div class="card"><h3>إنشاء غرفة</h3><input id="createName" maxlength="24" placeholder="اكتب اسمك داخل اللعبة"><button onclick="createRoom(false)">غرفة خاصة للأصدقاء</button><button onclick="createRoom(true)">إنشاء غرفة عامة</button></div>
<div class="card"><h3>الانضمام إلى غرفة</h3><input id="joinName" maxlength="24" placeholder="اسمك داخل اللعبة"><input id="joinCode" maxlength="6" placeholder="رمز الغرفة"><button onclick="joinRoom()">انضمام</button></div>
</div>
<div class="card"><div class="section-title"><h3>الغرف العامة</h3><button class="secondary" style="width:auto" onclick="loadRooms()">تحديث</button></div><div id="rooms"></div></div>
</section>
<section id="lobby" class="hidden">
<div class="card">
<div class="topline"><h3>غرفة <span id="codeText"></span></h3><button class="secondary" onclick="copyCode()">نسخ الرمز</button></div>
<p class="small">اللاعبون: <b id="count">0/13</b></p>
<div id="players" class="players-list"></div><p id="waiting" class="note"></p>
<button id="startBtn" onclick="startGame()" class="green hidden">بدء اللعبة</button>
<button id="roleBtn" onclick="showMyRole()" class="hidden">👁️ رؤية دوري</button>
<div id="roleBox" class="card role-box hidden"></div>
</div>
<div class="card"><div class="section-title"><h3>💬 المحادثة العامة</h3><span class="pill">للأحياء فقط أثناء اللعب</span></div><div id="chat"></div><input id="chatInput" maxlength="300" placeholder="اكتب رسالة"><button onclick="sendChat()">إرسال</button></div>
<div id="mafiaCard" class="card private-box hidden"><div class="section-title"><h3>🔴 محادثة المافيا السرية</h3><span class="pill">سرية</span></div><p class="small">هذه المحادثة لا تظهر إلا لأعضاء المافيا الأحياء.</p><div id="mafiaChat"></div><input id="mafiaInput" maxlength="300" placeholder="رسالة سرية للمافيا"><button class="danger" onclick="sendMafiaChat()">إرسال سري</button></div>
<div id="gameCard" class="card hidden">
<div class="topline"><div><div id="phaseName" class="phase">بانتظار بدء اللعبة</div><div id="phaseHint" class="small"></div></div><div id="timer" class="timer">--</div></div>
<div id="gameNotice" class="notice" style="margin:12px 0"></div><div id="actions" class="action-list"></div><div id="voteList" class="players-list"></div>
</div>
<div class="card"><button class="secondary" onclick="leaveRoom()">مغادرة الغرفة</button></div>
</section>
<footer class="footer">تم تصميم هذه اللعبة بواسطة <b>زيتسو</b><br><a href="https://t.me/ZETSW" target="_blank" rel="noopener">للتواصل عبر تيليجرام</a></footer>
</main><script>
let current=null,socket=null,lastRoom=null,myRoleVisible=false,shownMessages=new Set(),shownMafiaMessages=new Set(),timerInterval=null;
const el=id=>document.getElementById(id);
function status(t){el('status').textContent=t}
async function api(path,data){const r=await fetch(path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});const j=await r.json();if(!r.ok)throw new Error(j.error||'حدث خطأ');return j}
async function createRoom(isPublic){const name=el('createName').value.trim();if(!name)return status('اكتب اسمك أولاً.');try{enter(await api('/api/create',{name,isPublic}))}catch(e){status(e.message)}}
async function joinRoom(){const name=el('joinName').value.trim(),code=el('joinCode').value.trim().toUpperCase();if(!name||!code)return status('اكتب اسمك ورمز الغرفة.');try{enter(await api('/api/join',{name,code}))}catch(e){status(e.message)}}
async function loadRooms(){try{const r=await api('/api/rooms');el('rooms').replaceChildren();if(!r.rooms.length){el('rooms').textContent='لا توجد غرف عامة متاحة.';return}r.rooms.forEach(room=>{const d=document.createElement('div');d.className='item';const label=document.createElement('div');label.textContent=room.code+' — '+room.count+'/13 لاعبين';const b=document.createElement('button');b.textContent='انضمام';b.onclick=()=>{el('joinCode').value=room.code;el('joinName').value=el('createName').value||el('joinName').value;joinRoom()};d.append(label,b);el('rooms').append(d)})}catch(e){status(e.message)}}
function enter(data){current={code:data.code,token:data.token};lastRoom=null;myRoleVisible=false;shownMessages.clear();shownMafiaMessages.clear();el('home').classList.add('hidden');el('lobby').classList.remove('hidden');el('codeText').textContent=data.code;el('players').textContent='جارٍ الاتصال...';el('chat').replaceChildren();el('mafiaChat').replaceChildren();connect()}
function connect(){const scheme=location.protocol==='https:'?'wss:':'ws:';socket=new WebSocket(scheme+'//'+location.host+'/ws?code='+encodeURIComponent(current.code)+'&token='+encodeURIComponent(current.token));socket.onopen=()=>status('اتصلت بالغرفة بنجاح.');socket.onmessage=e=>{let d;try{d=JSON.parse(e.data)}catch{return}if(d.type==='error')return status(d.message);if(d.type==='state')renderState(d.room);if(d.type==='chat')showChat(d.message,false);if(d.type==='mafiaChat')showChat(d.message,true);if(d.type==='notice')status(d.message);if(d.type==='privateResult'){status(d.result==='mafia'?'نتيجة التحقيق سرّاً: هذا اللاعب من المافيا. حاول إقناع الآخرين دون كشف النتيجة مباشرة.':'نتيجة التحقيق سرّاً: هذا اللاعب ليس من المافيا.');}};socket.onclose=()=>{if(current)status('انقطع الاتصال. أعد فتح الصفحة وحاول الدخول مجدداً.');};socket.onerror=()=>status('تعذر الاتصال بالخادم.')}
function renderState(room){
 lastRoom=room;
 el('count').textContent=room.players.length+'/13';
 el('players').replaceChildren();
 room.players.forEach(p=>{
  const d=document.createElement('div');
  d.className='item player';
  const n=document.createElement('span');
  n.className='player-name';
  n.textContent=(p.connected?'🟢 ':'⚪ ')+p.name+(p.id===room.hostId?' — صاحب الغرفة':'')+(p.alive===false?' — خارج اللعبة':'');
  d.append(n);
  el('players').append(d);
 });
 const me=room.me||{};
 const isHost=me.id===room.hostId;
 el('startBtn').classList.toggle('hidden',!isHost||room.phase!=='lobby'||room.players.length<5);
 el('waiting').textContent=room.phase==='lobby'?
  (room.players.length<5?'تحتاج إلى '+(5-room.players.length)+' لاعبين إضافيين لبدء اللعبة. يمكنك البدء من 5 إلى 13 لاعباً.':'الغرفة جاهزة. صاحب الغرفة يستطيع بدء اللعبة الآن.'):'';
 el('roleBtn').classList.toggle('hidden',!room.started||!me.role);
 el('gameCard').classList.toggle('hidden',!room.started);
 el('mafiaCard').classList.toggle('hidden',!me.isMafia||me.alive===false);
 if(room.started){
  el('phaseName').textContent=phaseLabel(room.phase);
  el('phaseName').className='phase '+(room.phase==='night'?'phase-night':room.phase==='vote'?'phase-vote':'');
  el('phaseHint').textContent=room.phaseHint||'';
  el('gameNotice').textContent=room.notice||'تابع مجريات اللعبة.';
  const remaining=Math.max(0,Math.ceil((room.deadline-Date.now())/1000));
  el('timer').textContent=remaining+' ث';
  el('timer').classList.toggle('warning',remaining<=10);
  renderActions(room,me);
 }else{
  el('timer').textContent='--';
  el('actions').replaceChildren();
  el('voteList').replaceChildren();
 }
 el('chatInput').disabled=room.started&&me.alive===false;
 el('chatInput').placeholder=room.started&&me.alive===false?'أنت خارج اللعبة ويمكنك المشاهدة فقط':'اكتب رسالة';
}
function phaseLabel(p){
 return ({lobby:'الردهة',night:'🌙 الليل',vote:'🗳️ التصويت',defense:'🛡️ الدفاع',ended:'🏆 انتهت اللعبة'})[p]||p;
}
function renderActions(room,me){
 const actions=el('actions');
 actions.replaceChildren();
 el('voteList').replaceChildren();
 if(room.phase==='ended'){
  el('gameNotice').textContent=room.notice||'انتهت اللعبة.';
  if(room.result){
   const d=document.createElement('div');d.className='item';
   d.textContent='الفائز: '+room.result;
   actions.append(d);
  }
  return;
 }
 if(me.alive===false){
  const d=document.createElement('div');d.className='notice';
  d.textContent='أنت خارج اللعبة. يمكنك متابعة الأحداث فقط.';
  actions.append(d);return;
 }
 if(room.phase==='night'){
  if(me.role==='mafia'){
   const h=document.createElement('p');h.className='small';h.textContent='اختاروا ضحية بالاتفاق عبر المحادثة السرية.';
   actions.append(h);
   room.players.filter(p=>p.alive!==false&&p.role!=='mafia').forEach(p=>addAction(actions,'اغتيال '+p.name,()=>sendAction('kill',p.id),'danger'));
  }else if(me.role==='doctor'){
   const h=document.createElement('p');h.className='small';h.textContent='اختر لاعباً لحمايته هذه الليلة.';
   actions.append(h);
   room.players.filter(p=>p.alive!==false).forEach(p=>addAction(actions,'حماية '+p.name,()=>sendAction('protect',p.id),'green'));
  }else if(me.role==='detective'){
   const h=document.createElement('p');h.className='small';h.textContent='اختر لاعباً للتحقق من دوره. النتيجة تظهر لك وحدك.';
   actions.append(h);
   room.players.filter(p=>p.alive!==false&&p.id!==me.id).forEach(p=>addAction(actions,'تحقيق مع '+p.name,()=>sendAction('investigate',p.id),'secondary'));
  }else{
   const d=document.createElement('div');d.className='notice';d.textContent='المافيا تختار ضحيتها، والطبيب والمحقق يقومان بدورهما.';
   actions.append(d);
  }
 }
 if(room.phase==='vote'||room.phase==='defense'){
  const h=document.createElement('p');h.className='small';
  h.textContent=room.phase==='vote'?'صوّت للاعب الذي تشك به. يمكنك تغيير صوتك حتى انتهاء المرحلة.':'مرحلة الدفاع: استمع للتبرير ويمكنك تغيير صوتك.';
  actions.append(h);
  room.players.filter(p=>p.alive!==false).forEach(p=>{
   const d=document.createElement('div');d.className='item player';
   const label=document.createElement('span');label.className='player-name';
   label.textContent=p.name+' — الأصوات: '+(p.voteCount||0);
   const b=document.createElement('button');
   b.textContent=p.id===me.voteTarget?'صوتك الحالي':'صوّت';
   b.className=p.id===me.voteTarget?'green':'secondary';
   b.disabled=p.id===me.id||room.phase==='defense'&&room.defenseLocked===true;
   b.onclick=()=>sendAction('vote',p.id);
   d.append(label,b);el('voteList').append(d);
  });
 }
}
function addAction(parent,label,callback,cls){
 const b=document.createElement('button');b.textContent=label;
 b.className=cls||'';b.onclick=callback;parent.append(b);
}
function sendAction(action,targetId){
 if(!socket||socket.readyState!==WebSocket.OPEN)return status('الاتصال غير جاهز.');
 socket.send(JSON.stringify({type:'action',action,targetId}));
}
function showMyRole(){
 if(!lastRoom||!lastRoom.me||!lastRoom.me.role)return status('لم يتم توزيع الأدوار بعد.');
 const me=lastRoom.me;
 el('roleBox').classList.remove('hidden');
 el('roleBox').textContent='دورك: '+roleLabel(me.role)+' — '+roleDescription(me.role);
}
function roleLabel(role){
 return ({mafia:'🔴 المافيا',doctor:'🩺 الطبيب',detective:'🔎 المحقق',civilian:'👤 مدني'})[role]||'غير معروف';
}
function roleDescription(role){
 return ({mafia:'تعاون سراً مع المافيا وحاول إقصاء المدنيين.',doctor:'اختر لاعباً لحمايته كل ليلة.',detective:'تحقق من لاعب كل ليلة وحاول إقناع الآخرين بما تكتشفه.',civilian:'ناقش اللاعبين وصوّت لاكتشاف المافيا.'})[role]||'';
}
function showChat(m,isMafia){
 const box=el(isMafia?'mafiaChat':'chat');
 const seen=isMafia?shownMafiaMessages:shownMessages;
 const key=m.id||((m.time||'')+':'+m.name+':'+m.text);
 if(seen.has(key))return;
 seen.add(key);
 const d=document.createElement('div');d.className='chat-message';
 const b=document.createElement('b');b.textContent=m.name+': ';
 const t=document.createElement('span');t.textContent=m.text;
 d.append(b,t);box.append(d);box.scrollTop=box.scrollHeight;
}
function sendChat(){
 const text=el('chatInput').value.trim();
 if(!text||!socket||socket.readyState!==WebSocket.OPEN)return;
 socket.send(JSON.stringify({type:'chat',text}));el('chatInput').value='';
}
function sendMafiaChat(){
 const text=el('mafiaInput').value.trim();
 if(!text||!socket||socket.readyState!==WebSocket.OPEN)return;
 socket.send(JSON.stringify({type:'mafiaChat',text}));el('mafiaInput').value='';
}
el('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});
el('mafiaInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMafiaChat()});
async function copyCode(){
 if(!current)return;
 try{await navigator.clipboard.writeText(current.code);status('تم نسخ رمز الغرفة.')}catch{status('رمز الغرفة: '+current.code)}
}
async function startGame(){
 if(!socket||socket.readyState!==WebSocket.OPEN)return status('الاتصال غير جاهز.');
 socket.send(JSON.stringify({type:'start'}));
}
async function leaveRoom(){
 if(!current)return;
 const old=current;current=null;
 if(socket){socket.close();socket=null}
 try{await api('/api/leave',{code:old.code,token:old.token})}catch{}
 el('lobby').classList.add('hidden');el('home').classList.remove('hidden');
 el('roleBox').classList.add('hidden');status('رجعت إلى القائمة.');loadRooms();
}
loadRooms();
</script></body></html>`;
function json(data,status=200){
 return Response.json(data,{status});
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);

  if(url.pathname==="/"&&request.method==="GET"){
   return new Response(HTML,{
    headers:{"Content-Type":"text/html; charset=utf-8"}
   });
  }

  const id=env.GAME_HUB.idFromName("main-game-hub");
  return env.GAME_HUB.get(id).fetch(request);
 }
};

export class GameHub extends DurableObject {
 async readRoom(code){
  return this.ctx.storage.get("room:"+code);
 }

 async saveRoom(room){
  await this.ctx.storage.put("room:"+room.code,room);
  if(room.started&&room.phase!=="ended"){
   await this.ctx.storage.setAlarm(room.deadline);
  }else{
   await this.ctx.storage.deleteAlarm();
  }
 }

 safeRoom(room,player){
  const alive=room.players.filter(p=>p.alive!==false);
  return {
   code:room.code,
   hostId:room.hostId,
   isPublic:room.isPublic,
   started:room.started,
   phase:room.phase,
   phaseHint:room.phaseHint||"",
   deadline:room.deadline||0,
   notice:room.notice||"",
   result:room.result||"",
   defenseLocked:false,
   players:room.players.map(p=>({
    id:p.id,
    name:p.name,
    connected:p.connected,
    alive:p.alive!==false,
    voteCount:alive.filter(x=>x.voteTarget===p.id).length
   })),
   chat:room.chat,
   me:player?{
    id:player.id,
    role:player.role||null,
    alive:player.alive!==false,
    isMafia:player.role==="mafia"&&player.alive!==false,
    voteTarget:player.voteTarget||null
   }:null
  };
 }

 async fetch(request){
  const url=new URL(request.url);

  if(url.pathname==="/api/create"&&request.method==="POST")return this.createRoom(request);
  if(url.pathname==="/api/join"&&request.method==="POST")return this.joinRoom(request);
  if(url.pathname==="/api/rooms")return this.listRooms();
  if(url.pathname==="/api/leave"&&request.method==="POST")return this.leaveRoom(request);
  if(url.pathname==="/ws")return this.connect(request);

  return json({error:"المسار غير موجود"},404);
 }

 async createRoom(request){
  let data;
  try{data=await request.json()}catch{return json({error:"البيانات غير صحيحة"},400)}

  const name=String(data.name||"").trim().slice(0,24);
  if(!name)return json({error:"اكتب اسم اللاعب"},400);

  let code;
  do{
   code=crypto.randomUUID().replace(/-/g,"").slice(0,6).toUpperCase();
  }while(await this.readRoom(code));

  const player={
   id:crypto.randomUUID(),
   token:crypto.randomUUID(),
   name,
   connected:false,
   alive:true
  };

  const room={
   code,
   hostId:player.id,
   isPublic:data.isPublic===true,
   players:[player],
   chat:[],
   mafiaChat:[],
   started:false,
   phase:"lobby",
   deadline:0,
   notice:"بانتظار اللاعبين.",
   result:"",
   killVotes:{},
   protectedId:null,
   investigated:{},
   votes:{}
  };

  await this.saveRoom(room);

  if(room.isPublic){
   const codes=await this.ctx.storage.get("publicCodes")||[];
   codes.push(code);
   await this.ctx.storage.put("publicCodes",[...new Set(codes)]);
  }

  return json({code,token:player.token});
 }

 async joinRoom(request){
  let data;
  try{data=await request.json()}catch{return json({error:"البيانات غير صحيحة"},400)}

  const code=String(data.code||"").trim().toUpperCase();
  const name=String(data.name||"").trim().slice(0,24);
  const room=await this.readRoom(code);

  if(!name||!code)return json({error:"اكتب الاسم والرمز"},400);
  if(!room)return json({error:"الغرفة غير موجودة"},404);
  if(room.started)return json({error:"اللعبة بدأت بالفعل"},409);
  if(room.players.length>=13)return json({error:"الغرفة مكتملة (13 لاعباً)"},409);

  const player={
   id:crypto.randomUUID(),
   token:crypto.randomUUID(),
   name,
   connected:false,
   alive:true
  };

  room.players.push(player);
  await this.saveRoom(room);
  await this.broadcast(room);

  return json({code,token:player.token});
 }

 async listRooms(){
  const codes=await this.ctx.storage.get("publicCodes")||[];
  const rooms=[];

  for(const code of codes){
   const room=await this.readRoom(code);
   if(room&&room.isPublic&&!room.started&&room.players.length<13){
    rooms.push({code,count:room.players.length});
   }
  }

  return json({rooms});
 }

 async leaveRoom(request){
  let data;
  try{data=await request.json()}catch{return json({error:"البيانات غير صحيحة"},400)}

  const code=String(data.code||"").toUpperCase();
  const token=String(data.token||"");
  const room=await this.readRoom(code);
  if(!room)return json({ok:true});

  const player=room.players.find(p=>p.token===token);
  if(!player)return json({ok:true});

  if(room.started&&room.phase!=="ended"){
   player.connected=false;
   player.alive=false;
   await this.checkWin(room);
   await this.saveRoom(room);
   await this.broadcast(room);
   return json({ok:true});
  }

  room.players=room.players.filter(p=>p.token!==token);

  if(!room.players.length){
   await this.ctx.storage.delete("room:"+code);
   const codes=await this.ctx.storage.get("publicCodes")||[];
   await this.ctx.storage.put("publicCodes",codes.filter(c=>c!==code));
   return json({ok:true});
  }

  if(room.hostId===player.id)room.hostId=room.players[0].id;
  await this.saveRoom(room);
  await this.broadcast(room);
  return json({ok:true});
 }

 async connect(request){
  if(request.headers.get("Upgrade")!=="websocket")
   return json({error:"يلزم WebSocket"},426);

  const url=new URL(request.url);
  const code=(url.searchParams.get("code")||"").toUpperCase();
  const token=url.searchParams.get("token")||"";
  const room=await this.readRoom(code);

  if(!room)return json({error:"الغرفة غير موجودة"},404);
  const player=room.players.find(p=>p.token===token);
  if(!player)return json({error:"بيانات اللاعب غير صحيحة"},403);

  const pair=new WebSocketPair();
  const client=pair[0],server=pair[1];

  this.ctx.acceptWebSocket(server,[code]);
  server.serializeAttachment({code,playerId:player.id,token});

  player.connected=true;
  await this.saveRoom(room);
  await this.broadcast(room);

  return new Response(null,{status:101,webSocket:client});
 }

 async webSocketMessage(ws,message){
  const info=ws.deserializeAttachment();
  if(!info)return;

  let data;
  try{data=JSON.parse(String(message))}catch{return}

  const room=await this.readRoom(info.code);
  if(!room)return;
  const player=room.players.find(p=>p.id===info.playerId);
  if(!player)return;

  if(data.type==="start"){
   if(player.id!==room.hostId)return this.sendError(ws,"صاحب الغرفة وحده يستطيع بدء اللعبة.");
   if(room.started)return this.sendError(ws,"اللعبة بدأت بالفعل.");
   if(room.players.length<5)return this.sendError(ws,"تحتاج إلى 5 لاعبين على الأقل.");
   if(room.players.length>13)return this.sendError(ws,"الحد الأعلى 13 لاعباً.");
   await this.startGame(room);
   return;
  }

  if(data.type==="chat"){
   if(room.started&&player.alive===false)return this.sendError(ws,"أنت خارج اللعبة ولا تستطيع المراسلة.");
   const text=String(data.text||"").trim().slice(0,300);
   if(!text)return;
   const msg={id:crypto.randomUUID(),name:player.name,text,time:Date.now()};
   room.chat.push(msg);
   room.chat=room.chat.slice(-80);
   await this.saveRoom(room);
   await this.broadcastChat(room,msg,false);
   return;
  }

  if(data.type==="mafiaChat"){
   if(player.role!=="mafia"||player.alive===false)return this.sendError(ws,"هذه المحادثة للمافيا الأحياء فقط.");
   const text=String(data.text||"").trim().slice(0,300);
   if(!text)return;
   const msg={id:crypto.randomUUID(),name:player.name,text,time:Date.now()};
   room.mafiaChat.push(msg);
   room.mafiaChat=room.mafiaChat.slice(-80);
   await this.saveRoom(room);
   await this.broadcastChat(room,msg,true);
   return;
  }

  if(data.type==="action"){
   if(!room.started||room.phase==="ended")return;
   if(player.alive===false)return this.sendError(ws,"أنت خارج اللعبة.");
   await this.handleAction(room,player,data);
  }
 }

 sendError(ws,message){
  try{ws.send(JSON.stringify({type:"error",message}))}catch{}
 }

 async broadcast(room){
  for(const ws of this.ctx.getWebSockets(room.code)){
   const info=ws.deserializeAttachment();
   if(!info)continue;
   const player=room.players.find(p=>p.id===info.playerId);
   try{ws.send(JSON.stringify({type:"state",room:this.safeRoom(room,player)}))}catch{}
  }
 }

 async broadcastChat(room,msg,isMafia){
  for(const ws of this.ctx.getWebSockets(room.code)){
   const info=ws.deserializeAttachment();
   const player=room.players.find(p=>p.id===info?.playerId);
   if(!player)continue;
   if(isMafia&&(player.role!=="mafia"||player.alive===false))continue;
   try{
    ws.send(JSON.stringify({
     type:isMafia?"mafiaChat":"chat",
     message:msg
    }));
   }catch{}
  }
 }

 async startGame(room){
  const n=room.players.length;
  const mafiaCount=n>=12?3:n>=7?2:1;
  const roles=[
   ...Array(mafiaCount).fill("mafia"),
   "doctor","detective",
   ...Array(n-mafiaCount-2).fill("civilian")
  ];

  for(let i=roles.length-1;i>0;i--){
   const j=Math.floor(Math.random()*(i+1));
   [roles[i],roles[j]]=[roles[j],roles[i]];
  }

  room.players.forEach((p,i)=>{
   p.role=roles[i];
   p.alive=true;
   p.voteTarget=null;
  });

  room.started=true;
  room.phase="night";
  room.killVotes={};
  room.protectedId=null;
  room.investigated={};
  room.votes={};
  room.deadline=Date.now()+40000;
  room.phaseHint="المافيا والطبيب والمحقق يختارون خلال الوقت.";
  room.notice="بدأت اللعبة. افتح «رؤية دوري» لمعرفة دورك.";
  await this.saveRoom(room);
  await this.broadcast(room);
 }

 async handleAction(room,player,data){
  const action=String(data.action||"");
  const targetId=String(data.targetId||"");
  const target=room.players.find(p=>p.id===targetId&&p.alive!==false);

  if(!target)return this.notifyPlayer(player.id,room,"اللاعب غير متاح.");
  if(target.id===player.id&&action!=="protect")return this.notifyPlayer(player.id,room,"لا يمكنك اختيار نفسك.");

  if(room.phase==="night"){
   if(action==="kill"&&player.role==="mafia"){
    if(target.role==="mafia")return this.notifyPlayer(player.id,room,"لا يمكنك اغتيال أحد أعضاء المافيا.");
    room.killVotes[player.id]=target.id;
    const mafia=room.players.filter(p=>p.alive!==false&&p.role==="mafia");
    const chosen=mafia.map(p=>room.killVotes[p.id]).filter(Boolean);
    if(mafia.every(p=>room.killVotes[p.id])&&chosen.every(id=>id===chosen[0])){
     room.deadline=Math.min(room.deadline,Date.now()+6000);
     room.notice="اتفقت المافيا على اختيار ضحية. تنتهي المهلة قريباً.";
    }else{
     room.notice="سُجّل اختيارك. اتفقوا عبر المحادثة السرية.";
    }
   }else if(action==="protect"&&player.role==="doctor"){
    room.protectedId=target.id;
    room.notice="تم تسجيل اختيار الطبيب بسرية.";
   }else if(action==="investigate"&&player.role==="detective"){
    room.investigated[player.id]=target.id;
    await this.notifyPlayer(player.id,room,target.role==="mafia"?"هذا اللاعب من المافيا. حاول إقناع الآخرين.":"هذا اللاعب ليس من المافيا.");
    room.notice="تم تسجيل التحقيق بسرية.";
   }else return this.notifyPlayer(player.id,room,"لا يمكنك استخدام هذا الدور الآن.");

   await this.saveRoom(room);
   await this.broadcast(room);
   return;
  }

  if(room.phase==="vote"||room.phase==="defense"){
   if(action!=="vote")return;
   if(room.votes[player.id]===target.id){
    return this.notifyPlayer(player.id,room,"أنت مصوّت لهذا اللاعب بالفعل.");
   }
   room.votes[player.id]=target.id;
   player.voteTarget=target.id;
   room.notice="تم تسجيل التصويت. يمكنك تغييره قبل انتهاء المهلة.";
   await this.saveRoom(room);
   await this.broadcast(room);

   const alive=room.players.filter(p=>p.alive!==false);
   if(room.phase==="vote"&&alive.every(p=>room.votes[p.id])){
    room.phase="defense";
    room.deadline=Date.now()+40000;
    room.phaseHint="وقت الدفاع: 40 ثانية. يمكن تغيير التصويت.";
    room.notice="اكتمل التصويت الأولي. استمعوا للتبرير.";
    await this.saveRoom(room);
    await this.broadcast(room);
   }
  }
 }

 async notifyPlayer(playerId,room,message){
  for(const ws of this.ctx.getWebSockets(room.code)){
   const info=ws.deserializeAttachment();
   if(info?.playerId===playerId){
    try{ws.send(JSON.stringify({type:"notice",message}))}catch{}
   }
  }
 }

 async alarm(){
  const rooms=await this.ctx.storage.list({prefix:"room:"});
  for(const [key,room] of rooms){
   if(!room.started||room.phase==="ended"||room.deadline>Date.now())continue;
   await this.advance(room);
  }
 }

 async advance(room){
  if(room.phase==="night"){
   const mafia=room.players.filter(p=>p.alive!==false&&p.role==="mafia");
   const choices=mafia.map(p=>room.killVotes[p.id]).filter(Boolean);
   let victimId=null;

   if(mafia.length&&mafia.every(p=>room.killVotes[p.id])&&choices.every(id=>id===choices[0])){
    victimId=choices[0];
   }

   if(victimId&&victimId!==room.protectedId){
    const victim=room.players.find(p=>p.id===victimId);
    if(victim)victim.alive=false;
    room.notice=victim?"قُتل "+victim.name+" خلال الليل.":"انتهت الليلة.";
   }else if(victimId){
    room.notice="الطبيب أنقذ الضحية. لم يمت أحد هذه الليلة.";
   }else{
    room.notice="كانت ليلة هادئة؛ المافيا لم تقتل أحداً.";
   }

   if(await this.checkWin(room))return;
   room.phase="vote";
   room.votes={};
   room.players.forEach(p=>p.voteTarget=null);
   room.deadline=Date.now()+40000;
   room.phaseHint="وقت التصويت: 40 ثانية.";
   await this.saveRoom(room);
   await this.broadcast(room);
   return;
  }

  if(room.phase==="vote"){
   room.phase="defense";
   room.deadline=Date.now()+40000;
   room.phaseHint="وقت الدفاع: 40 ثانية.";
   room.notice="انتهى التصويت الأولي. استمعوا للدفاع.";
   await this.saveRoom(room);
   await this.broadcast(room);
   return;
  }

  if(room.phase==="defense"){
   const alive=room.players.filter(p=>p.alive!==false);
   const counts={};
   alive.forEach(p=>{
    const target=room.votes[p.id];
    if(target&&alive.some(x=>x.id===target))counts[target]=(counts[target]||0)+1;
   });

   const max=Math.max(0,...Object.values(counts));
   const leaders=Object.keys(counts).filter(id=>counts[id]===max&&max>0);

   if(leaders.length===1){
    const out=room.players.find(p=>p.id===leaders[0]);
    if(out)out.alive=false;
    room.notice=out?"تم إعدام "+out.name+" بالتصويت.":"لم يتم إعدام أحد.";
   }else{
    room.notice="تعادل التصويت؛ لم يتم إعدام أحد.";
   }

   if(await this.checkWin(room))return;
   room.phase="night";
   room.killVotes={};
   room.protectedId=null;
   room.investigated={};
   room.deadline=Date.now()+40000;
   room.phaseHint="الليل: 40 ثانية.";
   room.players.forEach(p=>p.voteTarget=null);
   await this.saveRoom(room);
   await this.broadcast(room);
  }
 }

 async checkWin(room){
  const alive=room.players.filter(p=>p.alive!==false);
  const mafia=alive.filter(p=>p.role==="mafia").length;
  const others=alive.length-mafia;

  if(mafia===0){
   room.phase="ended";
   room.result="المدنيون";
   room.notice="انتصار المدنيين! تم القضاء على المافيا.";
  }else if(mafia>=others){
   room.phase="ended";
   room.result="المافيا";
   room.notice="انتصار المافيا!";
  }else return false;

  room.deadline=0;
  await this.saveRoom(room);
  await this.broadcast(room);
  return true;
 }

 async webSocketClose(ws){
  await this.disconnect(ws);
 }

 async webSocketError(ws){
  await this.disconnect(ws);
 }

 async disconnect(ws){
  const info=ws.deserializeAttachment();
  if(!info)return;

  const room=await this.readRoom(info.code);
  if(!room)return;
  const player=room.players.find(p=>p.id===info.playerId);
  if(!player)return;

  player.connected=false;
  await this.saveRoom(room);
  await this.broadcast(room);
 }
   }
