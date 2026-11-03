(() => {
"use strict";
const $=id=>document.getElementById(id);
const i18n={
ko:{year:"학년 선택",category:"학습 영역",all:"전체 영역 섞기",number:"수와 연산",algebra:"대수와 패턴",measure:"측정",geometry:"기하와 공간",statistics:"통계와 자료",probability:"확률",mode:"게임 모드",start:"시작",normal:"일반 모드",speed:"스피드 모드",timerDifficulty:"시간 제한 난이도",timerHint:"시간 제한은 문제의 수학 난이도와 별개입니다.",easier:"더 쉽게",harder:"더 어렵게",help:"일반 모드 10문제 · 스피드 모드 무제한",progress:"문제",score:"점수",time:"남은 시간",pause:"일시정지",resume:"계속하기",next:"다음 문제",exit:"그만하기",question:"문제를 풀어보세요!",correct:"정답입니다! 🎉",wrong:"아쉬워요. 정답은 ",timeout:"",answer:"정답",explain:"풀이 방법",submit:"답 제출",placeholder:"정답 입력",result:"게임 종료!",again:"다시 시작",answered:"푼 문제",correctCount:"정답",accuracy:"정답률",language:"🇳🇿",timerEasy:"쉬움 · 15초",timerMedium:"보통 · 10초",timerHard:"어려움 · 6초",versionLatest:"최신 버전입니다.",versionOld:"새 버전이 있어요: v",versionChecking:"최신 버전 확인 중...",versionUnknown:"최신 버전을 확인할 수 없습니다."},
en:{year:"Choose year",category:"Learning area",all:"Mixed topics",number:"Number",algebra:"Algebra & patterns",measure:"Measurement",geometry:"Geometry & space",statistics:"Statistics & data",probability:"Probability",mode:"Game mode",start:"Start",normal:"Normal mode",speed:"Speed mode",timerDifficulty:"Timer difficulty",timerHint:"Timer difficulty is separate from maths question difficulty.",easier:"Easier",harder:"Harder",help:"Normal: 10 questions · Speed: unlimited",progress:"Question",score:"Score",time:"Time left",pause:"Pause",resume:"Resume",next:"Next question",exit:"Quit",question:"Solve this question!",correct:"Correct! 🎉",wrong:"Not quite. The answer is ",timeout:"",answer:"Answer",explain:"How to solve",submit:"Submit",placeholder:"Type your answer",result:"Game over!",again:"Play again",answered:"Questions answered",correctCount:"Correct",accuracy:"Accuracy",language:"🇰🇷",timerEasy:"Easy · 15s",timerMedium:"Medium · 10s",timerHard:"Hard · 6s",versionLatest:"You’re using the latest version.",versionOld:"Update available: v",versionChecking:"Checking for updates...",versionUnknown:"Unable to check for updates."}
};
const $tr=k=>i18n[lang][k]||k;
let lang="ko",mode="normal",timerLevel=1,questionLevel=1,score=0,answered=0,correct=0,current=null,locked=false,paused=false,remaining=0,deadline=0,tick=null,nextTimer=null,audio=null,seen=new Set();
const APP_VERSION="2.3.8";
function compare(a,b){const x=String(a).split(".").map(Number),y=String(b).split(".").map(Number);for(let i=0;i<Math.max(x.length,y.length);i++){let d=(x[i]||0)-(y[i]||0);if(d)return d;}return 0;}
async function checkVersion(){const badge=document.querySelector(".app-version");if(badge)badge.textContent="v"+APP_VERSION;const el=$("versionStatus");el.textContent=$tr("versionChecking");try{const r=await fetch("version.json?check="+Date.now(),{cache:"no-store"});if(!r.ok)throw 0;const v=await r.json();el.textContent=compare(APP_VERSION,v.version)>=0?$tr("versionLatest"):$tr("versionOld")+v.version;}catch(e){el.textContent=$tr("versionUnknown");}}
function updateText(){
document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=$tr(e.dataset.i18n));
$("langBtn").textContent=$tr("language");$("normalBtn").textContent=$tr("normal");$("speedBtn").textContent=$tr("speed");$("startBtn").textContent=$tr("start");$("pauseBtn").textContent=paused?$tr("resume"):$tr("pause");$("exitBtn").textContent=$tr("exit");$("nextBtn").textContent=$tr("next");$("againBtn").textContent=$tr("again");
document.querySelectorAll("[data-time]").forEach(b=>{b.textContent=$tr(["timerEasy","timerMedium","timerHard"][+b.dataset.time]);b.classList.toggle("primary",+b.dataset.time===timerLevel);});
if(current)renderCurrentText();
}
function setMode(m){mode=m;$("normalBtn").classList.toggle("primary",m==="normal");$("speedBtn").classList.toggle("primary",m==="speed");$("timerSettings").classList.toggle("hidden",m!=="speed");}
function rand(n){return Math.floor(Math.random()*n);}
function pick(a){return a[rand(a.length)];}
function fmt(n){return Number.isInteger(n)?String(n):String(Math.round(n*100)/100);}
function makeGenerated(){
const year=+$("year").value,level=questionLevel,base=year*5+level*8,topic=$("category").value,types=topic==="all"?["number","algebra","measure","geometry","statistics","probability"]:[topic];
for(let attempt=0;attempt<80;attempt++){
const s=pick(types);let qko,qen,a,eko,een;
if(s==="number"){
const op=pick(year<3?["+","−","×"]:level===0?["+","−","×"]:["+","−","×","÷",...(year>=5?["%"]:[]),...(year>=6?["fraction"]:[])]);
let x,y;if(op==="+"){x=rand(base*3+10)+2;y=rand(base*2+8)+1;a=x+y;qko=`${x} + ${y} = ?`;qen=`${x} + ${y} = ?`;eko=`${x}에 ${y}를 더하면 ${a}입니다.`;een=`Add ${x} and ${y} to get ${a}.`;}
else if(op==="−"){x=rand(base*3+15)+10;y=rand(x)+1;a=x-y;qko=`${x} − ${y} = ?`;qen=`${x} − ${y} = ?`;eko=`${x}에서 ${y}를 빼면 ${a}입니다.`;een=`Subtract ${y} from ${x} to get ${a}.`;}
else if(op==="×"){x=rand(Math.max(5,year*2+level*4))+2;y=rand(Math.max(5,year+level*3))+2;a=x*y;qko=`${x} × ${y} = ?`;qen=`${x} × ${y} = ?`;eko=`${x}을 ${y}번 더하면 ${a}입니다.`;een=`${x} multiplied by ${y} equals ${a}.`;}
else if(op==="÷"){y=rand(Math.max(5,year+level*3))+2;a=rand(Math.max(5,year*3+level*8))+2;x=y*a;qko=`${x} ÷ ${y} = ?`;qen=`${x} ÷ ${y} = ?`;eko=`${y} × ${a} = ${x}이므로 답은 ${a}입니다.`;een=`Because ${y} × ${a} = ${x}, the answer is ${a}.`;}
else if(op==="%"){x=(rand(9)+1)*10;y=(rand(year*3+5)+1)*10;a=x*y/100;qko=`${y}의 ${x}%는 얼마인가요?`;qen=`What is ${x}% of ${y}?`;eko=`${y}의 10% 단위를 이용하면 ${a}입니다.`;een=`${x}% of ${y} is ${a}.`;}
else{x=rand(8)+2;y=rand(8)+2;a=fmt(1/x+1/y);qko=`1/${x} + 1/${y}를 계산하세요. (소수 둘째 자리까지)`;qen=`Calculate 1/${x} + 1/${y} (to 2 decimal places).`;a=fmt(1/x+1/y);eko=`각 분수를 소수로 바꾸어 더하면 약 ${a}입니다.`;een=`Convert each fraction to a decimal and add: about ${a}.`;}
}else if(s==="algebra"){let start=rand(base)+1,step=rand(level*4+year+3)+1,mult=rand(2)+2;if(level===2&&year>=4&&rand(2)){let vals=[start];for(let i=1;i<4;i++)vals.push(vals[i-1]*mult);a=vals[3]*mult;qko=`수열 ${vals.join(", ")}, ? 에서 다음 수는?`;qen=`What is the next number in ${vals.join(", ")}, ?`;eko=`매번 ${mult}를 곱합니다. 다음 수는 ${a}입니다.`;een=`Multiply by ${mult} each time. The next number is ${a}.`;}else{let vals=[0,1,2,3].map(i=>start+i*step);a=start+4*step;qko=`수열 ${vals.join(", ")}, ? 에서 다음 수는?`;qen=`What is the next number in ${vals.join(", ")}, ?`;eko=`매번 ${step}씩 더합니다. 다음 수는 ${a}입니다.`;een=`Add ${step} each time. The next number is ${a}.`;}}
else if(s==="measure"){let v=rand(base+10)+1;if(year<=3){a=v*10;qko=`${v}cm는 몇 mm인가요?`;qen=`How many millimetres are in ${v} cm?`;eko=`1cm는 10mm이므로 ${a}mm입니다.`;een=`1 cm equals 10 mm, so the answer is ${a} mm.`;}else if(rand(2)){a=v*100;qko=`${v}m는 몇 cm인가요?`;qen=`How many centimetres are in ${v} metres?`;eko=`1m는 100cm이므로 ${a}cm입니다.`;een=`1 metre equals 100 centimetres, so the answer is ${a} cm.`;}else{a=v*1000;qko=`${v}km는 몇 m인가요?`;qen=`How many metres are in ${v} kilometres?`;eko=`1km는 1,000m이므로 ${a}m입니다.`;een=`1 kilometre equals 1,000 metres, so the answer is ${a} m.`;}}
else if(s==="geometry"){let sides=pick([3,4,5,6,8]);if(year<=3){a=sides;qko=`변이 ${sides}개인 도형을 몇 각형이라고 하나요? (변의 수)`;qen=`How many sides does this polygon have?`;eko=`도형의 변은 ${sides}개입니다.`;een=`The polygon has ${sides} sides.`;}else{let l=rand(base)+3,w=rand(base)+2;a=l*w;qko=`가로 ${l}cm, 세로 ${w}cm인 직사각형의 넓이는?`;qen=`What is the area of a rectangle ${l} cm by ${w} cm?`;eko=`넓이 = 가로 × 세로 = ${l} × ${w} = ${a}cm²입니다.`;een=`Area = length × width = ${l} × ${w} = ${a} cm².`;}}
else if(s==="statistics"){let vals=Array.from({length:3+rand(3)},()=>rand(base)+1),sum=vals.reduce((x,y)=>x+y,0);a=fmt(sum/vals.length);qko=`자료 ${vals.join(", ")}의 평균은 얼마인가요?`;qen=`What is the mean of ${vals.join(", ")}?`;eko=`모든 수의 합 ${sum}을 자료의 개수 ${vals.length}로 나누면 ${a}입니다.`;een=`Add to get ${sum}, then divide by ${vals.length}: ${a}.`;}
else{let total=rand(5)+4,fav=rand(total-1)+1;a=fmt(fav/total);qko=`전체 ${total}개 중 ${fav}개가 파란색입니다. 파란색을 뽑을 확률은? (소수)`;qen=`There are ${fav} blue items out of ${total}. What is the probability of picking blue? (decimal)`;eko=`가능한 경우 ${fav}개를 전체 ${total}개로 나누면 ${a}입니다.`;een=`Divide the ${fav} favourable outcomes by ${total} total outcomes: ${a}.`;}
const key=[s,qko].join("|");if(seen.has(key))continue;seen.add(key);
let options=[a];let numeric=Number(a);if(Number.isFinite(numeric)){let delta=Math.max(1,Math.abs(numeric)*.1);for(let i=1;i<4;i++){let d=numeric+(i%2?1:-1)*delta*(Math.ceil(i/2));let candidate=fmt(d);if(candidate!==String(a)&&!options.includes(candidate))options.push(candidate);}while(options.length<4)options.push(fmt(numeric+options.length+1));}else options=[a,"0","1","2"];
return {s,qko,qen,a:String(a),eko,een,options:options.slice(0,4).map(String)};
}
return makeGeneratedFallback();
}
function makeGeneratedFallback(){return {s:"number",qko:"5 + 4 = ?",qen:"5 + 4 = ?",a:"9",eko:"5에 4를 더하면 9입니다.",een:"Add 5 and 4 to get 9.",options:["9","8","10","11"]};}
function renderCurrentText(){
$("question").textContent=lang==="ko"?current.qko:current.qen;$("strandName").textContent=$tr(current.s);
if(locked){renderFeedback();}
}
function renderFeedback(){
const right=current.wasRight,timeout=current.timedOut;
$("feedback").classList.remove("hidden");
const title=timeout?"":right?$tr("correct"):$tr("wrong")+current.a;
const explain=lang==="ko"?current.eko:current.een;
$("feedback").innerHTML=`<div class="feedback-title">${title}</div><div class="solution"><b>${$tr("answer")}: ${current.a}</b><br><b>${$tr("explain")}:</b> ${explain}</div>`;
}
function renderQuestion(){
locked=false;$("feedback").classList.add("hidden");$("nextBtn").disabled=true;
$("choices").innerHTML="";$("choices").classList.toggle("hidden",mode==="speed");
renderCurrentText();$("progress").textContent=mode==="speed"?answered+1:`${answered+1} / 10`;
if(mode==="normal"){shuffle(current.options).forEach(opt=>{const b=document.createElement("button");b.className="choice";b.textContent=opt;b.addEventListener("click",()=>answer(opt,b,false));$("choices").append(b);});}
if(mode==="speed"&&!paused)startClock([15,10,6][timerLevel]);
}
function shuffle(a){let x=[...a];for(let i=x.length-1;i>0;i--){let j=rand(i+1);[x[i],x[j]]=[x[j],x[i]];}return x;}
function nextQ(){if(mode==="normal"&&answered>=10){finish();return;}current=makeGenerated();renderQuestion();}
function buildQueue(){seen.clear();current=null;}
let clockTotalMs=0,clockRemainingMs=0;
function startClock(sec,resuming=false){clearInterval(tick);if(!resuming){clockTotalMs=sec*1000;clockRemainingMs=clockTotalMs;}deadline=Date.now()+clockRemainingMs;$("timer").textContent=Math.ceil(clockRemainingMs/1000);$("timerFill").style.width=(clockRemainingMs/clockTotalMs*100)+"%";tick=setInterval(()=>{if(paused||locked)return;let ms=Math.max(0,deadline-Date.now()),left=Math.ceil(ms/1000);clockRemainingMs=ms;$("timer").textContent=left;$("timerFill").style.width=(ms/clockTotalMs*100)+"%";if(left<=3&&left>0&&left!==remaining){remaining=left;tone(880,.15,.14);}if(ms<=0){clearInterval(tick);clockRemainingMs=0;tone(180,.8,.22);answer(null,null,true);}},60);}
function tone(freq,duration,volume){try{if(!audio)return;if(audio.state==="suspended")audio.resume();let t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.02);}catch(e){}}
function initAudio(){try{let C=window.AudioContext||window.webkitAudioContext;if(C){audio=audio||new C();if(audio.state==="suspended")audio.resume();}}catch(e){}}
function answer(choice,button,timedOut){
if(locked)return;locked=true;clearInterval(tick);answered++;
const normalize=v=>String(v).replace(/,/g,"").trim().toLowerCase();
const right=!timedOut&&normalize(choice)===normalize(current.a);current.wasRight=right;current.timedOut=timedOut;
if(right){score+=10;correct++;button?.classList.add("correct");}else button?.classList.add("wrong");
[...$("choices").children].forEach(b=>{b.disabled=true;if(normalize(b.textContent)===normalize(current.a))b.classList.add("correct");});
$("score").textContent=score;$("progress").textContent=mode==="speed"?answered:`${answered} / 10`;renderFeedback();
if(mode==="normal")$("nextBtn").disabled=false;else nextTimer=setTimeout(()=>nextQ(),timedOut?6000:3000);
}
function pause(){if(mode!=="speed"||paused||locked)return;paused=true;clockRemainingMs=Math.max(0,deadline-Date.now());remaining=Math.max(1,Math.ceil(clockRemainingMs/1000));clearInterval(tick);$("timer").textContent=remaining;$("timerFill").style.width=(clockRemainingMs/clockTotalMs*100)+"%";$("pauseBtn").textContent=$tr("resume");}
function resume(){if(!paused)return;paused=false;$("pauseBtn").textContent=$tr("pause");if(!locked)startClock(clockRemainingMs/1000,true);}
function finish(){clearInterval(tick);clearTimeout(nextTimer);$("game").classList.add("hidden");$("result").classList.remove("hidden");$("finalScore").textContent=score+" pts";let pct=answered?Math.round(correct/answered*100):0;$("resultDetail").textContent=`${$tr("answered")}: ${answered} · ${$tr("correctCount")}: ${correct} · ${$tr("accuracy")}: ${pct}%`;}
function start(){clearInterval(tick);clearTimeout(nextTimer);initAudio();score=answered=correct=0;paused=false;questionLevel=1;buildQueue();$("setup").classList.add("hidden");$("result").classList.add("hidden");$("game").classList.remove("hidden");$("pauseBtn").classList.toggle("hidden",mode!=="speed");$("timerBox").classList.toggle("hidden",mode!=="speed");$("timerBar").classList.toggle("hidden",mode!=="speed");$("adjustPanel").classList.toggle("hidden",mode!=="speed");$("nextBtn").classList.toggle("hidden",mode!=="normal");$("nextBtn").disabled=true;$("score").textContent=0;nextQ();}
function quit(){clearInterval(tick);clearTimeout(nextTimer);$("game").classList.add("hidden");$("setup").classList.remove("hidden");paused=false;}
$("langBtn").addEventListener("click",()=>{lang=lang==="ko"?"en":"ko";updateText();});
$("normalBtn").addEventListener("click",()=>setMode("normal"));$("speedBtn").addEventListener("click",()=>setMode("speed"));
document.querySelectorAll("[data-time]").forEach(b=>b.addEventListener("click",()=>{timerLevel=+b.dataset.time;updateText();}));
$("easier").addEventListener("click",()=>{questionLevel=Math.max(0,questionLevel-1);updateDifficulty();});$("harder").addEventListener("click",()=>{questionLevel=Math.min(2,questionLevel+1);updateDifficulty();});
function updateDifficulty(){$("easier").disabled=questionLevel===0;$("harder").disabled=questionLevel===2;updateText();}
$("startBtn").addEventListener("click",start);$("nextBtn").addEventListener("click",()=>{if(mode==="normal"&&locked){if(answered>=10)finish();else nextQ();}});
$("pauseBtn").addEventListener("click",()=>paused?resume():pause());$("exitBtn").addEventListener("click",quit);$("againBtn").addEventListener("click",()=>{$("result").classList.add("hidden");$("setup").classList.remove("hidden");});
setMode("normal");updateText();checkVersion();
})();