/* ===================== لعبة طلال — Talal Game ===================== */
document.getElementById('mascotImg').src = 'assets/images/talal.PNG';

/* ---------- CyberChef deep links ---------- */
/* Format: https://gchq.github.io/CyberChef/#recipe=Operation()&input=<base64> */
const CC_RECIPE = {
  morse : "From_Morse_Code('Space','Forward slash')",
  hex   : "From_Hex('Space')",
  base32: "From_Base32('A-Z2-7=',true)",
  base64: "From_Base64('A-Za-z0-9+/=',true,false)"
};
// UTF-8 safe base64 for the input parameter
function b64utf8(str){
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}
function cyberChefLink(kind, encoded){
  const recipe = encodeURIComponent(CC_RECIPE[kind]);
  const input  = encodeURIComponent(b64utf8(encoded));
  return `https://gchq.github.io/CyberChef/#recipe=${recipe}&input=${input}`;
}

/* ---------- challenge data (4 ciphers × 3 levels = 12) ---------- */
const CHALLENGES = {
  morse:{
    title:"شفرة مورس",
    desc:"شفرة مورس تمثّل كل حرف بسلسلة من النقاط والشرطات. المسافة تفصل بين الحروف، والشرطة المائلة ( / ) تفصل بين الكلمات.",
    ref:()=>refTable(MORSE_MAP, "الحرف", "الرمز"),
    levels:[
      {encoded:"-- . - .-. --- -. --- -- .", answer:"METRONOME", hint:"ما فيه هنت لا هنت !"},
      {encoded:"- .. - / ..-. --- .-. / - .- -", answer:"Tit for tat", hint:"ما فيه هنت لا هنت !"},
      {encoded:".. -.-. . -- .- -.", answer:"ICEMAN", hint:"ما فيه هنت لا هنت !"}
    ]
  },
  hex:{
    title:"الترميز الست عشري (Hex)",
    desc:"الترميز الست عشري يمثّل كل بايت برقمين من ٠ إلى ٩ ومن A إلى F. الحروف العربية تُكتب بترميز UTF-8، أي بايتين لكل حرف.",
    ref:()=>hexRef(),
    levels:[
      {encoded:"d8 a7 d9 82 d8 b9 d8 af d9 8a 20 d9 85 d9 83 d8 a7 d9 86 d8 b3", answer:"اقعدي مكانس", hint:"ما فيه هنت لا هنت !."},
      {encoded:"d9 85 d9 85 d8 b4 d9 88 d9 88 d9 88 d9 88 d9 82", answer:"ممشووووق", hint:"ما فيه هنت لا هنت !"},
      {encoded:"d8 a7 d8 af d8 b1 d9 8a 20 d8 a7 d8 af d8 b1 d9 8a 20 d8 a7 d8 af d8 b1 d9 8a 20", answer:"  ادري ادري ادري ", hint:"ما فيه هنت لا هنت !ء."}
    ]
  },
  base32:{
    title:"ترميز Base32",
    desc:"ترميز Base32 يحوّل البيانات إلى ٣٢ رمزًا فقط: الحروف من A إلى Z والأرقام من ٢ إلى ٧، مع علامة = للحشو.",
    ref:null,
    levels:[
      {encoded:"KBHVEQ2IIVJQ====", answer:" PORCHES", hint:" ما فيه هنت لا هنت !."},
      {encoded:"3GC5TBOZQPMYMIGYVLMLHWMI3GFNTBRA3CY5RLGZRLMYVWMK3GFNTBJA3C45RNGYU7MYMIGYVLMYDWFR3CW5TCWZQYQNTAWZQTMKRWMK", answer:"ممكن تسوين رجييييم عشان تفرحين قلبي", hint:"ما فيه هنت لا هنت!."},
      {encoded:"3CWNROOZQTMYVWFTEDMKPWME3CVNTCGZQHMYVWMC", answer:"جعليس التوفيق ", hint:"كلمتان — شيء مجهول المحتوى."}
    ]
  },
  base64:{
    title:"ترميز Base64",
    desc:"ترميز Base64 يحوّل البيانات إلى نص مقروء باستخدام ٦٤ رمزًا: A–Z و a–z و ٠–٩ بالإضافة إلى + و /.",
    ref:null,
    levels:[
      {encoded:"UE9SQ0VMQUlO", answer:"PORCELAIN", hint:"ما فيه هنت لا هنت !"},
      {encoded:"Qm9yZGVybGluZQ==", answer:"Borderline", hint:"ما فيه هنت لا هنت !"},
      {encoded:"2YrYpyDZhdix2K3YqNinINio2LbZitmI2YHZhtinINmI2KfZhNmF2LnYp9iy2YrZhSDYp9i52K/Yp9ivINmF2Kcg2K7YtyDYp9mE2YLZhNmFINmB2Yog2YPYqtin2KjYqQ==", answer:"يا مرحبا بضيوفنا والمعازيم اعداد ما خط القلم في كتابة ", hint:"ما فيه هنت لا هنت !"}
    ]
  }
};
const ORDER = ["morse","hex","base32","base64"];

/* ---------- memes game ----------
   نوعان من الأسئلة:
   • type:"video" → «كمّل الميم»: مقطع السؤال يتوقف تلقائيًا عند stopAt (بالثواني)،
     وعند كشف الإجابة يُشغَّل المقطع كاملًا. media و full نفس الملف.
   • type:"image" → «إيش الميم؟»: تُعرض صورة، وعند كشف الإجابة يُشغَّل مقطع الميم.
   choices: ٣ خيارات للتلميح | answer: رقم الخيار الصحيح (يبدأ من 0)
   لتعديل أي سؤال أو خيار، عدّل هنا مباشرة. */
const MEMES = [
  {id:"q1", title:"السؤال ١", media:"assets/videos/q1.mp4", type:"video",
   full:"assets/videos/q1.mp4", stopAt:9,
   choices:["وش وش وش مين انت يا بابا    ","وش وش وش تخسيييي يا بابا       ","وش وش وش انقلععع يا بابا"], answer:1},
  {id:"q2", title:"السؤال ٢", media:"assets/images/q2.png", type:"image",
   full:"assets/videos/answer2.mp4",
   choices:["وسمعتي شنو قالت المينونه و انتييييي خذيتهياا ا ا بهزؤ خذيتيها بطنازه","وسمعتوا شنو قالت المرة ،و هالمبدأ خطأ ،لكن انتييييي خذيتهياا ا ا بهزؤ خذيتيها بطنازه","وسمعتي شنو قالت المرة ،وعلى هالمبدأ تكلمي ،لكن انتييييي خذيتهياا ا ا بهزؤ خذيتيها بطنازه"], answer:2},
  {id:"q3", title:"السؤال ٣", media:"assets/videos/q3.mp4", type:"video",
   full:"assets/videos/q3.mp4", stopAt:8,
   choices:["بق بق بقيييق؟","انا احس الملكة اقوي؟","اهي مو الامبراطورة اقوى من الملكة؟"], answer:2},
  {id:"q4", title:"السؤال ٤", media:"assets/videos/q4.mp4", type:"video",
   full:"assets/videos/q4.mp4", stopAt:33, prompt:"ايش اسم المسلسل؟",
   choices:["عديل الروح","الامبراطورة","امنا رويحه الجنه"], answer:1},
  {id:"q5", title:"السؤال ٥", media:"assets/images/q5.png", type:"image",
   full:"assets/videos/answer5.mp4",
   choices:["مرييم وين ريلج ، يعني شبي فيه؟","انا ملاك الويتيه ما عندي شخصية","اقوى شييي انا اقوى شي"], answer:0},
  {id:"q6", title:"السؤال ٦", media:"assets/videos/q6.mp4", type:"video",
   full:"assets/videos/q6.mp4", stopAt:11.5,
   choices:["والله لا ابلغ عليكم","والله لاوقف عنكم المعاش","والله لاوقف في ساحه الارادة"], answer:2},
  {id:"q7", title:"السؤال ٧", media:"assets/videos/q7.mp4", type:"video",
   full:"assets/videos/q7.mp4", stopAt:3,
   choices:["يا لجييييه يااا احسس","يا فعليًا يا احسسس","يا حرفيًا يا فعليًا يا احسسس"], answer:2},
  {id:"q8", title:"السؤال ٨", media:"assets/videos/q8.mp4", type:"video",
   full:"assets/videos/q8.mp4", stopAt:23, prompt:"ايش قالت اللي ورى مداخله؟",
   choices:["لاااا كذابه كذابه محترقق قلبها","لاااا صادقه ذيييه","لا كذابهه ما تبييه "], answer:0},
  {id:"q9", title:"السؤال ٩", media:"assets/videos/q9.mp4", type:"video",
   full:"assets/videos/q9.mp4", stopAt:1.5,
   choices:["ابك والله انه مكاني والله ما اتحرك ابك والله ما اتحرك","ابك والله ما اتحرك ابك والله ما اتحررك","ابك والله ما اتحرك هذا مكاني"], answer:1},
  {id:"q10", title:"السؤال ١٠", media:"assets/videos/q10.mp4", type:"video",
   full:"assets/videos/q10.mp4", stopAt:2,
   choices:["يا ليل الثوااارررره","يالييل الزقققاققه","يا ليييل الليللل"], answer:1},
  {id:"q11", title:"السؤال ١١", media:"assets/images/q11.png", type:"image",
   full:"assets/videos/q11.mov",
   choices:["!!!","!!!","!!!"], answer:0},
  {id:"q12", title:"السؤال ١٢", media:"assets/videos/q12.mp4", type:"video",
   full:"assets/videos/q12.mp4", stopAt:3,
   choices:["ززززق","خررررى","ناااااااار"], answer:0},
  {id:"bonus1", title:"بونس ١", media:"assets/videos/Bonus1.mp4", type:"video",
   full:"assets/videos/Bonus1.mp4", stopAt:4,prompt:"كمل السالفه",
   choices:["احمد؟مادري،زين زين","زين زين زين زين","احمد؟الشاليه، زين ،زين"], answer:2},
  {id:"bonus2", title:"بونس ٢", media:"assets/videos/Bonus2.mp4", type:"video",
   full:"assets/videos/Bonus2.mp4", stopAt:4,
   choices:["انتي سمييينه انحفي بروحج","يعني انتي مسويه دايت وتبين الناس كلهم نفسج","روحي موتي"], answer:1},
  {id:"bonus3", title:"بونس ٣", media:"assets/videos/Bonus3.mp4", type:"video",
   full:"assets/videos/Bonus3.mp4", stopAt:7, prompt:"ليه عصب عليها؟",
   choices:["تتهاوش معه","يبي توضح له السؤال","لانها تضحك"], answer:1}
];

/* ---------- reference tables ---------- */
const MORSE_MAP={
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",
  K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",
  U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----."
};
const BASE32_MAP=(()=>{const o={};"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("").forEach((c,i)=>o[i]=c);return o;})();
const BASE64_MAP=(()=>{const o={};"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach((c,i)=>o[i]=c);return o;})();

function refTable(map, colA, colB){
  const keys=Object.keys(map);
  let rows="";
  for(let i=0;i<keys.length;i+=2){
    const k1=keys[i],k2=keys[i+1];
    rows+=`<tr><td>${k1}</td><td>${map[k1]}</td>`
        + (k2!==undefined?`<td>${k2}</td><td>${map[k2]}</td>`:`<td></td><td></td>`)
        + `</tr>`;
  }
  return `<div class="ref-note">الجدول الكامل: ${colA} ← ${colB}</div><table class="ref-2up">${rows}</table>`;
}
function hexRef(){
  // full 0-F table plus the Arabic UTF-8 byte guide
  const H={};
  "0123456789ABCDEF".split("").forEach((c,i)=>{H[c]=String(i);});
  let rows="";
  const keys=Object.keys(H);
  for(let i=0;i<keys.length;i+=2){
    const k1=keys[i],k2=keys[i+1];
    rows+=`<tr><td>${k1}</td><td>= ${H[k1]}</td><td>${k2}</td><td>= ${H[k2]}</td></tr>`;
  }
  const ar="ا,D8 A7|ب,D8 A8|ت,D8 AA|ث,D8 AB|ج,D8 AC|ح,D8 AD|خ,D8 AE|د,D8 AF|ذ,D8 B0|ر,D8 B1|ز,D8 B2|س,D8 B3|ش,D8 B4|ص,D8 B5|ض,D8 B6|ط,D8 B7|ظ,D8 B8|ع,D8 B9|غ,D8 BA|ف,D9 81|ق,D9 82|ك,D9 83|ل,D9 84|م,D9 85|ن,D9 86|ه,D9 87|و,D9 88|ي,D9 8A|ة,D8 A9|ى,D9 89|ء,D8 A1|آ,D8 A2|أ,D8 A3|إ,D8 A5|مسافة,20";
  const pairs=ar.split("|").map(s=>s.split(","));
  let arRows="";
  for(let i=0;i<pairs.length;i+=2){
    const p1=pairs[i],p2=pairs[i+1];
    arRows+=`<tr><td>${p1[0]}</td><td>${p1[1]}</td>`
          + (p2?`<td>${p2[0]}</td><td>${p2[1]}</td>`:`<td></td><td></td>`)+`</tr>`;
  }
  return `<div class="ref-note">القيم الست عشرية: ٠–٩ ثم A–F تساوي ١٠–١٥</div>
    <table class="ref-2up">${rows}</table>
    <div class="ref-note" style="margin-top:10px">جدول الحروف العربية بترميز UTF-8 (بايتان لكل حرف)</div>
    <table class="ref-2up">${arRows}</table>`;
}

/* ---------- state ---------- */
const LS_PLAYERS="talalGame.players", LS_SOLVED="talalGame.solved";
let players = load(LS_PLAYERS, []);
let solved  = load(LS_SOLVED, {});
function load(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v??d;}catch(e){return d;}}
function save(){
  try{
    localStorage.setItem(LS_PLAYERS,JSON.stringify(players));
    localStorage.setItem(LS_SOLVED,JSON.stringify(solved));
  }catch(e){console.warn("تعذّر الحفظ محليًا",e);}
}

/* ---------- mascot ---------- */
const mascot=document.getElementById('mascot');
let poseTimer=null;
function setPose(p,hold){
  mascot.setAttribute('data-pose',p);
  if(poseTimer)clearTimeout(poseTimer);
  if(hold){poseTimer=setTimeout(()=>mascot.setAttribute('data-pose','welcome'),hold);}
}

function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

/* ---------- render challenges ---------- */
function renderChallenges(){
  const root=document.getElementById('challenges');
  root.innerHTML="";
  ORDER.forEach(key=>{
    const cat=CHALLENGES[key];
    const sec=document.createElement('div');
    sec.className="cat";
    sec.innerHTML=`<div class="cat-title">${cat.title}</div><div class="cat-desc">${cat.desc}</div><div class="grid"></div>`;
    const grid=sec.querySelector('.grid');
    cat.levels.forEach((lv,i)=>{
      const id=`${key}-${i+1}`;
      const isSolved=!!solved[id];
      const card=document.createElement('div');
      card.className="card"+(isSolved?" solved":"");
      card.innerHTML=`
        <div class="lvl"><span>المستوى ${i+1}</span></div>
        <h3>${cat.title} — المستوى ${i+1}</h3>
        <div class="cdesc">${cat.desc}</div>
        <div class="encoded">${escapeHtml(lv.encoded)}</div>
        <a class="cyberchef" href="${cyberChefLink(key,lv.encoded)}" target="_blank" rel="noopener noreferrer">
          <span class="cc-icon">🔗</span> افتح في CyberChef لفك الشفرة
        </a>
        ${cat.ref?`<button class="ref-toggle" data-ref>◂ جدول التحويل</button>
        <div class="ref-box">${cat.ref()}</div>`:""}
        <div class="card-actions">
          <button class="btn btn-hint" data-hint>تلميح</button>
          <button class="btn btn-reveal" data-reveal>اضغط لعرض الإجابة</button>
        </div>
        <div class="solved-badge"><span class="check">✓</span> تم الحل</div>`;
      const refBtn=card.querySelector('[data-ref]');
      if(refBtn)refBtn.onclick=(e)=>{
        const box=card.querySelector('.ref-box');box.classList.toggle('open');
        e.target.textContent=(box.classList.contains('open')?"▾":"◂")+" جدول التحويل";
      };
      card.querySelector('[data-hint]').onclick=()=>{
        setPose('hint',5000);
        document.getElementById('hintChoices').innerHTML="";
        document.getElementById('hintText').textContent=lv.hint;
        openModal('hintModal');
      };
      card.querySelector('[data-reveal]').onclick=()=>revealAnswer(id,cat.title,i,lv.answer,card,null);
      grid.appendChild(card);
    });
    root.appendChild(sec);
  });
}

/* ---------- render memes ---------- */
function mediaBlock(src,type,label){
  const tag = type==='video'
    ? `<video src="${escapeHtml(src)}" controls preload="metadata"></video>`
    : `<img src="${escapeHtml(src)}" alt="${escapeHtml(label)}">`;
  return `${tag}
    <div class="meme-placeholder" style="display:none">
      <span class="ph-icon">🎬</span>
      لم يتم العثور على الملف بعد.<br>ضع ملفك هنا:<br><code>${escapeHtml(src)}</code>
    </div>`;
}
// swap to placeholder if the media file is missing
function wireMediaFallback(container){
  container.querySelectorAll('video,img').forEach(el=>{
    const ph=el.parentElement.querySelector('.meme-placeholder');
    const fail=()=>{el.style.display='none';if(ph)ph.style.display='block';};
    el.addEventListener('error',fail);
    if(el.tagName==='VIDEO'){
      // videos fire error on the element or on a source that can't load
      el.addEventListener('stalled',()=>{});
      setTimeout(()=>{if(el.readyState===0&&el.networkState===3)fail();},1200);
    }
  });
}

// question video is hard-capped at stopAt seconds: it pauses by itself and
// can never play or seek past it — the full clip only plays in the answer modal
function wireStopAt(container, stop){
  const v=container.querySelector('video');
  if(!v||!stop)return;
  let toasted=false;
  const cap=()=>{
    if(v.currentTime>=stop){
      v.pause();
      v.currentTime=stop;
      if(!toasted){toasted=true;toast("وقفنا هنا… كمّل الميم!");}
    }
  };
  v.addEventListener('timeupdate',cap);
  v.addEventListener('seeking',cap);
  v.addEventListener('play',()=>{if(v.currentTime>=stop)v.currentTime=0;});
}

function renderMemes(){
  const root=document.getElementById('memes');
  root.innerHTML="";
  MEMES.forEach((m,idx)=>{
    const id=`meme-${m.id}`;
    const isSolved=!!solved[id];
    const prompt=m.prompt||(m.type==='image'?'إيش الميم؟':'كمّل الميم');
    const card=document.createElement('div');
    card.className="card"+(isSolved?" solved":"");
    card.innerHTML=`
      <div class="lvl"><span>${m.id.startsWith('bonus')?'بونس':'ميم '+(idx+1)}</span></div>
      <h3>${escapeHtml(m.title)}</h3>
      <div class="meme-media">${mediaBlock(m.media,m.type,m.title)}</div>
      <div class="meme-prompt">${prompt}</div>
      <div class="card-actions">
        <button class="btn btn-hint" data-hint>تلميح (٣ خيارات)</button>
        <button class="btn btn-reveal" data-reveal>اضغط لعرض الإجابة</button>
      </div>
      <div class="solved-badge"><span class="check">✓</span> تم الحل</div>`;
    wireMediaFallback(card.querySelector('.meme-media'));
    wireStopAt(card.querySelector('.meme-media'),m.stopAt);
    card.querySelector('[data-hint]').onclick=()=>{
      setPose('hint',5000);
      document.getElementById('hintText').textContent="اختر الإجابة الصحيحة من بين الخيارات الثلاثة:";
      document.getElementById('hintChoices').innerHTML =
        m.choices.map((c,i)=>`<div class="choice">${String.fromCharCode(1633+i)} — ${escapeHtml(c)}</div>`).join("");
      openModal('hintModal');
    };
    card.querySelector('[data-reveal]').onclick=()=>{
      revealAnswer(id,"لعبة الميمز",idx,m.choices[m.answer],card,m.full);
      document.getElementById('answerSub').textContent=`لعبة الميمز — ${m.title}`;
    };
    root.appendChild(card);
  });
}

/* ---------- reveal + award ---------- */
function revealAnswer(id,catTitle,i,answer,card,fullMedia){
  setPose('happy',1200);
  document.getElementById('answerText').textContent=answer;
  document.getElementById('answerSub').textContent=`${catTitle} — المستوى ${i+1}`;
  const mediaBox=document.getElementById('answerMedia');
  if(fullMedia){
    mediaBox.innerHTML=`<video src="${escapeHtml(fullMedia)}" controls autoplay></video>
      <div class="meme-placeholder" style="display:none">
        <span class="ph-icon">🎬</span>لم يتم العثور على المقطع الكامل.<br>
        ضع ملفك هنا:<br><code>${escapeHtml(fullMedia)}</code></div>`;
    wireMediaFallback(mediaBox);
  }else{
    mediaBox.innerHTML="";
  }
  fillAwardSelect();
  openModal('answerModal');
  if(!solved[id]){solved[id]=true;card.classList.add('solved');save();}
}
function fillAwardSelect(){
  const sel=document.getElementById('awardSelect');
  const btn=document.getElementById('awardBtn');
  if(!players.length){
    sel.innerHTML='<option value="">لا يوجد لاعبون — أضف لاعبين أولًا</option>';
    sel.disabled=true;btn.disabled=true;return;
  }
  sel.disabled=false;btn.disabled=false;
  sel.innerHTML=players.map((p,idx)=>`<option value="${idx}">${escapeHtml(p.name)} — ${p.score} نقطة</option>`).join("");
}
document.getElementById('awardBtn').onclick=()=>{
  const idx=+document.getElementById('awardSelect').value;
  if(isNaN(idx)||!players[idx])return;
  players[idx].score++;save();renderPlayers();renderScoreboard();
  setPose('celebration',1400);burst();
  toast(`نقطة لـ ${players[idx].name}! +١`);
  stopModalMedia();closeModal('answerModal');
};
document.getElementById('noAnswerBtn').onclick=()=>{
  setPose('losing',2200);
  toast("لا أحد أجاب إجابة صحيحة.");
  stopModalMedia();closeModal('answerModal');
};
function stopModalMedia(){
  document.querySelectorAll('#answerMedia video').forEach(v=>{try{v.pause();}catch(e){}});
}

/* ---------- players ---------- */
function addPlayer(){
  const inp=document.getElementById('playerName');
  const name=inp.value.trim();
  if(!name)return;
  if(players.some(p=>p.name.toLowerCase()===name.toLowerCase())){toast("هذا اللاعب مُضاف مسبقًا.");return;}
  players.push({name,score:0});save();inp.value="";
  renderPlayers();renderScoreboard();
}
function renderPlayers(){
  const fc=document.getElementById('fabCount');if(fc)fc.textContent=players.length;
  const ul=document.getElementById('playersList');
  if(!players.length){ul.innerHTML='<li class="empty">لا يوجد لاعبون بعد. أضف لاعبين لبدء التسجيل.</li>';return;}
  ul.innerHTML="";
  players.forEach((p,idx)=>{
    const li=document.createElement('li');
    li.innerHTML=`<span class="pname">${escapeHtml(p.name)}</span>
      <span style="display:flex;align-items:center;gap:12px">
        <span class="pscore">${p.score} نقطة</span>
        <button class="pdel" title="حذف">✕</button>
      </span>`;
    li.querySelector('.pdel').onclick=()=>{players.splice(idx,1);save();renderPlayers();renderScoreboard();};
    ul.appendChild(li);
  });
}
function renderScoreboard(){
  const box=document.getElementById('scoreboard');
  if(!players.length){box.innerHTML='<div class="empty">ستظهر النتائج هنا.</div>';return;}
  const sorted=[...players].sort((a,b)=>b.score-a.score);
  const max=Math.max(1,...sorted.map(p=>p.score));
  box.innerHTML="";
  sorted.forEach((p,i)=>{
    const row=document.createElement('div');
    row.className="score-row";
    row.innerHTML=`<span class="rank">${i+1}</span>
      <span class="nm">${escapeHtml(p.name)}</span>
      <span class="bar-wrap"><span class="bar" style="width:${(p.score/max)*100}%"></span></span>
      <span class="pts">${p.score}</span>`;
    box.appendChild(row);
  });
}
document.getElementById('addPlayer').onclick=addPlayer;
document.getElementById('playerName').addEventListener('keydown',e=>{if(e.key==='Enter')addPlayer();});

/* ---------- admin drawer ---------- */
const adminPanel=document.getElementById('adminPanel');
const adminFab=document.getElementById('adminFab');
function setAdmin(open){
  adminPanel.classList.toggle('open',open);
  adminFab.setAttribute('aria-expanded',open?'true':'false');
  adminFab.style.display=open?'none':'flex';
}
adminFab.onclick=()=>setAdmin(true);
document.getElementById('adminClose').onclick=()=>setAdmin(false);
setAdmin(false);

/* ---------- modals ---------- */
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=e=>{
  stopModalMedia();e.target.closest('.modal-bg').classList.remove('open');
});
document.querySelectorAll('.modal-bg').forEach(bg=>bg.addEventListener('click',e=>{
  if(e.target===bg){stopModalMedia();bg.classList.remove('open');}
}));
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  const open=document.querySelectorAll('.modal-bg.open');
  if(open.length){stopModalMedia();open.forEach(m=>m.classList.remove('open'));}
  else if(adminPanel.classList.contains('open'))setAdmin(false);
});

/* ---------- tabs ---------- */
document.querySelectorAll('.tab').forEach(tab=>{
  tab.onclick=()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const t=tab.dataset.tab;
    document.getElementById('tab-crack').classList.toggle('hidden',t!=='crack');
    document.getElementById('tab-memes').classList.toggle('hidden',t!=='memes');
  };
});

/* ---------- toast ---------- */
let toastTimer=null;
function toast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  if(toastTimer)clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2600);
}

/* ---------- celebration burst ---------- */
function burst(){
  const syms=["✦","✧","★","✶","◆","✸"];
  for(let i=0;i<18;i++){
    const s=document.createElement('div');
    s.textContent=syms[i%syms.length];
    s.style.cssText=`position:fixed;left:50%;top:30%;z-index:95;color:var(--flame);font-size:${12+Math.random()*16}px;
      pointer-events:none;text-shadow:0 0 8px var(--flame);transition:transform 1s ease-out,opacity 1s`;
    document.body.appendChild(s);
    requestAnimationFrame(()=>{
      const ang=Math.random()*Math.PI*2,d=120+Math.random()*220;
      s.style.transform=`translate(${Math.cos(ang)*d}px,${Math.sin(ang)*d}px) rotate(${Math.random()*360}deg)`;
      s.style.opacity="0";
    });
    setTimeout(()=>s.remove(),1100);
  }
}

/* ---------- ambient background ---------- */
(function ambient(){
  const bg=document.getElementById('bg');
  const frags=["01","10","{ }","</>",".-",".--","--.","=","#","D8 A7","</","0x4F","11","00","[ ]","λ","∴","§"];
  for(let i=0;i<26;i++){
    const p=document.createElement('div');
    p.className="particle";
    p.textContent=frags[Math.floor(Math.random()*frags.length)];
    p.style.left=Math.random()*100+"%";
    p.style.fontSize=(10+Math.random()*16)+"px";
    p.style.animationDuration=(14+Math.random()*22)+"s";
    p.style.animationDelay=(-Math.random()*30)+"s";
    p.style.opacity=String(.15+Math.random()*.4);
    bg.appendChild(p);
  }
  [['8%','12%',260,'rgba(235,94,40,.5)'],['78%','20%',300,'rgba(235,94,40,.35)'],['45%','75%',340,'rgba(64,61,57,.8)']]
   .forEach(([l,t,sz,c])=>{
    const g=document.createElement('div');g.className="glow";
    g.style.cssText=`left:${l};top:${t};width:${sz}px;height:${sz}px;background:${c}`;
    g.style.animationDelay=(-Math.random()*10)+"s";bg.appendChild(g);
  });
})();

/* ---------- init ---------- */
renderChallenges();renderMemes();renderPlayers();renderScoreboard();
