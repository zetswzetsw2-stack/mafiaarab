import { DurableObject } from "cloudflare:workers";

const HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#101522"><title>مافيا العرب</title>
<style>
:root{--bg:#0d1220;--card:#171f31;--line:#303d56;--gold:#e8bd70;--muted:#aab6cc;--red:#ef6262;--green:#4fd1a1;--blue:#7db7ff}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:radial-gradient(ellipse at top,#202a40 0,#0d1220 65%);color:#f4f6fc;font-family:Arial,sans-serif}main{height:100dvh;max-width:900px;margin:auto;padding:7px 9px;display:flex;flex-direction:column;min-height:0}h1{text-align:center;color:var(--gold);margin:0;font-size:21px;line-height:1.3}.subtitle{text-align:center;color:var(--muted);margin:0 0 5px;font-size:11px}.card{background:rgba(23,31,49,.96);border:1px solid var(--line);border-radius:11px;padding:8px;margin:0;min-height:0;box-shadow:0 5px 14px #0002}.section-title{display:flex;align-items:center;justify-content:space-between;gap:6px}.pill{border:1px solid var(--line);border-radius:999px;padding:3px 7px;color:var(--muted);font-size:10px}input,button{width:100%;padding:8px;border-radius:8px;margin:3px 0;font-size:13px}input{background:#0d1423;color:white;border:1px solid #46536b;outline:none;min-width:0}button{background:linear-gradient(135deg,#f0cf8d,#c9974e);color:#171a22;border:0;font-weight:bold;cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}.secondary{background:#303c54;color:white}.danger{background:#7d2d3a;color:white}.green{background:#176c58;color:white}.hidden{display:none!important}.small{color:var(--muted);font-size:11px}.item{background:#0d1423;border:1px solid #28344a;border-radius:8px;padding:6px;margin:4px 0;overflow-wrap:anywhere}.players-list{min-height:0;overflow:auto}.player{display:flex;align-items:center;justify-content:space-between;gap:5px}.player-name{min-width:0;overflow-wrap:anywhere;font-size:12px}.votes{color:var(--gold);font-weight:bold;white-space:nowrap;font-size:11px}.player button{width:auto;min-width:54px;padding:5px 7px;margin:0;font-size:11px;flex-shrink:0}.phase{font-weight:bold;font-size:14px;color:var(--gold)}.timer{font-size:17px;font-weight:bold;color:var(--green);font-variant-numeric:tabular-nums;white-space:nowrap}.timer.warning{color:var(--red)}#chat,#mafiaChat{min-height:0;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:4px;padding:2px}.chat-message{background:#0d1423;border:1px solid #28344a;border-radius:7px;padding:5px;overflow-wrap:anywhere;font-size:11px}.chat-message b{color:var(--gold)}.private-box{border-color:#803746;background:#241721}.private-box h3{color:#ff9b9b}.system{color:var(--blue);font-size:11px}.role-box{border:1px solid #947343;background:linear-gradient(135deg,#28251f,#171f31);text-align:center}.role-name{font-size:20px;color:var(--gold);font-weight:bold;margin:5px}.role-desc{color:var(--muted);line-height:1.5;font-size:12px}.action-list{display:flex;flex-direction:column;gap:3px}.action-list button{margin:0;padding:6px;font-size:11px}.footer{text-align:center;color:#8895ac;font-size:10px;padding:4px 0 0;flex-shrink:0}.footer a{color:var(--gold);text-decoration:none;font-weight:bold}.note{font-size:11px;color:var(--muted);line-height:1.5}.topline{display:flex;align-items:center;justify-content:space-between;gap:7px}.topline button{width:auto;padding:6px 8px;font-size:11px}.notice{padding:7px;border-radius:8px;background:#0d1423;color:var(--muted);line-height:1.45;font-size:12px}.phase-night{color:#ff8d8d}.phase-vote{color:#8dc4ff}#status{font-size:11px;padding:5px 8px;margin-bottom:5px;flex-shrink:0}#home{min-height:0;overflow:auto}#home .twocol{display:grid;grid-template-columns:1fr 1fr;gap:7px}#home h3{font-size:14px;margin:0 0 5px}#home .card{margin-bottom:6px}#lobby{flex:1;min-height:0;display:flex;flex-direction:column;gap:6px;overflow:hidden}#lobby:not(.hidden){display:flex}#lobby>.room-head{flex-shrink:0}#lobby .play-grid{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:6px}#lobby .players-panel{display:flex;flex-direction:column;min-height:0;overflow:hidden}#lobby .players-panel #players{flex:1;min-height:0}#lobby .players-panel #actions{max-height:31%;overflow:auto;flex-shrink:0}#lobby .players-panel #voteList{max-height:42%;overflow:auto;flex-shrink:0}#lobby .chat-panel{display:flex;flex-direction:column;gap:5px;min-height:0;overflow:hidden}#lobby .chat-card{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden}#lobby .chat-card #chat{flex:1}#lobby #mafiaCard{flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden}#lobby #mafiaCard #mafiaChat{flex:1}#lobby #gameCard{flex-shrink:0}#lobby .footer{display:none}#lobby .role-box{flex-shrink:0}#lobby .players-panel .players-list{max-height:none}#lobby .room-head{display:flex;align-items:center;justify-content:space-between;gap:6px}#lobby .room-head h3{font-size:12px;margin:0}#lobby .room-head .small{font-size:10px}#lobby .leave-btn{flex-shrink:0;margin:0;padding:5px;font-size:10px;width:auto}#lobby .chat-card h3,#lobby #mafiaCard h3{font-size:12px;margin:0}#lobby .chat-card .section-title,#lobby #mafiaCard .section-title{flex-shrink:0}#lobby .chat-card .chat-controls{display:flex;gap:4px;align-items:center;flex-shrink:0}#lobby .chat-card .chat-controls input,#lobby #mafiaCard input{margin:2px 0;padding:7px;font-size:12px}#lobby .chat-card .chat-controls button,#lobby #mafiaCard button{width:auto;min-width:50px;margin:2px 0;padding:7px;font-size:11px}#lobby #mafiaCard{border-color:#803746;background:#241721}#lobby #gameCard .topline{gap:5px}#lobby #phaseHint{font-size:10px}#lobby #gameNotice{margin:5px 0!important}#lobby #codeText{color:var(--gold)}#lobby .room-head .pill{font-size:10px}@media(max-width:390px){main{padding:5px}h1{font-size:18px}.subtitle{font-size:10px}#lobby .play-grid{grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:4px}.card{padding:6px}.player-name{font-size:11px}.votes{font-size:10px}.timer{font-size:15px}}@media(min-width:700px){main{padding:10px 14px}#lobby .play-grid{grid-template-columns:1fr 1fr}}
</style></head><body><main>
<h1>🎭 مافيا العرب</h1><p class="subtitle">فكّر جيداً… فليس كل من يتكلم بريئاً</p>
<div class="card" id="status">أهلاً بك! أنشئ غرفة أو انضم إلى أصدقائك.</div>
<section id="home"><div class="twocol"><div class="card"><h3>إنشاء غرفة</h3><input id="createName" maxlength="24" placeholder="اكتب اسمك داخل اللعبة"><button onclick="createRoom(false)">غرفة خاصة للأصدقاء</button><button onclick="createRoom(true)">إنشاء غرفة عامة</button></div><div class="card"><h3>الانضمام إلى غرفة</h3><input id="joinName" maxlength="24" placeholder="اسمك داخل اللعبة"><input id="joinCode" maxlength="6" placeholder="رمز الغرفة"><button onclick="joinRoom()">انضمام</button></div></div><div class="card"><div class="section-title"><h3>الغرف العامة</h3><button class="secondary" style="width:auto" onclick="loadRooms()">تحديث</button></div><div id="rooms"></div></div></section>
<section id="lobby" class="hidden">
<div class="room-head card"><div><h3>🎭 مافيا العرب — غرفة <span id="codeText"></span></h3><div class="small">اللاعبون <b id="count">0/13</b> · <span id="phaseName" class="phase">الردهة</span> · <span id="timer" class="timer">--</span></div></div><button class="secondary" onclick="copyCode()">نسخ الرمز</button></div>
<div id="gameCard" class="card"><div id="phaseHint" class="small">بانتظار بدء اللعبة</div><div id="gameNotice" class="notice" style="margin:5px 0">أنشئ غرفة أو انضم إلى غرفة وابدأ اللعب عند اكتمال 5 لاعبين.</div></div>
<div class="play-grid">
<div class="players-panel card"><div class="section-title"><h3 style="font-size:13px;margin:0">👥 اللاعبون</h3><span class="pill">13 كحد أقصى</span></div><div id="players" class="players-list"></div><div id="actions" class="action-list"></div><div id="voteList" class="players-list"></div><p id="waiting" class="note"></p><button id="startBtn" onclick="startGame()" class="green hidden">بدء اللعبة</button><button id="roleBtn" onclick="showMyRole()" class="secondary hidden">👁️ دوري السري</button><div id="roleBox" class="role-box hidden"></div></div>
<div class="chat-panel"><div class="chat-card card"><div class="section-title"><h3>💬 المحادثة العامة</h3><span class="pill">للأحياء</span></div><div id="chat"></div><div class="chat-controls"><input id="chatInput" maxlength="300" placeholder="اكتب رسالة..."><button onclick="sendChat()">إرسال</button></div></div>
<div id="mafiaCard" class="card private-box hidden"><div class="section-title"><h3>🔴 دردشة المافيا السرية</h3><span class="pill">مافيا فقط</span></div><div id="mafiaChat"></div><input id="mafiaInput" maxlength="300" placeholder="رسالة للمافيا..."><button class="danger" onclick="sendMafiaChat()">إرسال سري</button></div></div>
</div><button class="secondary leave-btn" onclick="leaveRoom()">مغادرة الغرفة</button>
</section><footer class="footer">تم تصميم هذه اللعبة بواسطة <b>زيتسو</b><br><a href="https://t.me/ZETSW" target="_blank" rel="noopener">للتواصل عبر تيليجرام</a></footer>
</main><script>
let current=null,socket=null,lastRoom=null,myRoleVisible=false,shownMessages=new Set(),shownMafiaMessages=new Set(),timerInterval=null;
const el=id=>document.getElementById(id);function status(t){el('status').textContent=t}
async function api(path,data){const r=await fetch(path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});const j=await r.json();if(!r.ok)throw new Error(j.error||'حدث خطأ');return j}
async function createRoom(isPublic){const name=el('createName').value.trim();if(!name)return status('اكتب اسمك أولاً.');try{enter(await api('/api/create',{name,isPublic}))}catch(e){status(e.message)}}
async function joinRoom(){const name=el('joinName').value.trim(),code=el('joinCode').value.trim().toUpperCase();if(!name||!code)return status('اكتب اسمك ورمز الغرفة.');try{enter(await api('/api/join',{name,code}))}catch(e){status(e.message)}}
async function loadRooms(){try{const r=await api('/api/rooms');el('rooms').replaceChildren();if(!r.rooms.length){el('rooms').textContent='لا توجد غرف عامة متاحة.';return}r.rooms.forEach(room=>{const d=document.createElement('div');d.className='item';const label=document.createElement('div');label.textContent=room.code+' — '+room.count+'/13 لاعبين';const b=document.createElement('button');b.textContent='انضمام';b.onclick=()=>{el('joinCode').value=room.code;el('joinName').value=el('createName').value||el('joinName').value;joinRoom()};d.append(label,b);el('rooms').append(d)})}catch(e){status(e.message)}}
function enter(data){current={code:data.code,token:data.token};lastRoom=null;myRoleVisible=false;shownMessages.clear();shownMafiaMessages.clear();el('home').classList.add('hidden');el('lobby').classList.remove('hidden');el('codeText').textContent=data.code;el('players').textContent='جارٍ الاتصال...';el('chat').replaceChildren();el('mafiaChat').replaceChildren();connect()}
function connect(){const scheme=location.protocol==='https:'?'wss:':'ws:';socket=new WebSocket(scheme+'//'+location.host+'/ws?code='+encodeURIComponent(current.code)+'&token='+encodeURIComponent(current.token));socket.onopen=()=>status('اتصلت بالغرفة بنجاح.');socket.onmessage=e=>{let d;try{d=JSON.parse(e.data)}catch{return}if(d.type==='error')return status(d.message);if(d.type==='state')renderState(d.room);if(d.type==='chat')showChat(d.message,false);if(d.type==='mafiaChat')showChat(d.message,true);if(d.type==='notice')status(d.message);if(d.type==='privateResult'){status(d.result==='mafia'?'نتيجة التحقيق سرّاً: هذا اللاعب من المافيا. حاول إقناع الآخرين دون كشف النتيجة مباشرة.':'نتيجة التحقيق سرّاً: هذا اللاعب ليس من المافيا.');}};socket.onclose=()=>{if(current)status('انقطع الاتصال. أعد فتح الصفحة وحاول الدخول مجدداً.');};socket.onerror=()=>status('تعذر الاتصال بالخادم.')}
function renderState(room){lastRoom=room;const me=room.me;el('count').textContent=room.players.length+'/13';el('players').replaceChildren();const counts=room.voteCounts||{};room.players.forEach(p=>{const d=document.createElement('div');d.className='item player';const n=document.createElement('span');n.className='player-name';n.textContent=(p.alive===false?'⚫ ':p.connected?'🟢 ':'⚪ ')+p.name+(p.id===room.hostId?' 👑':'')+(p.alive===false?' — مقتول':'');d.append(n);if(p.alive!==false&&me&&me.alive){if(room.phase==='night'&&me.role==='mafia'&&p.id!==me.id){const b=document.createElement('button');b.textContent='اغتيال';b.className='danger';b.onclick=()=>send({type:'action',action:'mafia',targetId:p.id});if(me.role==='mafia')d.append(b)}else if(room.phase==='night'&&me.role==='doctor'){const b=document.createElement('button');b.textContent='حماية';b.className='green';b.onclick=()=>send({type:'action',action:'doctor',targetId:p.id});d.append(b)}else if(room.phase==='night'&&me.role==='detective'&&p.id!==me.id){const b=document.createElement('button');b.textContent='تحقيق';b.className='secondary';b.onclick=()=>send({type:'action',action:'detective',targetId:p.id});d.append(b)}else if(room.phase==='voting'&&p.id!==me.id){const v=document.createElement('span');v.className='votes';v.textContent=(counts[p.id]||0)+' صوت';d.append(v);const b=document.createElement('button');b.textContent=me.myVote===p.id?'صوتك ✓':'صوّت';b.className=me.myVote===p.id?'green':'';b.onclick=()=>send({type:'action',action:'vote',targetId:p.id});d.append(b)}}el('players').append(d)});el('waiting').textContent=room.phase==='lobby'?'الحد الأدنى 5 لاعبين والحد الأعلى 13. صاحب الغرفة يستطيع البدء متى اكتمل العدد الأدنى.':room.phase==='ended'?'انتهت اللعبة. الفائز: '+(room.winner==='mafia'?'المافيا':'المدنيون')+'.':'اختر من نفس قائمة اللاعبين حسب دورك والمرحلة.';el('startBtn').classList.toggle('hidden',!(room.phase==='lobby'&&room.isHost&&room.players.length>=5));el('roleBtn').classList.toggle('hidden',!room.gameStarted||!me||me.alive===false);el('roleBox').classList.add('hidden');if(myRoleVisible&&me&&me.role)renderRole(me.role);el('gameCard').classList.toggle('hidden',!room.gameStarted);el('mafiaCard').classList.toggle('hidden',!(me&&me.alive&&me.role==='mafia'&&room.phase!=='lobby'&&room.phase!=='ended'));renderPhase(room);renderChat(room.chat||[],false);renderChat(room.mafiaChat||[],true);el('actions').replaceChildren();el('voteList').replaceChildren();}
function renderRole(role){el('roleBox').classList.remove('hidden');const names={mafia:'🔴 المافيا',doctor:'🩺 الطبيب',detective:'🔎 المحقق',civilian:'👥 مدني'};const desc={mafia:'اختر هدفاً بالتنسيق مع بقية المافيا، ولا تكشف هويتك.',doctor:'اختر لاعباً واحداً لحمايته كل ليلة.',detective:'اختر لاعباً للتحقق منه. النتيجة تظهر لك وحدك، وحاول إقناع الآخرين دون كشف مباشر.',civilian:'راقب النقاش وصوّت بحكمة لكشف المافيا.'};el('roleBox').innerHTML='<div class="small">دورك السري</div><div class="role-name"></div><div class="role-desc"></div>';el('roleBox').querySelector('.role-name').textContent=names[role]||'غير معروف';el('roleBox').querySelector('.role-desc').textContent=desc[role]||''}
function showMyRole(){if(!lastRoom||!lastRoom.me||!lastRoom.me.role)return;myRoleVisible=true;renderRole(lastRoom.me.role)}
function renderPhase(r){const phaseNames={lobby:'الردهة',night:'🌙 مرحلة الليل',voting:'🗳️ مرحلة التصويت',ended:'🏆 انتهت اللعبة'};el('phaseName').textContent=phaseNames[r.phase]||r.phase;el('phaseName').className='phase '+(r.phase==='night'?'phase-night':r.phase==='voting'?'phase-vote':'');const seconds=Math.max(0,Math.ceil((r.phaseEnds-Date.now())/1000));el('timer').textContent=r.phaseEnds?seconds+' ث':'--';el('timer').classList.toggle('warning',seconds<=10);const hints={night:'المافيا والطبيب والمحقق يختارون في الوقت نفسه. الاختيار غير إلزامي.',voting:'صوّتوا لمن تشكون به. يمكن تغيير الصوت حتى انتهاء الـ45 ثانية.',ended:'الفائز: '+(r.winner==='mafia'?'المافيا':'المدنيون')};el('phaseHint').textContent=hints[r.phase]||'';el('gameNotice').textContent=r.notice||'';}if(!timerInterval)timerInterval=setInterval(()=>{if(!lastRoom)return;const s=Math.max(0,Math.ceil((lastRoom.phaseEnds-Date.now())/1000));el('timer').textContent=lastRoom.phaseEnds?s+' ث':'--';el('timer').classList.toggle('warning',s<=10)},250);
function renderActions(r){el('actions').replaceChildren();el('voteList').replaceChildren();const me=r.me;if(!me||!me.alive||r.phase==='lobby'||r.phase==='ended')return;const addButton=(label,fn,cls)=>{const b=document.createElement('button');b.textContent=label;if(cls)b.className=cls;b.onclick=fn;el('actions').append(b)};const alive=r.players.filter(p=>p.alive!==false);if(r.phase==='night'&&me.role==='mafia'){alive.filter(p=>p.id!==me.id).forEach(p=>addButton('اختيار: '+p.name,()=>send({type:'action',action:'mafia',targetId:p.id}),'danger'));}if(r.phase==='night'&&me.role==='doctor'){alive.forEach(p=>addButton('حماية: '+p.name,()=>send({type:'action',action:'doctor',targetId:p.id}),'green'));}if(r.phase==='night'&&me.role==='detective'){alive.filter(p=>p.id!==me.id).forEach(p=>addButton('تحقيق: '+p.name,()=>send({type:'action',action:'detective',targetId:p.id}),'secondary'));}if(r.phase==='voting'){const counts=r.voteCounts||{};alive.filter(p=>p.id!==me.id).forEach(p=>{const d=document.createElement('div');d.className='item player';const label=document.createElement('span');label.className='player-name';label.textContent=p.name;const v=document.createElement('span');v.className='votes';v.textContent=(counts[p.id]||0)+' صوت';d.append(label,v);const b=document.createElement('button');b.textContent=me.myVote===p.id?'صوتك الحالي':'صوّت';b.className=me.myVote===p.id?'green':'';b.onclick=()=>send({type:'action',action:'vote',targetId:p.id});d.append(b);el('voteList').append(d)});if(me.myVote)addButton('أنت مصوّت بالفعل — يمكنك تغيير صوتك',()=>status('اختر لاعباً من القائمة لتغيير صوتك.'),'secondary');else addButton('اختر لاعباً من القائمة للتصويت',()=>status('اضغط زر صوّت بجانب اسم اللاعب.'),'secondary');}}
function renderChat(messages,privateChat){const box=el(privateChat?'mafiaChat':'chat');const seen=privateChat?shownMafiaMessages:shownMessages;for(const m of messages){if(seen.has(m.id))continue;seen.add(m.id);showChat(m,privateChat)}}
function showChat(m,privateChat){const box=el(privateChat?'mafiaChat':'chat');if(box.querySelector('[data-id="'+m.id+'"]'))return;const d=document.createElement('div');d.className='chat-message';d.dataset.id=m.id;const b=document.createElement('b');b.textContent=m.name+': ';const span=document.createElement('span');span.textContent=m.text;d.append(b,span);box.append(d);box.scrollTop=box.scrollHeight}
function send(data){if(!socket||socket.readyState!==WebSocket.OPEN)return status('الاتصال غير جاهز.');socket.send(JSON.stringify(data))}function sendChat(){const text=el('chatInput').value.trim();if(!text)return;send({type:'chat',text});el('chatInput').value=''}function sendMafiaChat(){const text=el('mafiaInput').value.trim();if(!text)return;send({type:'mafiaChat',text});el('mafiaInput').value=''}el('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});el('mafiaInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMafiaChat()});
async function startGame(){if(!current)return;send({type:'start'})}async function copyCode(){try{await navigator.clipboard.writeText(current.code);status('تم نسخ رمز الغرفة.')}catch{status('رمز الغرفة: '+current.code)}}async function leaveRoom(){if(!current)return;const old=current;current=null;if(socket){socket.close();socket=null}if(timerInterval)clearInterval(timerInterval);try{await api('/api/leave',{code:old.code,token:old.token})}catch{}el('lobby').classList.add('hidden');el('home').classList.remove('hidden');status('رجعت إلى القائمة.');loadRooms()}loadRooms();
</script></body></html>`;
function json(data, status = 200) { return Response.json(data, { status }); }
const MAX_PLAYERS = 13;
const ROLE_NAMES = { mafia: "المافيا", doctor: "الطبيب", detective: "المحقق", civilian: "مدني" };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/" && request.method === "GET") return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    const id = env.GAME_HUB.idFromName("main-game-hub");
    return env.GAME_HUB.get(id).fetch(request);
  }
};

export class GameHub extends DurableObject {
  async readRoom(code) { return this.ctx.storage.get("room:" + code); }
  async saveRoom(room) { await this.ctx.storage.put("room:" + room.code, room); }
  safeRoom(room, player) {
    const counts = {};
    for (const id of Object.values(room.votes || {})) counts[id] = (counts[id] || 0) + 1;
    const me = room.players.find(p => p.token === player.token);
    return {
      code: room.code, hostId: room.hostId, isPublic: room.isPublic,
      phase: room.phase, phaseEnds: room.phaseEnds || 0, gameStarted: room.gameStarted,
      winner: room.winner || null, notice: room.notice || "",
      players: room.players.map(p => ({ id: p.id, name: p.name, connected: p.connected, alive: p.alive !== false })),
      chat: room.chat || [], mafiaChat: me && me.role === "mafia" && me.alive ? (room.mafiaChat || []) : [],
      me: me ? { id: me.id, name: me.name, alive: me.alive !== false, role: room.gameStarted ? me.role : null, myVote: (room.votes || {})[me.id] || null } : null,
      voteCounts: counts, isHost: !!(me && me.id === room.hostId)
    };
  }
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/api/create" && request.method === "POST") return this.createRoom(request);
    if (url.pathname === "/api/join" && request.method === "POST") return this.joinRoom(request);
    if (url.pathname === "/api/rooms") return this.listRooms();
    if (url.pathname === "/api/leave" && request.method === "POST") return this.leaveRoom(request);
    if (url.pathname === "/ws") return this.connect(request);
    return json({ error: "المسار غير موجود" }, 404);
  }
  async createRoom(request) {
    let data; try { data = await request.json(); } catch { return json({ error: "البيانات غير صحيحة" }, 400); }
    const name = String(data.name || "").trim().slice(0, 24); if (!name) return json({ error: "اكتب اسم اللاعب" }, 400);
    let code; do { code = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase(); } while (await this.readRoom(code));
    const player = { id: crypto.randomUUID(), token: crypto.randomUUID(), name, connected: false, alive: true, role: null };
    const room = { code, hostId: player.id, isPublic: data.isPublic === true, players: [player], chat: [], mafiaChat: [], gameStarted: false, phase: "lobby", phaseEnds: 0, notice: "بانتظار اللاعبين. الحد الأدنى لبدء اللعبة 5 لاعبين." };
    await this.saveRoom(room);
    if (room.isPublic) { const codes = await this.ctx.storage.get("publicCodes") || []; if (!codes.includes(code)) { codes.push(code); await this.ctx.storage.put("publicCodes", codes); } }
    return json({ code, token: player.token });
  }
  async joinRoom(request) {
    let data; try { data = await request.json(); } catch { return json({ error: "البيانات غير صحيحة" }, 400); }
    const code = String(data.code || "").trim().toUpperCase(), name = String(data.name || "").trim().slice(0, 24), room = await this.readRoom(code);
    if (!name || !code) return json({ error: "اكتب الاسم والرمز" }, 400);
    if (!room) return json({ error: "الغرفة غير موجودة" }, 404);
    if (room.gameStarted || room.phase !== "lobby") return json({ error: "اللعبة بدأت ولا يمكن الانضمام الآن" }, 409);
    if (room.players.length >= MAX_PLAYERS) return json({ error: "الغرفة مكتملة (13 لاعباً)" }, 409);
    const player = { id: crypto.randomUUID(), token: crypto.randomUUID(), name, connected: false, alive: true, role: null };
    room.players.push(player); await this.saveRoom(room); await this.broadcast(room); return json({ code, token: player.token });
  }
  async listRooms() {
    const codes = await this.ctx.storage.get("publicCodes") || [], rooms = [];
    for (const code of codes) { const room = await this.readRoom(code); if (room && room.isPublic && room.phase === "lobby" && room.players.length < MAX_PLAYERS) rooms.push({ code, count: room.players.length }); }
    return json({ rooms });
  }
  async leaveRoom(request) {
    let data; try { data = await request.json(); } catch { return json({ error: "البيانات غير صحيحة" }, 400); }
    const code = String(data.code || "").toUpperCase(), token = String(data.token || ""), room = await this.readRoom(code);
    if (!room) return json({ ok: true });
    const player = room.players.find(p => p.token === token); if (!player) return json({ ok: true });
    if (room.gameStarted && room.phase !== "ended") { player.connected = false; player.alive = false; room.notice = player.name + " غادر اللعبة وأصبح خارجها."; await this.checkWinner(room); await this.saveRoom(room); await this.broadcast(room); return json({ ok: true }); }
    room.players = room.players.filter(p => p.token !== token);
    if (!room.players.length) { await this.ctx.storage.delete("room:" + code); const codes = await this.ctx.storage.get("publicCodes") || []; await this.ctx.storage.put("publicCodes", codes.filter(c => c !== code)); return json({ ok: true }); }
    if (room.hostId === player.id) room.hostId = room.players[0].id;
    await this.saveRoom(room); await this.broadcast(room); return json({ ok: true });
  }
  async connect(request) {
    if (request.headers.get("Upgrade") !== "websocket") return json({ error: "يلزم WebSocket" }, 426);
    const url = new URL(request.url), code = (url.searchParams.get("code") || "").toUpperCase(), token = url.searchParams.get("token") || "", room = await this.readRoom(code);
    if (!room) return json({ error: "الغرفة غير موجودة" }, 404);
    const player = room.players.find(p => p.token === token);
    if (!player) return json({ error: "رمز دخول اللاعب غير صحيح" }, 403);
    const pair = new WebSocketPair(), client = pair[0], server = pair[1];
    server.accept(); server.serializeAttachment({ code, playerId: player.id, token: player.token });
    player.connected = true; await this.saveRoom(room);
    server.addEventListener("message", event => this.onMessage(server, event.data));
    server.addEventListener("close", () => this.disconnect(server));
    server.addEventListener("error", () => this.disconnect(server));
    server.send(JSON.stringify({ type: "state", room: this.safeRoom(room, player) }));
    await this.broadcast(room);
    return new Response(null, { status: 101, webSocket: client });
  }
  async onMessage(ws, raw) {
    let data; try { data = JSON.parse(raw); } catch { return; }
    const info = ws.deserializeAttachment(); if (!info) return;
    const room = await this.readRoom(info.code); if (!room) return;
    const player = room.players.find(p => p.id === info.playerId && p.token === info.token); if (!player) return;
    if (data.type === "start") {
      if (room.phase !== "lobby" || player.id !== room.hostId || room.players.length < 5) {
        ws.send(JSON.stringify({ type: "notice", message: "تحتاج إلى 5 لاعبين على الأقل، ويبدأ صاحب الغرفة اللعبة." })); return;
      }
      await this.startGame(room); return;
    }
    if (data.type === "action") { await this.handleAction(room, player, data); return; }
    if (data.type === "chat") {
      if (!player.alive || !room.gameStarted || room.phase === "ended") return;
      const text = String(data.text || "").trim().slice(0, 300); if (!text) return;
      room.chat.push({ id: crypto.randomUUID(), name: player.name, text, time: Date.now() });
      room.chat = room.chat.slice(-60); await this.saveRoom(room); await this.broadcastChat(room); return;
    }
    if (data.type === "mafiaChat") {
      if (!player.alive || player.role !== "mafia" || room.phase === "lobby" || room.phase === "ended") return;
      const text = String(data.text || "").trim().slice(0, 300); if (!text) return;
      room.mafiaChat.push({ id: crypto.randomUUID(), name: player.name, text, time: Date.now() });
      room.mafiaChat = room.mafiaChat.slice(-60); await this.saveRoom(room); await this.broadcastMafiaChat(room); return;
    }
   }
   async startGame(room) {
    const players = room.players.slice();
    for (const p of players) { p.alive = true; p.role = "civilian"; }
    const mafiaCount = players.length <= 6 ? 1 : players.length <= 11 ? 2 : 3;
    const shuffled = players.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < mafiaCount; i++) shuffled[i].role = "mafia";
    let next = mafiaCount;
    shuffled[next++].role = "doctor";
    shuffled[next++].role = "detective";
    room.gameStarted = true;
    room.phase = "night";
    room.phaseEnds = Date.now() + 45000;
    room.votes = {};
    room.nightActions = {};
    room.chat = [];
    room.mafiaChat = [];
    room.notice = "🌙 بدأ الليل. أمام المافيا والطبيب والمحقق 45 ثانية للاختيار.";
    await this.saveRoom(room);
    await this.scheduleAlarm(room);
    await this.broadcast(room);
  }

  async handleAction(room, player, data) {
    if (!room.gameStarted || room.phase === "ended" || !player.alive) return;
    const targetId = String(data.targetId || "");
    const target = room.players.find(p => p.id === targetId && p.alive !== false);

    if (room.phase === "night") {
      if (!target) return;
      if (!room.nightActions) room.nightActions = {};

      if (data.action === "mafia" && player.role === "mafia" && target.id !== player.id) {
        room.nightActions.mafia = target.id;
        room.notice = "🔴 اختارت المافيا هدفاً. تستمر مرحلة الليل حتى انتهاء الوقت.";
      } else if (data.action === "doctor" && player.role === "doctor") {
        room.nightActions.doctor = target.id;
      } else if (data.action === "detective" && player.role === "detective" && target.id !== player.id) {
        room.nightActions.detective = target.id;
        this.sendToPlayer(room, player.id, {
          type: "privateResult",
          result: target.role === "mafia" ? "mafia" : "notmafia"
        });
      } else {
        return;
      }

      await this.saveRoom(room);
      await this.broadcast(room);
      return;
    }

    if (room.phase === "voting" && data.action === "vote" && target && target.id !== player.id) {
      if (!room.votes) room.votes = {};
      room.votes[player.id] = target.id;
      await this.saveRoom(room);
      await this.broadcast(room);
    }
  }

  sendToPlayer(room, playerId, message) {
    for (const ws of this.ctx.getWebSockets()) {
      const info = ws.deserializeAttachment();
      if (!info || info.code !== room.code || info.playerId !== playerId) continue;
      try { ws.send(JSON.stringify(message)); } catch {}
    }
  }

  async broadcast(room) {
    for (const ws of this.ctx.getWebSockets()) {
      const info = ws.deserializeAttachment();
      if (!info || info.code !== room.code) continue;

      const player = room.players.find(
        p => p.id === info.playerId && p.token === info.token
      );
      if (!player) continue;

      try {
        ws.send(JSON.stringify({
          type: "state",
          room: this.safeRoom(room, player)
        }));
      } catch {}
    }
  }

  async broadcastChat(room) {
    const message = room.chat[room.chat.length - 1];
    if (!message) return;

    for (const ws of this.ctx.getWebSockets()) {
      const info = ws.deserializeAttachment();
      if (!info || info.code !== room.code) continue;

      const player = room.players.find(
        p => p.id === info.playerId && p.token === info.token
      );
      if (!player || !player.alive) continue;

      try { ws.send(JSON.stringify({ type: "chat", message })); } catch {}
    }
  }

  async broadcastMafiaChat(room) {
    const message = room.mafiaChat[room.mafiaChat.length - 1];
    if (!message) return;

    for (const ws of this.ctx.getWebSockets()) {
      const info = ws.deserializeAttachment();
      if (!info || info.code !== room.code) continue;

      const player = room.players.find(
        p => p.id === info.playerId && p.token === info.token
      );
      if (!player || !player.alive || player.role !== "mafia") continue;

      try { ws.send(JSON.stringify({ type: "mafiaChat", message })); } catch {}
    }
  }

  async scheduleAlarm(room) {
    let earliest = Infinity;
    const list = await this.ctx.storage.list({ prefix: "room:" });

    for (const value of list.values()) {
      if (value && value.gameStarted && value.phase !== "ended" && value.phaseEnds > 0) {
        earliest = Math.min(earliest, value.phaseEnds);
      }
    }

    if (Number.isFinite(earliest)) {
      await this.ctx.storage.setAlarm(Math.max(Date.now() + 500, earliest));
    } else {
      await this.ctx.storage.deleteAlarm();
    }
  }

  async alarm() {
    const list = await this.ctx.storage.list({ prefix: "room:" });

    for (const room of list.values()) {
      if (!room || !room.gameStarted || room.phase === "ended" ||
          !room.phaseEnds || room.phaseEnds > Date.now()) continue;
      await this.advance(room);
    }

    const updated = await this.ctx.storage.list({ prefix: "room:" });
    let earliest = Infinity;

    for (const room of updated.values()) {
      if (room && room.gameStarted && room.phase !== "ended" && room.phaseEnds > 0) {
        earliest = Math.min(earliest, room.phaseEnds);
      }
    }

    if (Number.isFinite(earliest)) {
      await this.ctx.storage.setAlarm(Math.max(Date.now() + 500, earliest));
    }
  }

  async advance(room) {
    if (room.phase === "night") {
      const actions = room.nightActions || {};
      const victimId = actions.mafia || null;
      const protectedId = actions.doctor || null;

      if (!victimId) {
        room.notice = "🌅 انتهى الليل بسلام؛ لم تختر المافيا هدفاً.";
      } else if (victimId === protectedId) {
        const saved = room.players.find(p => p.id === victimId);
        room.notice = "🩺 أنقذ الطبيب " +
          (saved ? saved.name : "أحد اللاعبين") +
          " من محاولة الاغتيال!";
      } else {
        const victim = room.players.find(p => p.id === victimId);
        if (victim) {
          victim.alive = false;
          room.notice = "💀 قُتل " + victim.name + " خلال الليل.";
        } else {
          room.notice = "🌅 انتهى الليل.";
        }
      }

      room.nightActions = {};
      room.votes = {};

      if (await this.checkWinner(room)) {
        await this.saveRoom(room);
        await this.broadcast(room);
        await this.scheduleAlarm(room);
        return;
      }

      room.phase = "voting";
      room.phaseEnds = Date.now() + 45000;
      room.notice += " 🗳️ بدأ التصويت: أمامكم 45 ثانية، ويمكن تغيير أصواتكم حتى انتهاء الوقت.";
      await this.saveRoom(room);
      await this.scheduleAlarm(room);
      await this.broadcast(room);
      return;
    }

    if (room.phase === "voting") {
      const counts = {};

      for (const [voterId, targetId] of Object.entries(room.votes || {})) {
        const voter = room.players.find(p => p.id === voterId && p.alive !== false);
        const target = room.players.find(p => p.id === targetId && p.alive !== false);

        if (voter && target && voter.id !== target.id) {
          counts[targetId] = (counts[targetId] || 0) + 1;
        }
      }

      const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);

      if (ranked.length && (ranked.length === 1 || ranked[0][1] > ranked[1][1])) {
        const executed = room.players.find(p => p.id === ranked[0][0]);
        if (executed) {
          executed.alive = false;
          room.notice = "⚖️ انتهى التصويت. أُخرج " +
            executed.name + " من اللعبة بعد حصوله على أعلى الأصوات.";
        }
      } else {
        room.notice = "⚖️ انتهى التصويت بالتعادل أو من دون أصوات؛ لم يُخرج أي لاعب.";
      }

      room.votes = {};

      if (await this.checkWinner(room)) {
        await this.saveRoom(room);
        await this.broadcast(room);
        await this.scheduleAlarm(room);
        return;
      }

      room.phase = "night";
      room.phaseEnds = Date.now() + 45000;
      room.notice += " 🌙 حلّ الليل من جديد. أمام المافيا والطبيب والمحقق 45 ثانية للاختيار.";
      await this.saveRoom(room);
      await this.scheduleAlarm(room);
      await this.broadcast(room);
    }
  }

  async checkWinner(room) {
    const alive = room.players.filter(p => p.alive !== false);
    const mafia = alive.filter(p => p.role === "mafia").length;
    const others = alive.length - mafia;

    if (mafia === 0) {
      room.phase = "ended";
      room.phaseEnds = 0;
      room.winner = "civilians";
      room.notice = "🏆 فاز المدنيون! تم كشف جميع أفراد المافيا.";
      return true;
    }

    if (mafia >= others) {
      room.phase = "ended";
      room.phaseEnds = 0;
      room.winner = "mafia";
      room.notice = "🏆 فازت المافيا! أصبح عددها مساوياً أو أكبر من بقية الأحياء.";
      return true;
    }

    return false;
  }

  async disconnect(ws) {
    const info = ws.deserializeAttachment();
    if (!info) return;

    const room = await this.readRoom(info.code);
    if (!room) return;

    const player = room.players.find(p => p.id === info.playerId);
    if (!player) return;

    const stillConnected = this.ctx.getWebSockets().some(other => {
      const x = other.deserializeAttachment();
      return x && x.code === info.code && x.playerId === player.id && other !== ws;
    });

    if (stillConnected) return;

    player.connected = false;
    await this.saveRoom(room);
    await this.broadcast(room);
  }
        }
