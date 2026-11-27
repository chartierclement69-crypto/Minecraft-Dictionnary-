/* ============ ULTRA v2 — MODULES BONUS : Simulateur, Potions, Quiz, Diamond Dash ============ */
"use strict";

(function(){ const st=document.createElement("style"); st.textContent=`
.sim-box{background:#12151c;border:3px solid #000;padding:20px;box-shadow:inset -4px -4px 0 rgba(0,0,0,.4);margin-bottom:18px}
.sim-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;align-items:center}
.sim-row label{font-size:16px;color:var(--gold);min-width:110px}
.sim-row select{flex:1;min-width:200px;padding:9px 10px;background:#0a0c10;color:var(--text);border:3px solid #000;font-family:var(--body);font-size:18px}
.sim-out{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.sim-big{flex:1;min-width:140px;background:#0a0c10;border:3px solid #262b34;padding:14px;text-align:center}
.sim-big b{display:block;font-family:var(--px);font-size:20px;color:var(--redstone)}
.sim-big span{color:var(--muted);font-size:16px}
.brew-step{display:flex;gap:12px;align-items:center;background:#0a0c10;border:3px solid #262b34;padding:10px 12px;margin-bottom:8px}
.brew-step .bs-n{font-family:var(--px);font-size:9px;color:var(--diamond);min-width:26px}
.quiz-q{font-size:24px;margin:14px 0}
.quiz-opts{display:grid;gap:10px;grid-template-columns:1fr 1fr}
.quiz-opts button{background:#0d1016;border:3px solid #000;color:var(--text);padding:14px;font-family:var(--body);font-size:19px;text-align:left;transition:.15s}
.quiz-opts button:hover{border-color:var(--diamond);transform:translateY(-2px)}
.quiz-opts button.good{background:#1d4020;border-color:var(--grass)}
.quiz-opts button.bad{background:#401d1d;border-color:var(--redstone)}
.quiz-bar{height:10px;background:#0a0c10;border:2px solid #000;margin:12px 0}
.quiz-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--grass),var(--diamond));transition:width .3s}
#dash-wrap{max-width:560px;margin:0 auto}
#dash-cv{width:100%;background:#10131a;border:4px solid #000;box-shadow:0 0 26px rgba(74,237,217,.25);display:block;touch-action:manipulation}
.dash-hud{display:flex;justify-content:space-between;font-family:var(--px);font-size:10px;color:var(--gold);padding:8px 2px}
`;document.head.appendChild(st);})();

/* ============ 1) SIMULATEUR DE DÉGÂTS ============ */
(function(){
  const page = document.getElementById("page-simulateur");
  const enchants = [
    {n:"Aucun enchantement", add:0},
    {n:"Tranchant I", add:1},{n:"Tranchant II", add:1.5},{n:"Tranchant III", add:2},{n:"Tranchant IV", add:2.5},{n:"Tranchant V", add:3},
    {n:"Châtiment V (vs undead)", add:8, note:"contre zombies, squelettes, withers…"},
    {n:"Arthopodes V (vs insectes)", add:8, note:"contre araignées, silverfish, endermites…"}
  ];
  const armuresMob = [
    {n:"Sans armure", red:0},
    {n:"Armure en cuir", red:0.28},
    {n:"Armure en fer", red:0.52},
    {n:"Armure en netherite", red:0.64}
  ];
  const armesTirables = TOUTES_ARMES.filter(a=>typeof a.d === "number");
  page.innerHTML = `
    <h2 class="page-title">⚔️ Simulateur de dégâts<small>Choisis ton arme, tes enchantements et ta cible : combien de coups pour la tuer ?</small></h2>
    <div class="sim-box">
      <div class="sim-row"><label>🗡️ Arme</label><select id="sim-arme">${armesTirables.map((a,i)=>`<option value="${i}">${a.i} ${a.n} (${a.d} dégâts)</option>`).join("")}</select></div>
      <div class="sim-row"><label>✨ Enchant.</label><select id="sim-ench">${enchants.map((e,i)=>`<option value="${i}">${e.n}</option>`).join("")}</select></div>
      <div class="sim-row"><label>👾 Cible</label><select id="sim-cible">${MOBS.map((m,i)=>`<option value="${i}">${m.i} ${m.n} (${m.hp} PV)</option>`).join("")}</select></div>
      <div class="sim-row"><label>🛡️ Armure du mob</label><select id="sim-armure">${armuresMob.map((a,i)=>`<option value="${i}">${a.n}</option>`).join("")}</select></div>
      <div class="sim-out" id="sim-out"></div>
      <div class="tip" id="sim-tip" style="margin-top:14px"></div>
    </div>
    <div class="sim-box">
      <h3 style="font-family:var(--px);font-size:11px;color:var(--gold);margin-bottom:10px">COUPS CRITIQUES & CHUTE</h3>
      <p style="color:var(--muted);font-size:18px">Coup critique (saut + frappe) : ×1,5 dégâts. Chute : +1 dégât par bloc de chute (massue : +2 cœurs par bloc !). Fiole de Force II : ×2,3 dégâts au corps à corps.</p>
    </div>`;
  const calc = ()=>{
    const a = armesTirables[+document.getElementById("sim-arme").value];
    const e = enchants[+document.getElementById("sim-ench").value];
    const m = MOBS[+document.getElementById("sim-cible").value];
    const ar = armuresMob[+document.getElementById("sim-armure").value];
    let dmg = (a.d + (e.add || 0)) * (1 - ar.red);
    dmg = Math.max(0.5, dmg);
    const coups = Math.ceil(m.hp / dmg);
    const temps = (coups * 0.625).toFixed(1);
    document.getElementById("sim-out").innerHTML = `
      <div class="sim-big"><b>${dmg.toFixed(1)}</b><span>dégâts par coup</span></div>
      <div class="sim-big"><b>${coups}</b><span>coups pour tuer ${m.n}</span></div>
      <div class="sim-big"><b>${temps}s</b><span>en frappant non-stop</span></div>`;
    const tips = [];
    if (coups > 12) tips.push("Ça fait beaucoup ! Passe à l'arme au niveau supérieur ou enchante-la.");
    if (m.n === "Warden") tips.push("Le Warden a 500 PV : même en netherite, la fuite est une option honorable.");
    if (m.t === "boss") tips.push("Boss : prépare potions de régénération et golden apples.");
    if (e.note) tips.push(e.note);
    if (a.n.includes("Or")) tips.push("L'or est rapide mais casse en 32 coups… prévois une réserve !");
    document.getElementById("sim-tip").innerHTML = "💡 " + (tips.join(" ") || "Bon rapport dégâts/vitesse. Frappe, recule, recommence !");
  };
  ["sim-arme","sim-ench","sim-cible","sim-armure"].forEach(id=>document.getElementById(id).addEventListener("change",calc));
  calc();
})();

/* ============ 2) CALCULATEUR DE POTIONS (dans la page Potions) ============ */
(function(){
  const page = document.getElementById("page-potions");
  const chaines = [
    {n:"Régénération", ing:"Larme de ghast", mods:["Redstone : durée 1:30 → 2:00","Glowstone : Régénération II (plus rapide)"]},
    {n:"Vitesse", ing:"Sucre", mods:["Redstone : 3:00 → 8:00","Glowstone : Vitesse II (+40%)"]},
    {n:"Force", ing:"Poudre de blaze", mods:["Redstone : 3:00 → 8:00","Glowstone : Force II (+130% dégâts)"]},
    {n:"Soin", ing:"Larme de ghast fermentée", mods:["Glowstone : Soin II (+4 cœurs)"]},
    {n:"Saut", ing:"Patte de lapin", mods:["Redstone : 3:00 → 8:00","Glowstone : Saut II (+2,5 blocs)"]},
    {n:"Résistance au feu", ing:"Crème de magma", mods:["Redstone : 3:00 → 8:00"]},
    {n:"Résistance", ing:"Carapace de tortue fermentée", mods:["Redstone : 3:00 → 5:00"]},
    {n:"Respiration aquatique", ing:"Poisson fugu", mods:["Redstone : 3:00 → 8:00"]},
    {n:"Invisibilité", ing:"Carotte dorée fermentée", mods:["Redstone : 3:00 → 8:00"]},
    {n:"Vision nocturne", ing:"Carotte dorée", mods:["Redstone : 3:00 → 8:00"]},
    {n:"Chute lente", ing:"Membrane de phantom", mods:["Redstone : 1:30 → 4:00"]},
    {n:"Lenteur", ing:"Lapin (patte) fermenté", mods:["Redstone : durée +","Glowstone : Lenteur IV"]},
    {n:"Poison", ing:"Œil d'araignée fermenté", mods:["Redstone : durée +","Glowstone : Poison II"]},
    {n:"Faiblesse", ing:"Œil d'araignée fermenté", mods:["Redstone : durée +"]},
    {n:"Dégâts", ing:"Larme de ghast fermentée", mods:["Glowstone : Dégâts II"]}
  ];
  const box = document.createElement("div");
  box.innerHTML = `
    <h2 class="page-title" style="margin-top:50px">🧪 Calculateur de brassage<small>Choisis un effet : la chaîne de fabrication complète s'affiche, étape par étape</small></h2>
    <div class="sim-box">
      <div class="sim-row"><label>✨ Effet voulu</label><select id="brew-effet">${chaines.map((c,i)=>`<option value="${i}">${c.n}</option>`).join("")}</select></div>
      <div class="sim-row"><label>🎯 Version</label><select id="brew-forme"><option value="normale">Fiole normale</option><option value="splash">Splash (jetable)</option><option value="longue">Prolongée (redstone)</option><option value="II">Améliorée (glowstone)</option></select></div>
      <div id="brew-steps"></div>
      <div class="tip" style="margin-top:14px">💡 Astuce : la poudre à canon en dernier transforme N'IMPORTE quelle potion en splash. Le breuvage étrange (nether wart) est obligatoire comme base.</div>
    </div>`;
  page.appendChild(box);
  const paint = ()=>{
    const c = chaines[+document.getElementById("brew-effet").value];
    const f = document.getElementById("brew-forme").value;
    const steps = [
      {n:"1", t:"Eau + Nether wart", d:"Bouteille d'eau dans l'alchimiste + nether wart → breuvage étrange (base obligatoire)"},
      {n:"2", t:"+" + c.ing, d:"Brasse l'ingrédient principal → potion de " + c.n},
      {n:"3", t: f==="longue" ? "+ Redstone" : f==="II" ? "+ Glowstone" : "Terminée", d: f==="longue" ? (c.mods.find(m=>m.startsWith("Redstone")) || "Redstone : prolonge la durée") : f==="II" ? (c.mods.find(m=>m.startsWith("Glowstone")) || "Glowstone : niveau II (ou durée réduite si effet instantané)") : "Potion de " + c.n + " prête !"},
      {n:"4", t: f==="splash" ? "+ Poudre à canon" : "Boire 🍷", d: f==="splash" ? "Poudre à canon → version splash, jetable sur les autres (et sur toi)" : "Effet : " + (POTIONS.find(p=>norm(p.n).includes(norm(c.n).split(" ")[0])) || {e:"voir la fiche"}).e}
    ];
    document.getElementById("brew-steps").innerHTML = steps.map(s=>`<div class="brew-step"><span class="bs-n">${s.n}</span><div><b style="color:#fff">${s.t}</b><br><span style="color:var(--muted);font-size:17px">${s.d}</span></div></div>`).join("");
  };
  document.getElementById("brew-effet").addEventListener("change",paint);
  document.getElementById("brew-forme").addEventListener("change",paint);
  paint();
})();

/* ============ 3) QUIZ MINECRAFT ============ */
(function(){
  const page = document.getElementById("page-quiz");
  const Q = [
    {q:"Combien de PV a le Warden ?", a:["500","300","100","1000"], c:0},
    {q:"Que drop le Creeper ?", a:["Poudre à canon","Os","Fils","Charbon"], c:0},
    {q:"Quels ingrédients pour un arc ?", a:["3 bâtons + 3 ficelles","3 fer + 2 bâtons","3 planches + 3 plumes","2 bâtons + 1 silex"], c:0},
    {q:"Quelle potion contre le feu du Nether ?", a:["Résistance au feu (crème de magma)","Résistance","Vitesse","Soin"], c:0},
    {q:"Combien de blocs de fer pour un golem de fer ?", a:["4","2","6","9"], c:0},
    {q:"Quelle est la nourriture des piglins pour troquer ?", a:["Lingots d'or","Émeraudes","Diamants","Fer"], c:0},
    {q:"À quelle hauteur trouve-t-on le plus de diamants ?", a:["Y -59","Y 64","Y 0","Y 120"], c:0},
    {q:"Quel biome n'a AUCUN mob hostile ?", a:["Champs de champignons","Désert","Marais","Plaines"], c:0},
    {q:"Que donne 4 planches en grille 2×2 ?", a:["Table de craft","Coffre","Four","Bâtons"], c:0},
    {q:"Quelle commande change le mode de jeu ?", a:["/gamemode","/mode","/playmode","/setmode"], c:0},
    {q:"Combien de piliers d'obsidienne dans l'End ?", a:["10","8","12","6"], c:0},
    {q:"Quel mob drop le totem d'immortalité ?", a:["L'Évocateur","Le Vindicateur","Le Ravageur","Le Pillard"], c:0},
    {q:"Combien de temps brûle un creeper avant d'exploser ?", a:["1,5 seconde","3 secondes","0,5 seconde","5 secondes"], c:0},
    {q:"Quel bloc est indestructible en survie ?", a:["Bedrock","Obsidienne","Netherite","Barrière"], c:0},
    {q:"Combien de lapis pour un enchantement niveau 30 ?", a:["3","1","9","5"], c:0},
    {q:"Quel outil casse l'obsidienne sans la détruire ?", a:["Pioche en diamant ou netherite","Pioche en fer","Hache en fer","Pelle en diamant"], c:0},
    {q:"Que fabrique 9 boules de slime ?", a:["Un bloc de slime","Un piston","Un lit","Une canne"], c:0},
    {q:"Quelle commande fait apparaître un mob ?", a:["/summon","/spawn","/create","/give"], c:0},
    {q:"Combien de casques différents existent (matériaux craftables) ?", a:["5","4","6","3"], c:0},
    {q:"Quel mob apparaît si tu ne dors pas 3 jours ?", a:["Phantom","Slime","Endermite","Stray"], c:0}
  ];
  let score = 0, idx = 0, ordre = [], best = +(localStorage.getItem("mcd-quiz-best")||0);
  const paint = ()=>{
    if (idx >= ordre.length) {
      if (score > best) { best = score; localStorage.setItem("mcd-quiz-best", best); }
      page.querySelector("#quiz-body").innerHTML = `
        <h3 style="font-family:var(--px);font-size:14px;color:var(--gold)">🏁 TERMINÉ !</h3>
        <p style="font-size:28px;margin:14px 0">Score : <b style="color:var(--diamond)">${score}/${ordre.length}</b></p>
        <p style="color:var(--muted)">Record : ${best}/${ordre.length}</p>
        <p style="margin-top:10px">${score===ordre.length?"🏆 PARFAIT ! Tu es un vrai Minecraffile !":score>=7?"💎 Excellent, presque parfait !":score>=4?"🟩 Pas mal, continue !":"🧟 Retourne lire les fiches, un creeper t'attend."}</p>
        <button class="btn btn-green" id="quiz-restart" style="margin-top:14px">🔄 Rejouer</button>`;
      page.querySelector("#quiz-restart").addEventListener("click",start);
      return;
    }
    const q = Q[ordre[idx]];
    page.querySelector("#quiz-progress").style.width = (idx/ordre.length*100)+"%";
    page.querySelector("#quiz-score").textContent = "Score : "+score;
    const opts = q.a.map((t,i)=>({t,ok:i===q.c})).sort(()=>Math.random()-0.5);
    page.querySelector("#quiz-body").innerHTML = `
      <p style="color:var(--muted)">Question ${idx+1}/${ordre.length}</p>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-opts">${opts.map((o,i)=>`<button data-ok="${o.ok}">${o.t}</button>`).join("")}</div>`;
    page.querySelectorAll(".quiz-opts button").forEach(b=>b.addEventListener("click",()=>{
      const good = b.dataset.ok === "true";
      if (good) score++;
      page.querySelectorAll(".quiz-opts button").forEach(x=>{ x.disabled = true; if (x.dataset.ok==="true") x.classList.add("good"); });
      if (!good) b.classList.add("bad");
      setTimeout(()=>{ idx++; paint(); }, good ? 500 : 1100);
    }));
  };
  const start = ()=>{
    score = 0; idx = 0;
    ordre = Q.map((_,i)=>i).sort(()=>Math.random()-0.5).slice(0,10);
    paint();
  };
  page.innerHTML = `
    <h2 class="page-title">🎯 Quiz Minecraft<small>10 questions au hasard · record sauvegardé (${best}/10)</small></h2>
    <div class="sim-box">
      <div class="quiz-bar"><i id="quiz-progress" style="width:0%"></i></div>
      <div style="display:flex;justify-content:space-between"><span id="quiz-score" style="color:var(--gold)">Score : 0</span><span style="color:var(--muted)">Record : ${best}/10</span></div>
      <div id="quiz-body"></div>
    </div>`;
  start();
  const _showPage = showPage;
  showPage = function(p){ _showPage(p); };
})();

/* ============ 4) DIAMOND DASH — le mini-jeu revient ============ */
(function(){
  const page = document.getElementById("page-jeu");
  page.innerHTML = `
    <h2 class="page-title">🕹️ Diamond Dash<small>Saute par-dessus les creepers, attrape les diamants ! Espace / ↑ / clic / tap = sauter (double saut !) · P = pause</small></h2>
    <div id="dash-wrap">
      <canvas id="dash-cv" width="560" height="300"></canvas>
      <div class="dash-hud"><span id="dash-score">SCORE : 0</span><span id="dash-best">RECORD : ${localStorage.getItem("mcd-dash-best")||0}</span></div>
      <div style="text-align:center;margin-top:10px"><button class="btn btn-green" id="dash-start">▶️ JOUER</button></div>
    </div>`;
  const cv = document.getElementById("dash-cv"), ctx = cv.getContext("2d");
  let run = false, paused = false, raf = null;
  let player, obstacles, gems, score, speed, frame, groundY = cv.height - 40;
  const best = ()=>+(localStorage.getItem("mcd-dash-best")||0);
  const reset = ()=>{
    player = {x:60,y:groundY-30,vy:0,w:28,h:30,jumps:0};
    obstacles = []; gems = []; score = 0; speed = 4.5; frame = 0;
  };
  const jump = ()=>{
    if (!run || paused) return;
    if (player.jumps < 2) { player.vy = player.jumps===0 ? -11.5 : -10; player.jumps++; }
  };
  const spawn = ()=>{
    if (frame % Math.max(40, Math.floor(110 - speed*6)) === 0) {
      if (Math.random() < 0.75) obstacles.push({x:cv.width+20, y:groundY-26, w:24, h:26, t:"creeper"});
      else obstacles.push({x:cv.width+20, y:groundY-70, w:30, h:18, t:"phantom"});
    }
    if (frame % 70 === 0 && Math.random() < 0.6) gems.push({x:cv.width+20, y:groundY-60-Math.random()*90, r:9, t:"diamond"});
  };
  const draw = ()=>{
    ctx.fillStyle = "#10131a"; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle = "#1a1f2b";
    for (let i=0;i<8;i++) ctx.fillRect(((i*90 - frame*speed*0.25) % (cv.width+90)+cv.width+90)%(cv.width+90)-45, 60+((i*37)%80), 40, 40);
    ctx.fillStyle = "#3e8e3e"; ctx.fillRect(0,groundY,cv.width,cv.height-groundY);
    ctx.fillStyle = "#5cb85c"; ctx.fillRect(0,groundY,cv.width,8);
    ctx.fillStyle = "#795548"; ctx.fillRect(0,groundY+8,cv.width,cv.height-groundY-8);
    for (const o of obstacles){
      if (o.t==="creeper"){ ctx.fillStyle="#3fa63f"; ctx.fillRect(o.x,o.y,o.w,o.h); ctx.fillStyle="#04140a"; ctx.fillRect(o.x+4,o.y+5,5,5); ctx.fillRect(o.x+15,o.y+5,5,5); ctx.fillRect(o.x+8,o.y+14,8,7);}
      else { ctx.fillStyle="#5c6b8a"; ctx.fillRect(o.x,o.y,o.w,o.h); ctx.fillStyle="#9fb6d9"; ctx.fillRect(o.x+3,o.y+3,o.w-6,4);}
    }
    for (const g of gems){ ctx.fillStyle="#4aedd9"; ctx.fillRect(g.x-g.r,g.y-g.r/1.5,g.r*2,g.r*1.5); ctx.fillStyle="#b8fef4"; ctx.fillRect(g.x-g.r/2,g.y-g.r/2.5,g.r/1.5,g.r/2);}
    ctx.fillStyle = "#f5c842"; ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.fillStyle = "#04140a"; ctx.fillRect(player.x+5,player.y+6,5,5); ctx.fillRect(player.x+17,player.y+6,5,5);
  };
  const tick = ()=>{
    if (!run) return;
    if (!paused){
      frame++; score++;
      speed = Math.min(11, 4.5 + frame/900);
      player.vy += 0.55; player.y += player.vy;
      if (player.y >= groundY - player.h){ player.y = groundY - player.h; player.vy = 0; player.jumps = 0; }
      spawn();
      for (const o of obstacles){
        o.x -= speed;
        if (player.x < o.x+o.w && player.x+player.w > o.x && player.y < o.y+o.h && player.y+player.h > o.y) return gameOver();
      }
      obstacles = obstacles.filter(o=>o.x > -40);
      for (const g of gems){
        g.x -= speed;
        if (Math.abs(g.x-(player.x+player.w/2)) < g.r+10 && Math.abs(g.y-(player.y+player.h/2)) < g.r+14){ g.r = 0; score += 25; }
      }
      gems = gems.filter(g=>g.r>0 && g.x > -20);
      document.getElementById("dash-score").textContent = "SCORE : "+score;
    }
    draw();
    raf = requestAnimationFrame(tick);
  };
  const gameOver = ()=>{
    run = false; cancelAnimationFrame(raf);
    const b = +(localStorage.getItem("mcd-dash-best")||0);
    const record = score > b;
    if (record) localStorage.setItem("mcd-dash-best", score);
    document.getElementById("dash-best").textContent = "RECORD : "+Math.max(b,score);
    ctx.fillStyle = "rgba(0,0,0,.75)"; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle = "#ff4444"; ctx.font = "28px 'Press Start 2P',monospace"; ctx.textAlign = "center";
    ctx.fillText("BOOM !", cv.width/2, cv.height/2 - 20);
    ctx.fillStyle = "#e8e6e3"; ctx.font = "14px monospace";
    ctx.fillText("Score : "+score+(record?"  🏆 NOUVEAU RECORD !":""), cv.width/2, cv.height/2 + 16);
    document.getElementById("dash-start").textContent = "↻ REJOUER";
  };
  document.getElementById("dash-start").addEventListener("click",()=>{
    if (raf) cancelAnimationFrame(raf);
    reset(); run = true; paused = false; document.getElementById("dash-start").textContent = "▶️ EN COURS"; tick();
  });
  cv.addEventListener("pointerdown", e=>{ e.preventDefault(); jump(); });
  document.addEventListener("keydown", e=>{
    if ((e.code==="Space"||e.code==="ArrowUp") && document.getElementById("page-jeu").classList.contains("active")){ e.preventDefault(); jump(); }
    if (e.code==="KeyP" && run){ paused = !paused; }
  });
  reset(); draw();
})();
