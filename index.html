<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SMART // FARM</title>

<style>
:root{
  --bg:#0b1220;
  --card:rgba(255,255,255,0.06);
  --stroke:rgba(255,255,255,0.12);
  --green:#22c55e;
  --yellow:#facc15;
  --red:#ef4444;
  --text:#e5e7eb;
}

*{box-sizing:border-box;font-family:Segoe UI,sans-serif}
body{margin:0;background:var(--bg);color:var(--text);}

header{
  padding:16px 20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid var(--stroke);
}

.brand{font-weight:700;letter-spacing:2px}

.nav a{
  margin:0 10px;
  color:var(--text);
  text-decoration:none;
  opacity:.7;
}
.nav a:hover{opacity:1}

.container{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:15px;
  padding:20px;
}

.card{
  background:var(--card);
  border:1px solid var(--stroke);
  border-radius:14px;
  padding:15px;
  backdrop-filter:blur(10px);
}

.value{font-size:28px;margin-top:10px}

.bar{
  height:6px;
  background:#111827;
  border-radius:10px;
  overflow:hidden;
  margin-top:10px;
}

.fill{height:100%;width:50%;transition:0.5s}

.status{
  padding:10px 20px;
  margin:10px 20px;
  border-radius:12px;
  display:none;
}

.status.show{display:block}
.good{background:rgba(34,197,94,.2);color:var(--green)}
.warn{background:rgba(250,204,21,.2);color:var(--yellow)}
.bad{background:rgba(239,68,68,.2);color:var(--red)}

.layout{
  display:grid;
  grid-template-columns:2fr 1fr;
  gap:20px;
  padding:20px;
}

.chat{
  background:var(--card);
  border:1px solid var(--stroke);
  border-radius:14px;
  display:flex;
  flex-direction:column;
  height:500px;
}

.messages{
  flex:1;
  padding:10px;
  overflow:auto;
}

.msg{margin:8px 0;padding:8px 10px;border-radius:10px;max-width:80%}
.user{background:var(--green);align-self:flex-end}
.ai{background:#1f2937}

.input{
  display:flex;
  border-top:1px solid var(--stroke);
}

input{
  flex:1;
  padding:10px;
  border:none;
  outline:none;
  background:#0f172a;
  color:white;
}

button{
  padding:10px;
  background:var(--green);
  border:none;
  cursor:pointer;
}

svg{width:100%;height:120px}
</style>
</head>

<body>

<header>
  <div class="brand">SMART // FARM</div>
  <div class="nav">
    <a href="#">Dashboard</a>
    <a href="#">Zones</a>
    <a href="#">Alerts</a>
    <a href="#">AI</a>
  </div>
</header>

<div id="status" class="status">SYSTEM OK</div>

<div class="container">
  <div class="card"><h3>Temperature</h3><div id="temp" class="value">0</div><div class="bar"><div id="tbar" class="fill"></div></div></div>
  <div class="card"><h3>Humidity</h3><div id="hum" class="value">0</div><div class="bar"><div id="hbar" class="fill"></div></div></div>
  <div class="card"><h3>Soil</h3><div id="soil" class="value">0</div><div class="bar"><div id="sbar" class="fill"></div></div></div>
  <div class="card"><h3>Light</h3><div id="light" class="value">0</div><div class="bar"><div id="lbar" class="fill"></div></div></div>
</div>

<div class="layout">

  <div class="card">
    <h3>Trends</h3>
    <svg id="chart"></svg>
  </div>

  <div class="chat">
    <div class="messages" id="msgs"></div>
    <div class="input">
      <input id="input" placeholder="Ask the farm AI..." />
      <button onclick="send()">Send</button>
    </div>
  </div>

</div>

<script>
let data = {temp:20,hum:50,soil:40,light:60};
let history = [];

function randWalk(v,min,max){
  v += (Math.random()-0.5)*5;
  return Math.max(min,Math.min(max,v));
}

function update(){
  data.temp = randWalk(data.temp,10,45);
  data.hum = randWalk(data.hum,20,90);
  data.soil = randWalk(data.soil,10,80);
  data.light = randWalk(data.light,10,100);

  document.getElementById("temp").innerText = data.temp.toFixed(1);
  document.getElementById("hum").innerText = data.hum.toFixed(1);
  document.getElementById("soil").innerText = data.soil.toFixed(1);
  document.getElementById("light").innerText = data.light.toFixed(1);

  setBar("tbar",data.temp/45*100);
  setBar("hbar",data.hum);
  setBar("sbar",data.soil);
  setBar("lbar",data.light);

  history.push(data.temp);
  if(history.length>20) history.shift();

  draw();

  let status = document.getElementById("status");
  if(data.soil<25 || data.temp>38){
    status.className="status bad show";
    status.innerText="CRITICAL FARM CONDITION";
  }else if(data.soil<40){
    status.className="status warn show";
    status.innerText="WARNING FARM CONDITION";
  }else{
    status.className="status good show";
    status.innerText="SYSTEM HEALTHY";
  }
}

function setBar(id,val){
  document.getElementById(id).style.width = val+"%";
}

function draw(){
  let svg = document.getElementById("chart");
  svg.innerHTML="";
  let w=300,h=120;
  let step = w/history.length;
  let path="M0 "+h/2;

  history.forEach((v,i)=>{
    let y = h - (v/50)*h;
    let x = i*step;
    path += " L"+x+" "+y;
  });

  let p = document.createElementNS("http://www.w3.org/2000/svg","path");
  p.setAttribute("d",path);
  p.setAttribute("stroke","#22c55e");
  p.setAttribute("fill","none");
  svg.appendChild(p);
}

async function send(){
  let input = document.getElementById("input");
  let msg = input.value;
  if(!msg) return;

  addMsg(msg,"user");
  input.value="";

  addMsg("Thinking...","ai");

  try{
    let res = await fetch("/api/gemini",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({message:msg})
    });

    let data = await res.json();
    removeLast();
    addMsg(data.reply || data.error,"ai");
  }catch(e){
    removeLast();
    addMsg("Error connecting to AI","ai");
  }
}

function addMsg(t,type){
  let div=document.createElement("div");
  div.className="msg "+type;
  div.innerText=t;
  document.getElementById("msgs").appendChild(div);
  document.getElementById("msgs").scrollTop=9999;
}

function removeLast(){
  let m=document.getElementById("msgs");
  m.removeChild(m.lastChild);
}

setInterval(update,3000);
update();
</script>

</body>
</html>
