
import { DurableObject } from "cloudflare:workers";

const HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>مافيا العرب</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#101522;color:#f4f5fb;font-family:Arial,sans-serif}
main{max-width:620px;margin:auto;padding:18px}
h1{text-align:center;color:#e7bd72}
.card{background:#1b2335;border:1px solid #303c54;border-radius:14px;padding:16px;margin:12px 0}
input,button{width:100%;padding:13px;border-radius:9px;margin:6px 0;font-size:16px}
input{background:#101522;color:white;border:1px solid #46536b}
button{background:#b68b48;color:#111827;border:0;font-weight:bold}
.secondary{background:#303c54;color:white}
.small{color:#aeb8cb;font-size:14px}
.hidden{display:none!important}
.item{background:#101522;border-radius:9px;padding:10px;margin:6px 0}
#chat{height:240px;overflow-y:auto}
#status{color:#e7bd72;white-space:pre-wrap}
</style>
</head>
<body>
<main>
<h1>🎭 مافيا العرب</h1>
<p class="small" style="text-align:center">لعبة المافيا العربية أونلاين</p>
<div class="card" id="status">أهلاً بك! أنشئ غرفة أو انضم إلى أصدقائك.</div>

<section id="home">
<div class="card">
<h3>إنشاء غرفة</h3>
<input id="createName" maxlength="24" placeholder="اكتب اسمك">
<button onclick="createRoom(false)">غرفة خاصة للأصدقاء</button>
<button onclick="createRoom(true)">إنشاء غرفة عامة</button>
</div>
<div class="card">
<h3>الانضمام إلى غرفة</h3>
<input id="joinName" maxlength="24" placeholder="اسمك داخل اللعبة">
<input id="joinCode" maxlength="6" placeholder="رمز الغرفة">
<button onclick="joinRoom()">انضمام</button>
</div>
<div class="card">
<h3>الغرف العامة</h3>
<button class="secondary" onclick="loadRooms()">تحديث الغرف</button>
<div id="rooms"></div>
</div>
</section>

<section id="lobby" class="hidden">
<div class="card">
<h3>رمز الغرفة: <span id="codeText"></span></h3>
<button class="secondary" onclick="copyCode()">نسخ الرمز</button>
<p>اللاعبون: <span id="count">0/8</span></p>
<div id="players"></div>
<p id="waiting" class="small"></p>
</div>
<div class="card">
<h3>الدردشة</h3>
<div id="chat"></div>
<input id="chatInput" maxlength="300" placeholder="اكتب رسالة">
<button onclick="sendChat()">إرسال</button>
<button class="secondary" onclick="leaveRoom()">مغادرة الغرفة</button>
</div>
</section>
</main>

<script>
let current=null, socket=null;

const el=id=>document.getElementById(id);
function status(t){el("status").textContent=t}

async function api(path,data){
 const r=await fetch(path,{
  method:data?"POST":"GET",
  headers:{"Content-Type":"application/json"},
  body:data?JSON.stringify(data):undefined
 });
 const j=await r.json();
 if(!r.ok)throw new Error(j.error||"حدث خطأ");
 return j;
}

async function createRoom(isPublic){
 const name=el("createName").value.trim();
 if(!name)return status("اكتب اسمك أولاً.");
 try{
  enter(await api("/api/create",{name,isPublic}));
 }catch(e){status(e.message)}
}

async function joinRoom(){
 const name=el("joinName").value.trim();
 const code=el("joinCode").value.trim().toUpperCase();
 if(!name||!code)return status("اكتب اسمك ورمز الغرفة.");
 try{
  enter(await api("/api/join",{name,code}));
 }catch(e){status(e.message)}
}

async function loadRooms(){
 try{
  const result=await api("/api/rooms");
  el("rooms").replaceChildren();
  if(!result.rooms.length){
   el("rooms").textContent="لا توجد غرف عامة متاحة.";
   return;
  }
  result.rooms.forEach(room=>{
   const d=document.createElement("div");
   d.className="item";
   const label=document.createElement("div");
   label.textContent=room.code+" — "+room.count+"/8 لاعبين";
   const b=document.createElement("button");
   b.textContent="انضمام";
   b.onclick=()=>{
    el("joinCode").value=room.code;
    el("joinName").value=el("createName").value||el("joinName").value;
    joinRoom();
   };
   d.append(label,b);
   el("rooms").append(d);
  });
 }catch(e){status(e.message)}
}

function enter(data){
 current={code:data.code,token:data.token};
 el("home").classList.add("hidden");
 el("lobby").classList.remove("hidden");
 el("codeText").textContent=data.code;
 el("players").textContent="جارٍ الاتصال...";
 el("chat").replaceChildren();
 connect();
}

function connect(){
 const scheme=location.protocol==="https:"?"wss:":"ws:";
 socket=new WebSocket(
  scheme+"//"+location.host+
  "/ws?code="+encodeURIComponent(current.code)+
  "&token="+encodeURIComponent(current.token)
 );
 socket.onopen=()=>status("اتصلت بالغرفة بنجاح.");
 socket.onmessage=e=>{
  let d;
  try{d=JSON.parse(e.data)}catch{return}
  if(d.type==="error")return status(d.message);
  if(d.type==="state")renderState(d.room);
  if(d.type==="chat")showChat(d.message);
 };
 socket.onclose=()=>{
  if(current)status("انقطع الاتصال. حاول إعادة فتح اللعبة.");
 };
 socket.onerror=()=>status("تعذر الاتصال بالخادم.");
}

function renderState(room){
 el("count").textContent=room.players.length+"/8";
 el("players").replaceChildren();
 room.players.forEach(p=>{
  const d=document.createElement("div");
  d.className="item";
  d.textContent=(p.connected?"🟢 ":"⚪ ")+p.name+
   (p.id===room.hostId?" — صاحب الغرفة":"");
  el("players").append(d);
 });
 el("waiting").textContent=room.players.length===8?
  "اكتمل عدد اللاعبين. سنضيف بدء اللعبة وتوزيع الأدوار في المرحلة التالية.":
  "بانتظار "+(8-room.players.length)+" لاعب إضافي.";
 el("chat").replaceChildren();
 room.chat.forEach(showChat);
}

function showChat(m){
 const d=document.createElement("div");
 d.className="item";
 d.textContent=m.name+": "+m.text;
 el("chat").append(d);
 el("chat").scrollTop=el("chat").scrollHeight;
}

function sendChat(){
 const text=el("chatInput").value.trim();
 if(!text||!socket||socket.readyState!==WebSocket.OPEN)return;
 socket.send(JSON.stringify({type:"chat",text}));
 el("chatInput").value="";
}
el("chatInput").addEventListener("keydown",e=>{
 if(e.key==="Enter")sendChat();
});

async function copyCode(){
 try{
  await navigator.clipboard.writeText(current.code);
  status("تم نسخ رمز الغرفة.");
 }catch{
  status("رمز الغرفة: "+current.code);
 }
}

async function leaveRoom(){
 if(!current)return;
 const old=current;
 current=null;
 if(socket){socket.close();socket=null}
 try{
  await api("/api/leave",{code:old.code,token:old.token});
 }catch{}
 el("lobby").classList.add("hidden");
 el("home").classList.remove("hidden");
 status("رجعت إلى القائمة.");
 loadRooms();
}
loadRooms();
</script>
</body>
</html>`;

function json(data, status = 200) {
  return Response.json(data, { status });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    const id = env.GAME_HUB.idFromName("main-game-hub");
    return env.GAME_HUB.get(id).fetch(request);
  }
};

export class GameHub extends DurableObject {
  async readRoom(code) {
    return this.ctx.storage.get("room:" + code);
  }

  async saveRoom(room) {
    await this.ctx.storage.put("room:" + room.code, room);
  }

  safeRoom(room) {
    return {
      code: room.code,
      hostId: room.hostId,
      isPublic: room.isPublic,
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        connected: p.connected
      })),
      chat: room.chat
    };
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/create" && request.method === "POST")
      return this.createRoom(request);

    if (url.pathname === "/api/join" && request.method === "POST")
      return this.joinRoom(request);

    if (url.pathname === "/api/rooms")
      return this.listRooms();

    if (url.pathname === "/api/leave" && request.method === "POST")
      return this.leaveRoom(request);

    if (url.pathname === "/ws")
      return this.connect(request);

    return json({error:"المسار غير موجود"},404);
  }

  async createRoom(request) {
    let data;
    try { data = await request.json(); }
    catch { return json({error:"البيانات غير صحيحة"},400); }

    const name=String(data.name||"").trim().slice(0,24);
    if(!name)return json({error:"اكتب اسم اللاعب"},400);

    let code;
    do {
      code=crypto.randomUUID().replace(/-/g,"").slice(0,6).toUpperCase();
    } while(await this.readRoom(code));

    const player={
      id:crypto.randomUUID(),
      token:crypto.randomUUID(),
      name,
      connected:false
    };

    const room={
      code,
      hostId:player.id,
      isPublic:data.isPublic===true,
      players:[player],
      chat:[]
    };

    await this.saveRoom(room);

    if(room.isPublic){
      const codes=await this.ctx.storage.get("publicCodes")||[];
      if(!codes.includes(code)){
        codes.push(code);
        await this.ctx.storage.put("publicCodes",codes);
      }
    }

    return json({code,token:player.token});
  }

  async joinRoom(request) {
    let data;
    try { data=await request.json(); }
    catch { return json({error:"البيانات غير صحيحة"},400); }

    const code=String(data.code||"").trim().toUpperCase();
    const name=String(data.name||"").trim().slice(0,24);
    const room=await this.readRoom(code);

    if(!name||!code)return json({error:"اكتب الاسم والرمز"},400);
    if(!room)return json({error:"الغرفة غير موجودة"},404);
    if(room.players.length>=8)return json({error:"الغرفة مكتملة"},409);

    const player={
      id:crypto.randomUUID(),
      token:crypto.randomUUID(),
      name,
      connected:false
    };

    room.players.push(player);
    await this.saveRoom(room);
    await this.broadcast(room);

    return json({code,token:player.token});
  }

  async listRooms() {
    const codes=await this.ctx.storage.get("publicCodes")||[];
    const rooms=[];

    for(const code of codes){
      const room=await this.readRoom(code);
      if(room&&room.isPublic&&room.players.length<8){
        rooms.push({code,count:room.players.length});
      }
    }
    return json({rooms});
  }

  async leaveRoom(request) {
    let data;
    try { data=await request.json(); }
    catch { return json({error:"البيانات غير صحيحة"},400); }

    const code=String(data.code||"").toUpperCase();
    const token=String(data.token||"");
    const room=await this.readRoom(code);

    if(!room)return json({ok:true});
    const player=room.players.find(p=>p.token===token);
    if(!player)return json({ok:true});

    room.players=room.players.filter(p=>p.token!==token);

    if(room.players.length===0){
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

  async connect(request) {
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
    const client=pair[0];
    const server=pair[1];

    this.ctx.acceptWebSocket(server,[code]);
    server.serializeAttachment({code,playerId:player.id});

    player.connected=true;
    await this.saveRoom(room);
    await this.broadcast(room);

    return new Response(null,{status:101,webSocket:client});
  }

  async webSocketMessage(ws, message) {
    const info=ws.deserializeAttachment();
    if(!info)return;

    let data;
    try { data=JSON.parse(String(message)); }
    catch { return; }

    if(data.type!=="chat")return;

    const room=await this.readRoom(info.code);
    if(!room)return;
    const player=room.players.find(p=>p.id===info.playerId);
    if(!player)return;

    const text=String(data.text||"").trim().slice(0,300);
    if(!text)return;

    const msg={
      id:crypto.randomUUID(),
      name:player.name,
      text,
      time:Date.now()
    };

    room.chat.push(msg);
    room.chat=room.chat.slice(-50);
    await this.saveRoom(room);

    for(const ws2 of this.ctx.getWebSockets(info.code)){
      try { ws2.send(JSON.stringify({type:"chat",message:msg})); }
      catch {}
    }
  }

  async webSocketClose(ws) {
    await this.disconnect(ws);
  }

  async webSocketError(ws) {
    await this.disconnect(ws);
  }

  async disconnect(ws) {
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

  async broadcast(room) {
    const data=JSON.stringify({
      type:"state",
      room:this.safeRoom(room)
    });

    for(const ws of this.ctx.getWebSockets(room.code)){
      try { ws.send(data); }
      catch {}
    }
  }
}
