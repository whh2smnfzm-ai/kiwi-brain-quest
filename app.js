(() => {
"use strict";
const $ = id => document.getElementById(id);
const i18n = {
 ko:{year:"학년 선택",category:"학습 영역",all:"전체 영역 섞기",number:"수와 연산",algebra:"대수와 패턴",measure:"측정",geometry:"기하와 공간",statistics:"통계와 자료",probability:"확률",mode:"게임 모드",start:"시작",normal:"일반 모드",speed:"스피드 모드",timerDifficulty:"시간 제한 난이도",timerHint:"시간 제한은 문제의 수학 난이도와 별개입니다.",help:"일반 모드 10문제 · 스피드 모드 무제한",progress:"문제",score:"점수",time:"남은 시간",adjustTitle:"다음 문제 난이도 조절",adjustHint:"현재 문제는 유지되고 다음 문제부터 적용됩니다.",easy:"쉬움",medium:"보통",hard:"어려움",pause:"일시정지",next:"다음 문제",resume:"계속하기",pauseText:"⏸ 타이머 정지 중",pauseHint:"문제는 그대로 보여요. 계속 풀어도 됩니다.",exit:"그만하기",question:"문제를 풀어보세요!",correct:"정답입니다! 🎉",wrong:"정답은 ",timeout:"시간이 끝났어요. 풀이를 확인해 보세요.",explain:"풀이 방법",result:"게임 종료!",again:"다시 시작",answered:"푼 문제",correctCount:"정답",accuracy:"정답률",language:"🇳🇿",timerEasy:"쉬움 · 15초",timerMedium:"보통 · 10초",timerHard:"어려움 · 6초",sec:"초",versionLatest:"You’re using the latest version.",versionOld:"Update available: v",versionChecking:"Checking for updates...",versionUnknown:"Unable to check for updates."},
 en:{year:"Choose year",category:"Learning area",all:"Mixed topics",number:"Number",algebra:"Algebra & patterns",measure:"Measurement",geometry:"Geometry & space",statistics:"Statistics & data",probability:"Probability",mode:"Game mode",start:"Start",normal:"Normal mode",speed:"Speed mode",timerDifficulty:"Timer difficulty",timerHint:"Timer difficulty is separate from maths question difficulty.",help:"Normal: 10 questions · Speed: unlimited",progress:"Question",score:"Score",time:"Time left",adjustTitle:"Adjust next question difficulty",adjustHint:"Your current question stays the same. This applies to the next one.",easy:"Easy",medium:"Medium",hard:"Hard",pause:"Pause timer",next:"Next question",resume:"Resume",pauseText:"⏸ Timer paused",pauseHint:"The question stays visible. You can keep solving it.",exit:"Quit",question:"Solve this question!",correct:"Correct! 🎉",wrong:"The answer is ",timeout:"Time is up. Take a look at the solution.",explain:"How to solve",result:"Game over!",again:"Play again",answered:"Questions answered",correctCount:"Correct",accuracy:"Accuracy",language:"🇰🇷",timerEasy:"Easy · 15s",timerMedium:"Medium · 10s",timerHard:"Hard · 6s",sec:" seconds",versionLatest:"최신 버전입니다.",versionOld:"새 버전이 있어요: v",versionChecking:"최신 버전 확인 중...",versionUnknown:"최신 버전을 확인할 수 없습니다."}
};
const strands=["number","algebra","measure","geometry","statistics","probability"];
const bank={
1:[
["number","4 + 3 = ?",7,[6,7,8,9],"4개에 3개를 더하면 7개예요.","Add 4 and 3 to get 7."],
["number","10 − 4 = ?",6,[5,6,7,8],"10개에서 4개를 빼면 6개예요.","Subtract 4 from 10 to get 6."],
["algebra","2, 4, 6, ? 다음 수는?",8,[7,8,9,10],"매번 2씩 커져요. 다음 수는 8이에요.","The pattern increases by 2. The next number is 8."],
["measure","1주일은 며칠인가요?",7,[5,6,7,8],"1주일은 7일이에요.","There are 7 days in a week."],
["geometry","삼각형의 변은 몇 개인가요?",3,[2,3,4,5],"삼각형은 변이 3개예요.","A triangle has 3 sides."],
["statistics","그림그래프는 무엇을 보여주나요?","자료의 수","시간","자료의 수",["시간","자료의 수","온도","거리"],"그림그래프는 자료의 개수를 그림으로 나타내요.","A picture graph shows quantities using pictures."],
["probability","동전을 던져 앞면이 나올 가능성은?","반반","불가능","가능성이 높음",["불가능","반반","확실함","가능성이 높음"],"공정한 동전은 앞면과 뒷면의 가능성이 같아요.","A fair coin has an even chance of heads or tails."]
],
2:[
["number","28 + 15 = ?",43,[41,42,43,44],"28+10=38, 여기에 5를 더하면 43이에요.","28 + 10 = 38, then add 5 to get 43."],
["number","6 × 4 = ?",24,[20,22,24,26],"6을 4번 더하면 24예요.","6 added 4 times equals 24."],
["algebra","5, 10, 15, ? 다음 수는?",20,[18,20,22,25],"매번 5씩 더해요.","Add 5 each time."],
["measure","1m는 몇 cm인가요?",100,[10,50,100,1000],"1m는 100cm예요.","1 metre equals 100 centimetres."],
["geometry","정사각형의 변은 몇 개인가요?",4,[3,4,5,6],"정사각형은 변이 4개예요.","A square has 4 sides."],
["statistics","자료 2, 3, 3, 4에서 가장 자주 나오는 수는?",3,[2,3,4,5],"3이 두 번 나와 가장 자주 나타나요.","3 appears most often."],
["probability","주사위에서 1부터 6 중 하나가 나올 가능성은?","확실함","불가능","가능성이 낮음",["불가능","가능성이 낮음","확실함","반반"],"일반 주사위는 1~6 중 하나가 반드시 나와요.","A standard die must land on a number from 1 to 6."]
],
3:[
["number","125 + 236 = ?",361,[351,361,371,381],"125+200=325, 36을 더하면 361이에요.","125 + 200 = 325; add 36 to get 361."],
["number","12 × 8 = ?",96,[86,92,96,108],"10×8=80, 2×8=16, 합은 96이에요.","10 × 8 = 80 and 2 × 8 = 16; total 96."],
["algebra","3, 6, 9, 12, ? 다음 수는?",15,[14,15,16,18],"3씩 커지는 수열이에요.","The sequence increases by 3."],
["measure","2m는 몇 cm인가요?",200,[20,100,200,2000],"2×100=200cm예요.","2 metres equals 200 centimetres."],
["geometry","직각은 몇 도인가요?",90,[45,60,90,180],"직각은 90도예요.","A right angle is 90 degrees."],
["statistics","막대그래프에서 가장 높은 막대는 무엇을 뜻하나요?","가장 큰 값","가장 작은 값","가장 큰 값",["가장 작은 값","가장 큰 값","평균","합계"],"가장 높은 막대가 가장 큰 값을 나타내요.","The tallest bar represents the greatest value."],
["probability","빨간 공 3개, 파란 공 1개. 빨간 공이 더 나올 가능성은?","가능성이 높음","반반","불가능","가능성이 높음",["불가능","반반","가능성이 높음","확실함"],"4개 중 3개가 빨간색이라 빨간 공이 더 가능성이 높아요.","Three of the four balls are red, so red is more likely."]
],
4:[
["number","25 × 16 = ?",400,[350,375,400,425],"25×(10+6)=250+150=400이에요.","25 × (10 + 6) = 250 + 150 = 400."],
["number","360 ÷ 9 = ?",40,[30,35,40,45],"9×40=360이므로 답은 40이에요.","9 × 40 = 360."],
["algebra","4, 7, 10, 13, ? 다음 수는?",16,[15,16,17,18],"공차가 3인 규칙이에요.","The sequence increases by 3."],
["measure","직사각형 가로 6cm, 세로 4cm. 넓이는?",24,[20,22,24,28],"넓이는 가로×세로, 6×4=24cm²예요.","Area = length × width = 6 × 4 = 24 cm²."],
["geometry","삼각형의 내각의 합은?",180,[90,120,180,360],"삼각형의 세 내각의 합은 180도예요.","The interior angles of a triangle total 180°."],
["statistics","자료 2, 4, 6의 평균은?",4,[3,4,5,6],"2+4+6=12, 12÷3=4예요.","2 + 4 + 6 = 12; divide by 3 to get 4."],
["probability","공정한 동전에서 앞면이 나올 확률은?","1/2","1/4","1/2",["1/4","1/2","3/4","1"],"앞면과 뒷면 두 결과가 똑같이 가능하므로 1/2예요.","There are two equally likely outcomes, so the chance is 1/2."]
],
5:[
["number","35% of 200 = ?",70,[60,65,70,75],"10%는 20, 30%는 60, 5%는 10이므로 70이에요.","10% is 20; 30% is 60 and 5% is 10. Total 70."],
["number","2.4 × 5 = ?",12,[10,11,12,14],"24×5=120, 소수점 한 자리를 적용하면 12예요.","24 × 5 = 120, then place one decimal digit: 12."],
["algebra","2, 5, 8, 11, ? 다음 수는?",14,[12,13,14,15],"매번 3씩 더해요.","Add 3 each time."],
["measure","3.5km는 몇 m인가요?",3500,[350,3500,35000,35],"1km=1000m이므로 3.5×1000=3500m예요.","1 km = 1,000 m, so 3.5 km = 3,500 m."],
["geometry","직각보다 크고 180°보다 작은 각은?","둔각","예각","둔각",["예각","직각","둔각","평각"],"90°보다 크고 180°보다 작은 각은 둔각이에요.","An obtuse angle is greater than 90° and less than 180°."],
["statistics","자료 4, 6, 8, 10의 평균은?",7,[6,7,8,9],"합계 28을 4로 나누면 7이에요.","The sum is 28; divide by 4 to get 7."],
["probability","주사위에서 짝수가 나올 확률은?","1/2","1/3","1/2",["1/6","1/3","1/2","2/3"],"짝수는 2, 4, 6 세 개이므로 3/6=1/2예요.","Three of six outcomes are even, so 3/6 = 1/2."]
],
6:[
["number","15% of 240 = ?",36,[30,34,36,40],"10%는 24, 5%는 12이므로 36이에요.","10% is 24 and 5% is 12, giving 36."],
["number","3/5 + 1/4 = ?","17/20",["15/20","16/20","17/20","18/20"],"12/20+5/20=17/20이에요.","Convert to twentieths: 12/20 + 5/20 = 17/20."],
["algebra","2, 6, 18, 54, ? 다음 수는?",162,[108,144,162,216],"매번 3을 곱하는 규칙이에요.","Multiply by 3 each time."],
["measure","삼각형 밑변 8cm, 높이 5cm. 넓이는?",20,[18,20,24,40],"넓이=밑변×높이÷2=8×5÷2=20cm²예요.","Area = base × height ÷ 2 = 8 × 5 ÷ 2 = 20 cm²."],
["geometry","정육면체의 면은 몇 개인가요?",6,[4,5,6,8],"정육면체는 정사각형 면이 6개예요.","A cube has 6 square faces."],
["statistics","자료 3, 5, 7, 9, 11의 중앙값은?",7,[5,7,8,9],"정렬된 자료의 가운데 값은 7이에요.","The middle value in the ordered data is 7."],
["probability","주머니에 빨간 2개, 파란 2개. 파란 공 확률은?","1/2","1/4","1/2",["1/4","1/2","3/4","1"],"파란 공 2개/전체 4개이므로 2/4=1/2예요.","Two blue out of four total gives 2/4 = 1/2."]
]};
let lang="ko",mode="normal",timerLevel=1,questionLevel=1,score=0,answered=0,correct=0,queue=[],current=null,locked=false,paused=false,remaining=0,deadline=0,tick=null,nextTimer=null,audio=null,selected="all";
const tr=k=>i18n[lang][k]||k, label=s=>tr(s);

const APP_VERSION="2.3.5";
function compareVersions(a,b){const x=String(a).split(".").map(Number),y=String(b).split(".").map(Number);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d;}return 0;}
async function checkLatestVersion(){const badge=document.querySelector(".app-version");if(badge)badge.textContent="v"+APP_VERSION;const el=$("versionStatus");if(!el)return;el.textContent=tr("versionChecking");try{const response=await fetch("version.json?check="+Date.now(),{cache:"no-store"});if(!response.ok)throw new Error("version check failed");const data=await response.json();el.textContent=compareVersions(APP_VERSION,data.version)>=0?tr("versionLatest"):tr("versionOld")+data.version;}catch(e){el.textContent=tr("versionUnknown");}}
function updateText(){
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;el.textContent=tr(key)});
 $("langBtn").textContent=tr("language");$("langBtn").setAttribute("aria-label",lang==="ko"?"Switch to English":"한국어로 변경");$("langBtn").title=lang==="ko"?"Switch to English":"한국어로 변경";$("normalBtn").textContent=tr("normal");$("speedBtn").textContent=tr("speed");
 $("startBtn").textContent=tr("start");$("pauseBtn").textContent=tr("pause");$("resumeBtn").textContent=tr("resume");$("exitBtn").textContent=tr("exit");$("againBtn").textContent=tr("again");$("nextBtn").textContent=tr("next");
 $("easier").textContent=lang==="ko"?"더 쉽게":"Easier";$("harder").textContent=lang==="ko"?"더 어렵게":"Harder";
 document.querySelectorAll("[data-time]").forEach(b=>{const n=+b.dataset.time;b.textContent=tr(["timerEasy","timerMedium","timerHard"][n]);b.classList.toggle("primary",n===timerLevel);});
 updateDifficulty();
}
function updateDifficulty(){$("easier").disabled=questionLevel===0;$("harder").disabled=questionLevel===2;}
function setMode(m){mode=m;$("normalBtn").classList.toggle("primary",m==="normal");$("speedBtn").classList.toggle("primary",m==="speed");$("timerSettings").classList.toggle("hidden",m!=="speed");}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function buildQueue(){const year=+$("year").value;selected=$("category").value;const data=bank[year].filter(x=>selected==="all"||x[0]===selected);queue=shuffle(data);if(mode==="speed"&&queue.length)queue=queue.concat(shuffle(data));}
function nextQ(){if(!queue.length){finish();return;}if(mode==="speed"&&answered>=queue.length){queue=shuffle(queue);}if(mode==="normal"&&answered>=10){finish();return;}if(mode==="speed"&&answered>0&&answered%queue.length===0)queue=shuffle(queue);const item=queue[answered%queue.length];current=makeQuestion(item,bank[+$("year").value].indexOf(item));renderQuestion();}
const englishBank={
1:[
["What is 4 + 3?",7,[6,7,8,9],"Add 4 and 3 to get 7."],
["What is 10 − 4?",6,[5,6,7,8],"Subtract 4 from 10 to get 6."],
"What number comes next: 2, 4, 6, ?|8|7,8,9,10|The pattern increases by 2, so the next number is 8.",
"How many days are in one week?|7|5,6,7,8|There are 7 days in a week.",
"How many sides does a triangle have?|3|2,3,4,5|A triangle has 3 sides.",
"What does a picture graph show?|Number of items|Time,Number of items,Temperature,Distance|A picture graph shows quantities using pictures.",
"What is the chance of getting heads when you toss a fair coin?|Even chance|Impossible,Even chance,Certain,Likely|A fair coin has an even chance of heads or tails."
],
2:[
"What is 28 + 15?|43|41,42,43,44|28 + 10 = 38, then add 5 to get 43.",
"What is 6 × 4?|24|20,22,24,26|6 added 4 times equals 24.",
"What number comes next: 5, 10, 15, ?|20|18,20,22,25|Add 5 each time.",
"How many centimetres are in 1 metre?|100|10,50,100,1000|1 metre equals 100 centimetres.",
"How many sides does a square have?|4|3,4,5,6|A square has 4 sides.",
"Which number appears most often: 2, 3, 3, 4?|3|2,3,4,5|3 appears twice, more than any other number.",
"On a standard die, what is the chance of rolling a number from 1 to 6?|Certain|Impossible,Unlikely,Certain,Even chance|A standard die must land on a number from 1 to 6."
],
3:[
"What is 125 + 236?|361|351,361,371,381|125 + 200 = 325; add 36 to get 361.",
"What is 12 × 8?|96|86,92,96,108|10 × 8 = 80 and 2 × 8 = 16; total 96.",
"What number comes next: 3, 6, 9, 12, ?|15|14,15,16,18|The sequence increases by 3.",
"How many centimetres are in 2 metres?|200|20,100,200,2000|2 metres equals 200 centimetres.",
"How many degrees are in a right angle?|90|45,60,90,180|A right angle is 90 degrees.",
"What does the tallest bar on a bar graph represent?|The greatest value|The smallest value,The greatest value,The average,The total|The tallest bar represents the greatest value.",
"There are 3 red balls and 1 blue ball. Which colour is more likely?|Red is more likely|Impossible,Even chance,Red is more likely,Certain|Three of the four balls are red, so red is more likely."
],
4:[
"What is 25 × 16?|400|350,375,400,425|25 × (10 + 6) = 250 + 150 = 400.",
"What is 360 ÷ 9?|40|30,35,40,45|9 × 40 = 360.",
"What number comes next: 4, 7, 10, 13, ?|16|15,16,17,18|The sequence increases by 3.",
"A rectangle is 6 cm long and 4 cm wide. What is its area?|24|20,22,24,28|Area = length × width = 6 × 4 = 24 cm².",
"What is the sum of the interior angles of a triangle?|180|90,120,180,360|The interior angles of a triangle total 180°.",
"What is the mean of 2, 4 and 6?|4|3,4,5,6|2 + 4 + 6 = 12; divide by 3 to get 4.",
"What is the probability of heads on a fair coin?|1/2|1/4,1/2,3/4,1|There are two equally likely outcomes, so the chance is 1/2."
],
5:[
"What is 35% of 200?|70|60,65,70,75|10% is 20; 30% is 60 and 5% is 10. Total 70.",
"What is 2.4 × 5?|12|10,11,12,14|24 × 5 = 120, then place one decimal digit: 12.",
"What number comes next: 2, 5, 8, 11, ?|14|12,13,14,15|Add 3 each time.",
"How many metres are in 3.5 kilometres?|3500|350,3500,35000,35|1 km = 1,000 m, so 3.5 km = 3,500 m.",
"What do we call an angle greater than 90° and less than 180°?|Obtuse angle|Acute angle,Right angle,Obtuse angle,Straight angle|An obtuse angle is greater than 90° and less than 180°.",
"What is the mean of 4, 6, 8 and 10?|7|6,7,8,9|The sum is 28; divide by 4 to get 7.",
"What is the probability of rolling an even number on a fair die?|1/2|1/6,1/3,1/2,2/3|Three of six outcomes are even, so 3/6 = 1/2."
],
6:[
"What is 15% of 240?|36|30,34,36,40|10% is 24 and 5% is 12, giving 36.",
"What is 3/5 + 1/4?|17/20|15/20,16/20,17/20,18/20|Convert to twentieths: 12/20 + 5/20 = 17/20.",
"What number comes next: 2, 6, 18, 54, ?|162|108,144,162,216|Multiply by 3 each time.",
"A triangle has a base of 8 cm and a height of 5 cm. What is its area?|20|18,20,24,40|Area = base × height ÷ 2 = 8 × 5 ÷ 2 = 20 cm².",
"How many faces does a cube have?|6|4,5,6,8|A cube has 6 square faces.",
"What is the median of 3, 5, 7, 9, 11?|7|5,7,8,9|The middle value in the ordered data is 7.",
"A bag has 2 red balls and 2 blue balls. What is the probability of picking a blue ball?|1/2|1/4,1/2,3/4,1|Two blue balls out of four total gives 2/4 = 1/2."
]};
function makeQuestion(item,index){
 const [s,qko]=item;let a,opts,eko,een;
 if(item.length>=8){a=item[4];opts=item[5];eko=item[6];een=item[7];}
 else{a=item[2];opts=item[3];eko=item[4];een=item[5];}
 if(!Array.isArray(opts))opts=[a];
 opts=[...new Set(opts)];if(!opts.some(x=>String(x)===String(a)))opts.unshift(a);
 const en=englishBank[+$("year").value][index];
 let qen=qko,answerEn=a,optsEn=opts,eenText=een;
 if(en){if(typeof en==="string"){const p=en.split("|");qen=p[0];answerEn=p[1];optsEn=p[2].split(",");eenText=p[3];}else{[qen,answerEn,optsEn,eenText]=en;}}
 return {s,qko,qen,a,answerEn,opts,optsEn,eko,een,eenText};
}
function renderQuestion(){
 locked=false;$("feedback").classList.add("hidden");$("nextBtn").disabled=true;$("question").textContent=lang==="ko"?current.qko:current.qen;$("strandName").textContent=tr(current.s);
 $("progress").textContent=mode==="speed"?answered+1:`${answered+1} / 10`;$("choices").innerHTML="";
 const shownOpts=lang==="ko"?current.opts:current.optsEn;shuffle(shownOpts).forEach(opt=>{const b=document.createElement("button");b.className="choice";b.textContent=opt;b.addEventListener("click",()=>answer(opt,b,false));$("choices").append(b);});
 if(mode==="speed"&&!paused)startClock([15,10,6][timerLevel]);
}
function startClock(sec){clearInterval(tick);remaining=sec;deadline=Date.now()+sec*1000;$("timer").textContent=sec;$("timerFill").style.width="100%";tick=setInterval(()=>{if(paused||locked)return;const ms=Math.max(0,deadline-Date.now()),left=Math.ceil(ms/1000);$("timer").textContent=left;$("timerFill").style.width=(ms/(sec*1000)*100)+"%";if(left<=3&&left>0&&left!==remaining){remaining=left;tone(880,.15,.14);}if(ms<=0){clearInterval(tick);tone(180,.8,.22);answer(null,null,true);}},60);}
function tone(freq,duration,volume){try{if(!audio)return;if(audio.state==="suspended")audio.resume();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.02);}catch(e){}}
function initAudio(){try{const C=window.AudioContext||window.webkitAudioContext;if(C){audio=audio||new C();if(audio.state==="suspended")audio.resume();}}catch(e){}}
function adjustDifficulty(d){questionLevel=Math.max(0,Math.min(2,questionLevel+d));updateDifficulty();}
function answer(choice,button,timedOut){
 if(locked)return;locked=true;clearInterval(tick);answered++;const correctAnswer=lang==="ko"?current.a:current.answerEn;const right=choice!==null&&String(choice)===String(correctAnswer);
 if(right){score+=10;correct++;button?.classList.add("correct");}else button?.classList.add("wrong");
 [...$("choices").children].forEach(b=>{b.disabled=true;if(String(b.textContent)===String(correctAnswer))b.classList.add("correct");});
 $("score").textContent=score;$("progress").textContent=mode==="speed"?answered:`${answered} / 10`;
 const feedback=$("feedback");feedback.classList.remove("hidden");const explanation=lang==="ko"?current.eko:current.eenText;
 feedback.innerHTML=`<div class="feedback-title">${timedOut?"⏱ "+tr("timeout"):right?tr("correct"):tr("wrong")+current.a}</div><div class="solution"><b>${tr("explain")}: ${correctAnswer}</b><br>${explanation}</div>`;
 if(mode==="normal"){$("nextBtn").disabled=false;}else{nextTimer=setTimeout(()=>nextQ(),timedOut?6500:3500);}
}
function pause(){if(mode!=="speed"||paused||locked)return;paused=true;remaining=Math.max(1,Math.ceil((deadline-Date.now())/1000));clearInterval(tick);$("pauseBanner").classList.remove("hidden");$("pauseBtn").textContent=tr("resume");}
function resume(){if(!paused)return;paused=false;$("pauseBanner").classList.add("hidden");$("pauseBtn").textContent=tr("pause");if(!locked)startClock(remaining);}
function finish(){clearInterval(tick);clearTimeout(nextTimer);$("game").classList.add("hidden");$("result").classList.remove("hidden");$("finalScore").textContent=score+" pts";const pct=answered?Math.round(correct/answered*100):0;$("resultDetail").textContent=`${tr("answered")}: ${answered} · ${tr("correctCount")}: ${correct} · ${tr("accuracy")}: ${pct}%`;}
function start(){clearInterval(tick);clearTimeout(nextTimer);initAudio();score=answered=correct=0;paused=false;questionLevel=1;updateDifficulty();buildQueue();if(!queue.length)return;$("setup").classList.add("hidden");$("result").classList.add("hidden");$("game").classList.remove("hidden");$("pauseBanner").classList.add("hidden");$("pauseBtn").classList.toggle("hidden",mode!=="speed");$("timerBox").classList.toggle("hidden",mode!=="speed");$("timerBar").classList.toggle("hidden",mode!=="speed");$("adjustPanel").classList.toggle("hidden",mode!=="speed");$("nextBtn").classList.toggle("hidden",mode!=="normal");$("nextBtn").disabled=true;$("score").textContent=0;nextQ();}
function quit(){clearInterval(tick);clearTimeout(nextTimer);$("game").classList.add("hidden");$("setup").classList.remove("hidden");paused=false;}
$("langBtn").addEventListener("click",()=>{lang=lang==="ko"?"en":"ko";updateText();if(current){$("question").textContent=lang==="ko"?current.qko:current.qen;$("strandName").textContent=tr(current.s);const old=[...$("choices").children].map(b=>b.textContent);const target=lang==="ko"?current.opts:current.optsEn;$("choices").innerHTML="";shuffle(target).forEach(opt=>{const b=document.createElement("button");b.className="choice";b.textContent=opt;b.disabled=locked;if(locked&&String(opt)==String(lang==="ko"?current.a:current.answerEn))b.classList.add("correct");b.addEventListener("click",()=>answer(opt,b,false));$("choices").append(b);});if(locked){const ex=lang==="ko"?current.eko:current.eenText;$("feedback").innerHTML=`<div class="feedback-title">${tr("explain")}: ${lang==="ko"?current.a:current.answerEn}</div><div class="solution">${ex}</div>`;}}});
$("normalBtn").addEventListener("click",()=>setMode("normal"));$("speedBtn").addEventListener("click",()=>setMode("speed"));
document.querySelectorAll("[data-time]").forEach(b=>b.addEventListener("click",()=>{timerLevel=+b.dataset.time;updateText();}));
$("easier").addEventListener("click",()=>adjustDifficulty(-1));$("harder").addEventListener("click",()=>adjustDifficulty(1));
$("startBtn").addEventListener("click",start);$("nextBtn").addEventListener("click",()=>{if(mode!=="normal"||!locked)return;clearTimeout(nextTimer);if(answered>=10)finish();else nextQ();});$("pauseBtn").addEventListener("click",()=>paused?resume():pause());$("resumeBtn").addEventListener("click",resume);$("exitBtn").addEventListener("click",quit);$("againBtn").addEventListener("click",()=>{$("result").classList.add("hidden");$("setup").classList.remove("hidden");});
setMode("normal");updateText();checkLatestVersion();
})();