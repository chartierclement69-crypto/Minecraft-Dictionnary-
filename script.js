/* ============ MINECRAFT DICTIONNARY ULTRA v2 — MOTEUR ============ */
"use strict";

/* ---------- Génération des fiches outils / armures / armures ---------- */
const OUTIL_NAMES = { "Épée":"sword","Pioche":"pickaxe","Hache":"axe","Pelle":"shovel","Houe":"hoe" };
const ARMES = []; // fiches outils/épées
TIERS.forEach(t => OUTILS.forEach(o => {
  ARMES.push({ n:`${o.n} en ${t.n}`, t:"outil", i:o.i, hp:o.dmg(t), d:o.dmg(t), dur:t.dur,
    b:`${t.ing} (table de craft)`, s:o.desc, tier:t.n, speed:t.speed });
}));
const ARMURES = []; // fiches armures
ARMURES_T.forEach(m => PIECES.forEach((p,idx) => {
  ARMURES.push({ n:`${p} en ${m.n}`, t:"armure", i:PIECES_I[idx], hp:m.pts[idx], d:m.pts[idx],
    dur:m.dur[idx], b:`${m.ing} (table de craft)`, s:`${m.pts[idx]} point${m.pts[idx]>1?"s":""} d'armure. Enchantabilité ${m.ench}.`,
    tier:m.n, col:m.c });
}));
const TOUTES_ARMES = [...ARMES, ...ARMURES, ...ARMES_SPECIALES.map(a=>({...a,t:"spéciale"}))];

/* Recettes générées : outils */
const PATTERNS_OUTIL = {
 "Épée":["MM","B"],"Pioche":["MMM"," B "," B "],"Haxe":["MM","MB"," B"],"Pelle":["M","B","B"],"Houe":["MM"," B"," B"]
};
TIERS.forEach(t => Object.keys(PATTERNS_OUTIL).forEach(k=>{
  RECETTES.push({ n:`${k} en ${t.n}`, c:"Outils", g:PATTERNS_OUTIL[k],
    m:{ M:t.ing, B:"Bâton" },
    o:`1 ${k.toLowerCase()} en ${t.n.toLowerCase()}`, q:1 });
}));
/* Recettes générées : armures (maille non craftable) */
const PATTERNS_ARMURE = {
 "Casque":["MMM","M M"],"Plastron":["M M","MMM","MMM"],"Jambières":["MMM","M M","M M"],"Bottes":["M M","M M"]
};
const ARMURE_LETTER = { "Cuir":"K","Fer":"I","Or":"O","Diamant":"D","Netherite":"N" };
ARMURES_T.filter(m=>m.ing).forEach(m => PIECES.forEach(p=>{
  const letter = ARMURE_LETTER[m.n];
  RECETTES.push({ n:`${p} en ${m.n}`, c:"Armures", g:PATTERNS_ARMURE[p].map(r=>r.replace(/M/g,letter)),
    m:{ [letter]: m.ing }, o:`1 ${p.toLowerCase()} en ${m.n.toLowerCase()}`, q:1 });
}));

/* Recettes : légende des lettres partagée */
RECETTES.forEach(r=>{ r.key = r.n.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-"); });

/* ---------- Utilitaires ---------- */
const $ = s=>document.querySelector(s);
const $$ = s=>[...document.querySelectorAll(s)];
const norm = s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const esc = s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const slug = s=>norm(s).replace(/[^a-z0-9]+/g,"-");
let FAVORIS = JSON.parse(localStorage.getItem("mcd-fav-v2")||"[]");
const saveFav = ()=>{ localStorage.setItem("mcd-fav-v2",JSON.stringify(FAVORIS)); $("#fav-count").textContent=FAVORIS.length; };
const isFav = k=>FAVORIS.includes(k);
const toggleFav = k=>{ FAVORIS = isFav(k)?FAVORIS.filter(x=>x!==k):[...FAVORIS,k]; saveFav(); };

/* ---------- Catalogue global ---------- */
const CATALOGUE = [];
const pushCat = (arr,cat,page)=>arr.forEach(o=>CATALOGUE.push({ ...o, _cat:cat, _page:page, _slug:slug(o.n) }));
pushCat(MOBS,"Mobs","mobs");
pushCat(TOUTES_ARMES,"Armes & Armures","armes");
pushCat(POTIONS,"Potions","potions");
pushCat(BLOCS,"Blocs","blocs");
pushCat(BIOMES,"Biomes","biomes");
pushCat(RECETTES,"Recettes","craft");
pushCat(COMMANDES,"Commandes","craft");

/* ---------- Navigation ---------- */
function showPage(p){
  $$(".page").forEach(x=>x.classList.remove("active"));
  const el = $("#page-"+p); if(el) el.classList.add("active");
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.page===p));
  $("#tabs").classList.remove("open"); $("#burger").setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"smooth"});
  if(p==="favoris") renderFavoris();
  if(p==="craft") renderCraft();
}
document.addEventListener("click",e=>{
  const b = e.target.closest("[data-page]");
  if(b){ e.preventDefault(); showPage(b.dataset.page);
    if(b.dataset.jump) setTimeout(()=>document.getElementById("sec-"+b.dataset.jump)?.scrollIntoView({behavior:"smooth"}),300); }
});

/* ---------- Particules flottantes ---------- */
(function(){
  const icons=["🟩","⛏️","💎","🧟","⚔️","🧪","🔥","🟪","🧱","🏹","🟨","🍄"];
  const c=$("#floaters");
  for(let i=0;i<22;i++){
    const s=document.createElement("span"); s.className="floater";
    s.textContent=icons[i%icons.length];
    s.style.left=Math.random()*100+"%";
    s.style.animationDuration=12+Math.random()*18+"s";
    s.style.animationDelay=-Math.random()*20+"s";
    s.style.fontSize=18+Math.random()*22+"px";
    c.appendChild(s);
  }
})();

/* ---------- Stats + features accueil ---------- */
(function(){
  const total = CATALOGUE.filter(c=>["_cat"].length && c._cat!=="Recettes" && c._cat!=="Commandes").length
    + RECETTES.length + COMMANDES.length;
  $("#hero-stats").innerHTML = [
    ["👾",MOBS.length,"mobs"],["⚔️",TOUTES_ARMES.length,"armes & armures"],
    ["🧪",POTIONS.length,"potions"],["🧱",BLOCS.length,"blocs"],
    ["🌍",BIOMES.length,"biomes"],["🛠️",RECETTES.length,"recettes"],["💻",COMMANDES.length,"commandes"]
  ].map(([i,v,l])=>`<div class="stat"><b>${v}</b><span>${i} ${l}</span></div>`).join("");
  $("#features").innerHTML = [
    ["🔍","Recherche universelle","Une seule barre pour tout retrouver : mobs, objets, recettes, commandes. Essaye « red » !"],
    ["🛠️","Table de craft interactive","Chaque recette affichée en grille 3×3, comme en jeu. Plus de 100 recettes recensées."],
    ["💻","Bloc de commandes simulé","Tape tes commandes et vois le résultat, en mode Java ou Bedrock. Erreurs incluses !"],
    ["⭐","Favoris","Garde tes fiches préférées en étoile, sauvegardées dans ton navigateur."],
    ["🔗","Fiches partageables","Chaque fiche a son lien direct, comme ?fiche=creeper."],
    ["📱","100% mobile","Pixel-art, animations et glisse fluide, du téléphone au 4K."]
  ].map(([i,t,d])=>`<div class="feature"><div class="f-ico">${i}</div><h3>${t}</h3><p>${d}</p></div>`).join("");
})();

/* ---------- Rendu générique des cartes ---------- */
function pillClass(t){
  if(["hostile"].includes(t))return"p-hostile"; if(["passif"].includes(t))return"p-passif";
  if(["boss"].includes(t))return"p-boss"; if(["positive"].includes(t))return"p-pos";
  if(["negative"].includes(t))return"p-neg"; if(["special","spéciale"].includes(t))return"p-spec";
  return"p-dim";
}
function cardHTML(o,cat){
  const k = o._slug || slug(o.n);
  const pill = o.t ? `<span class="pill ${pillClass(o.t)}">${o.t.toUpperCase()}</span>` : "";
  const extra = o.d!==undefined && (cat==="mobs") ? `<div class="c-line">⚔️ ${o.d} dégâts · 🛡️ ${o.hp} PV</div>` : "";
  const extraA = cat==="armes" ? `<div class="c-line">⚔️ ${o.d??0} dégâts${o.dur?` · ♾️ dur. ${o.dur}`:""}</div>` : "";
  const extra2 = cat==="biomes" ? `<div class="c-line">${o.dim} · ${o.cl}</div>` :
    (o.b && cat!=="armes" ? `<div class="c-line">📍 ${o.b}</div>` : "");
  const fav = `<button class="fav-btn ${isFav(cat+"/"+k)?"on":""}" data-fav="${cat}/${k}" aria-label="Favori">★</button>`;
  return `<article class="card" data-open="${cat}" data-slug="${k}" tabindex="0">${fav}
    <div class="c-ico">${o.i||"🧱"}</div><h3>${o.n}</h3>${pill}${extra}${extraA}${extra2}
    ${o.hp!==undefined&&cat==="mobs"?`<div class="hp-bar"><i style="width:${Math.min(100,(o.hp/500)*100+4)}%"></i></div>`:""}
  </article>`;
}
function renderCatalog(cat,pageSel,items){
  const page = $(pageSel);
  const titles = { mobs:"👾 Bestiaire complet", armes:"⚔️ Armes, outils & armures",
    potions:"🧪 Grimoire des potions", blocs:"🧱 Blocs", biomes:"🌍 Biomes" };
  page.innerHTML = `<h2 class="page-title">${titles[cat]}
    <small>${items.length} fiches · clique sur une carte pour tous les détails</small></h2>
    <div class="toolbar">
      <input type="search" placeholder="Filtrer dans cette catégorie…" aria-label="Filtre">
      ${cat==="mobs"?`<button class="chip" data-f="hostile">Hostiles</button><button class="chip" data-f="passif">Passifs</button><button class="chip" data-f="boss">Boss</button>`:""}
      ${cat==="potions"?`<button class="chip" data-f="positive">Positives</button><button class="chip" data-f="negative">Négatives</button><button class="chip" data-f="special">Spéciales</button>`:""}
      ${cat==="armes"?`<button class="chip" data-f="outil">Outils</button><button class="chip" data-f="armure">Armures</button><button class="chip" data-f="spéciale">Spéciales</button>`:""}
    </div><div class="grid"></div>`;
  const grid = page.querySelector(".grid");
  const input = page.querySelector("input");
  let filter = null;
  const paint = ()=>{
    const q = norm(input.value.trim());
    const list = items.filter(o=>(!filter||o.t===filter) && (!q||norm(o.n).includes(q)||(o.b&&norm(o.b).includes(q))));
    grid.innerHTML = list.length?list.map(o=>cardHTML(o,cat)).join(""):`<p class="empty">Aucune fiche trouvée… mais elle existe sûrement dans le Nether.</p>`;
  };
  input.addEventListener("input",paint);
  page.querySelectorAll(".chip").forEach(ch=>ch.addEventListener("click",()=>{
    page.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    ch.classList.add("active"); filter = ch.dataset.f; paint();
  }));
  paint();
}
renderCatalog("mobs","#page-mobs",MOBS);
renderCatalog("armes","#page-armes",TOUTES_ARMES);
renderCatalog("potions","#page-potions",POTIONS);
renderCatalog("blocs","#page-blocs",BLOCS);
renderCatalog("biomes","#page-biomes",BIOMES);

/* ---------- Modal fiche ---------- */
function openFiche(cat,k){
  let o;
  if(cat==="mobs") o = MOBS.find(x=>slug(x.n)===k);
  else if(cat==="armes") o = TOUTES_ARMES.find(x=>slug(x.n)===k);
  else if(cat==="potions") o = POTIONS.find(x=>slug(x.n)===k);
  else if(cat==="blocs") o = BLOCS.find(x=>slug(x.n)===k);
  else if(cat==="biomes") o = BIOMES.find(x=>slug(x.n)===k);
  else if(cat==="recettes") o = RECETTES.find(x=>x.key===k||slug(x.n)===k);
  else if(cat==="commandes") o = COMMANDES.find(x=>slug(x.n)===k);
  if(!o) return;
  const favKey = cat+"/"+(o.key||k);
  const stats = [];
  if(o.t) stats.push([o.t.toUpperCase(),"Type"]);
  if(o.hp!==undefined) stats.push([o.hp,"PV / Points"]);
  if(o.d!==undefined&&cat!=="potions") stats.push([o.d,"Dégâts"]);
  if(o.dur!==undefined) stats.push([o.dur,"Durabilité"]);
  if(o.o) stats.push([o.o,"Résultat"]);
  if(o.q) stats.push([o.q,"Quantité"]);
  if(o.e) stats.push([o.e,"Effet"]);
  if(o.d!==undefined&&cat==="potions") stats.push([o.d,"Durée"]);
  if(o.dim) stats.push([o.dim,"Dimension"]);
  if(o.cl) stats.push([o.cl,"Climat"]);
  if(o.w) stats.push([o.w,"Où le trouver"]);
  if(o.b&&cat!=="mobs"&&cat!=="potions") stats.push([o.b,"Obtention"]);
  if(o.b&&cat==="potions") stats.push([o.b,"Ingrédient"]);
  if(o.b&&cat==="mobs") stats.push([o.b,"Habitat"]);
  if(o.l) stats.push([o.l,"Butin"]);
  if(o.m) stats.push([Object.values(o.m).join(", "),"Ingrédients"]);
  $("#modal-content").innerHTML = `
    <div class="m-ico">${o.i||"🧱"}</div>
    <h2 id="modal-title">${o.n}</h2>
    <div class="stat-grid">${stats.map(([v,l])=>`<div class="sg"><b>${v}</b><span>${l}</span></div>`).join("")}</div>
    ${o.desc?`<p>${o.desc}</p>`:""}
    ${o.d&&cat==="potions"?`<div class="stat-grid"><div class="sg"><b>${o.d}</b><span>Durée</span></div><div class="sg"><b>${o.ing}</b><span>Ingrédient clé</span></div></div>`:""}
    ${o.s?`<div class="tip">💡 ${o.s}</div>`:""}
    ${o.m?`<div class="syn">${o.g.map(r=>`<div>${r.replace(/ /g,"·")||"(vide)"}</div>`).join("")}</div>`:""}
    <button class="btn btn-green" style="margin-top:16px" id="modal-fav">${isFav(favKey)?"★ Retirer des favoris":"☆ Ajouter aux favoris"}</button>
    <p class="share-hint">Lien direct : ${location.origin+location.pathname}?fiche=${k}</p>`;
  const m = $("#modal"); m.hidden = false;
  $("#modal-fav").onclick = ()=>{ toggleFav(favKey); openFiche(cat,k); updateFavBtns(); };
  $("#modal-x").focus();
}
$("#modal-x").addEventListener("click",()=>{ $("#modal").hidden = true; });
$("#modal").addEventListener("click",e=>{ if(e.target.id==="modal") $("#modal").hidden = true; });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") $("#modal").hidden = true; });
document.addEventListener("click",e=>{
  const c = e.target.closest("[data-open]");
  if(c && !e.target.closest(".fav-btn")) openFiche(c.dataset.open,c.dataset.slug);
});
document.addEventListener("keydown",e=>{
  const c = e.target.closest?.("[data-open]");
  if(c && (e.key==="Enter"||e.key===" ") && !e.target.closest(".fav-btn")){ e.preventDefault(); openFiche(c.dataset.open,c.dataset.slug); }
});
document.addEventListener("click",e=>{
  const f = e.target.closest("[data-fav]");
  if(f){ e.stopPropagation(); toggleFav(f.dataset.fav); f.classList.toggle("on",isFav(f.dataset.fav)); }
});
function updateFavBtns(){ $$(".fav-btn").forEach(b=>b.classList.toggle("on",isFav(b.dataset.fav))); }

/* ---------- FAVORIS ---------- */
function renderFavoris(){
  const page = $("#page-favoris");
  const favs = CATALOGUE.filter(c=>isFav((c._cat.toLowerCase().split(" ")[0])+"/"+c._slug));
  page.innerHTML = `<h2 class="page-title">⭐ Mes favoris<small>${favs.length} fiche(s) en étoile</small></h2>`+
    (favs.length?`<div class="grid">${favs.map(c=>cardHTML(c,c._cat.toLowerCase().split(" ")[0])).join("")}</div>`
      :`<p class="empty">Aucun favori pour l'instant. Clique sur l'étoile d'une fiche ! ⭐</p>`);
}

/* ---------- CRAFT + COMMANDES ---------- */
let selRecipe = RECETTES[0];
let cmdMode = "java";
function renderCraft(){
  const page = $("#page-craft");
  page.innerHTML = `
   <h2 class="page-title">🛠️ Table de craft — tout ce qui est craftable
     <small>${RECETTES.length} recettes · clique une recette pour la voir en 3×3</small></h2>
   <div class="craft-layout">
    <div class="craft-panel" id="sec-craft">
      <h3 style="font-family:var(--px);font-size:11px;color:var(--gold);margin-bottom:8px">CRAFTING TABLE 3×3</h3>
      <div class="craft-table" id="craft-grid"></div>
      <div class="arrow-out">⬇️</div>
      <div class="craft-table"><div class="slot result-slot" id="craft-out"></div></div>
      <div class="recipe-meta" id="recipe-meta"></div>
    </div>
    <div>
      <div class="toolbar">
        <input type="search" id="craft-search" placeholder="🔍 Chercher une recette (ex : red, épée, or, slime…)" aria-label="Chercher une recette">
      </div>
      <div class="tier-strip" id="craft-cats"></div>
      <div id="craft-list"></div>
    </div>
   </div>
   <div class="cmd-section" id="sec-commandes">
    <h2 class="page-title">💻 Bloc de commandes — simulateur Java &amp; Bedrock</h2>
    <div class="cmdblock">
      <div class="mode-switch" role="group" aria-label="Mode d'édition">
        <button id="mode-java" class="on-java">☕ JAVA</button>
        <button id="mode-bedrock">📱 BEDROCK</button>
      </div>
      <div class="cmd-input">
        <span class="cb-prompt">&gt;</span>
        <input id="cmd-input" type="text" placeholder="/gamemode creative" aria-label="Tape une commande" list="cmd-suggestions">
        <button class="btn btn-green" id="cmd-run">Exécuter ⏎</button>
      </div>
      <datalist id="cmd-suggestions">${COMMANDES.map(c=>`<option value="/${c.n}">`).join("")}</datalist>
      <div class="cmd-console" id="cmd-console" aria-live="polite"></div>
      <p class="cmd-hint">🎮 Simulateur pédagogique : le résultat reflète ce que dit le jeu. Pour du vrai, colle la commande dans le tchat ou un vrai bloc de commandes en jeu !</p>
    </div>
    <div class="toolbar" style="margin-top:20px">
      <input type="search" id="cmd-search" placeholder="🔍 Chercher une commande (ex : tp, summon, gamerule)" aria-label="Chercher une commande">
    </div>
    <div class="cmd-list" id="cmd-list"></div>
   </div>`;
  paintRecipe(); paintCraftList(); paintCmdList();
  $("#craft-search").addEventListener("input",paintCraftList);
  $("#cmd-search").addEventListener("input",paintCmdList);
  $("#cmd-run").addEventListener("click",runCommand);
  $("#cmd-input").addEventListener("keydown",e=>{ if(e.key==="Enter") runCommand(); });
  $("#mode-java").addEventListener("click",()=>setCmdMode("java"));
  $("#mode-bedrock").addEventListener("click",()=>setCmdMode("bedrock"));
  setCmdMode("java");
}
function paintRecipe(){
  const r = selRecipe;
  const g = ["","",""];
  r.g.forEach((row,i)=>g[i]=(row||"").padEnd(3," ").slice(0,3));
  $("#craft-grid").innerHTML = [0,1,2].map(y=>[0,1,2].map(x=>{
    const ch = (g[y]||" ")[x];
    if(ch===" "||ch===undefined) return `<div class="slot"></div>`;
    const name = r.m[ch]||ch;
    const ico = ICON_MAP[name]||ICON_MAP[norm(name)]||"📦";
    return `<div class="slot filled" title="${name}">${ico}<span>${name}</span></div>`;
  }).join("")).join("");
  $("#craft-out").innerHTML = `<div style="font-size:26px">${ICON_MAP[norm(r.n)]||ICON_MAP[r.n]||"🎁"}</div><span style="font-size:10px;color:var(--diamond)">${r.n}</span>`;
  $("#recipe-meta").innerHTML = `<b>${r.n}</b> · ${r.c}<br>Donne : ${r.o}`;
}
const ICON_MAP = {
 "planches":"🟫","bâton":"🥢","cobblestone":"🪨","pierre":"⬜","charbon":"⚫","lingot de fer":"⚙️",
 "lingot d'or":"🟨","pépite d'or":"🟡","pépite de fer":"⚪","diamant":"💎","lingot de netherite":"🟧",
 "redstone":"🔴","poudre de redstone":"🔴","laine":"🐑","ficelle":"🧵","blé":"🌾","lait":"🥛",
 "sucre":"🍬","œuf":"🥚","pomme":"🍎","carotte":"🥕","brique d'argile":"🧱","verre":"🪟",
 "glowstone":"✨","quartz":"⚪","sable":"🏖️","poudre à canon":"💨","torche":"🕯️","coffre":"📦",
 "arc":"🏹","slime":"🟢","boule de slime":"🟢","perle de l'end":"🔮","poudre de blaze":"🔥",
 "bâton de blaze":"🔥","obsidienne":"🟪","cuir":"🟤","papier":"📄","plume":"🪶","silex":"🪨",
 "silex (item)":"🪨","livre":"📖","crochet":"🪝","noyau lourd":"🪨","breeze rod":"🌪️",
 "netherbrick (item)":"🧱","bloc d'or":"🟨","bloc de fer":"⚙️","champ. rouge":"🍄","champ. brun":"🍄",
 "bol":"🥣","fèves de cacao":"🟤","émeraude":"💚","boussole":"🧭","netherite":"🟧"
};
const ICON_LIST = [
 ["Épée","🗡️"],["Pioche","⛏️"],["Hache","🪓"],["Pelle","🥄"],["Houe","🪝"],
 ["Casque","⛑️"],["Plastron","🛡️"],["Jambières","👖"],["Bottes","🥾"]
];
TIERS.forEach(t=>ICON_LIST.forEach(([n,i])=>{ ICON_MAP[`${n.toLowerCase()} en ${t.n.toLowerCase()}`]=i; }));
ICON_MAP["torche de redstone"]="🔴"; ICON_MAP["escaliers de pierre"]="🪜";
function paintCraftList(){
  const q = norm($("#craft-search").value.trim());
  const cats = ["Toutes",...new Set(RECETTES.map(r=>r.c))];
  const active = $("#craft-cats .chip.active")?.dataset.c || "Toutes";
  $("#craft-cats").innerHTML = cats.map(c=>`<button class="chip ${c===active?"active":""}" data-c="${c}">${c}</button>`).join("");
  $("#craft-cats").querySelectorAll(".chip").forEach(ch=>ch.addEventListener("click",()=>{
    $("#craft-cats").querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    ch.classList.add("active"); $("#craft-search").dataset.c = ch.dataset.c; paintCraftList();
  }));
  const catF = $("#craft-search").dataset.c || "Toutes";
  const list = RECETTES.filter(r=>(catF==="Toutes"||r.c===catF)&&(!q||norm(r.n).includes(q)||norm(r.o).includes(q)||Object.values(r.m).some(m=>norm(m).includes(q))));
  $("#craft-list").innerHTML = list.length?list.map(r=>`
    <div class="recipe-row ${r===selRecipe?"sel":""}" data-r="${r.key}">
      <div><span class="r-n">${ICON_MAP[r.n]||ICON_MAP[norm(r.n)]||"🎁"} ${r.n}</span>
      <span class="r-c"> · ${r.c}</span></div><span class="recipe-count">×${r.q}</span>
    </div>`).join(""):`<p class="empty">Aucune recette. Essaie « red » !</p>`;
  $("#craft-list").querySelectorAll(".recipe-row").forEach(row=>row.addEventListener("click",()=>{
    selRecipe = RECETTES.find(r=>r.key===row.dataset.r); paintRecipe(); paintCraftList();
  }));
}
function setCmdMode(m){
  cmdMode = m;
  $("#mode-java").classList.toggle("on-java",m==="java");
  $("#mode-bedrock").classList.toggle("on-bedrock",m==="bedrock");
  cmdLog(`<span class="sys">Mode ${m==="java"?"Java Edition ☕":"Bedrock Edition 📱"} activé. Les syntaxes affichées s'adaptent.</span>`,false);
  paintCmdList();
}
function cmdLog(html,keep){
  const c = $("#cmd-console");
  if(!keep) c.innerHTML = "";
  c.insertAdjacentHTML("beforeend",`<span class="ln">${html}</span>`);
  c.scrollTop = c.scrollHeight;
}
function runCommand(){
  const raw = $("#cmd-input").value.trim();
  if(!raw) return;
  $("#cmd-input").value = "";
  cmdLog(`<span class="sys">&gt; ${raw.replace(/</g,"&lt;")}</span>`,true);
  if(!raw.startsWith("/")){ cmdLog(`<span class="warn">💬 Texte dans le tchat : &lt;Player&gt; ${raw.replace(/</g,"&lt;")}</span>`,true); return; }
  const parts = raw.slice(1).split(/\s+/);
  const verb = parts[0].toLowerCase();
  const C = COMMANDES.find(c=>c.n===verb||c.n===raw.slice(1).split(" ")[0]);
  if(!C){ cmdLog(`<span class="err">❌ Commande inconnue : « ${verb} ». Essaie /help ou clique une commande ci-dessous.</span>`,true); return; }
  const j = parts.slice(1).join(" ");
  const known = {
    tp:()=>`✅ ${j||"@s"} a été téléporté. Retour au bercail !`,
    teleport:()=>`✅ Téléportation effectuée.`,
    gamemode:()=>{ const m=(j||"creative").toLowerCase();
      const map={survival:"Survie",s:"Survie",creative:"Créatif",c:"Créatif",a:"Aventure",adventure:"Aventure",spectator:"Spectateur",sp:"Spectateur"};
      return `✅ Le mode de jeu de @s a été mis à jour en ${map[m]||m}.`;},
    give:()=>`✅ ${j?j:"Objet"} donné à @p. Il flotte dans l'inventaire ✨`,
    summon:()=>`✅ Entité invoquée ${j?"("+j+")":""}. Elle apparaît dans un nuage de fumée blanche.`,
    kill:()=>`⚠️ ${j||"@e"} éliminé. 0 entité ressentira le moindre doute.`,
    effect:()=>`✅ Effet appliqué ${j?"("+j+")":""}. Les particules scintillent.`,
    time:()=>`✅ L'heure du monde a été changée (${j||"set"}). Le soleil fait le fond du décor.`,
    weather:()=>`✅ La météo devient : ${j||"clear"}. ${/thunder|orage/i.test(j)?"Éclairs au programme ⚡":""}`,
    xp:()=>`✅ XP ajoutée. Niveau supérieur débloqué 🔔`,
    experience:()=>`✅ XP ajoutée.`,
    enchant:()=>`✅ Objet enchanté dans la main de @s. Scintillement violet garanti 🔮`,
    setblock:()=>`✅ Bloc placé ${j?"("+j+")":""}.`,
    fill:()=>`✅ Zone remplie. Compte les blocs : 32768 max !`,
    clone:()=>`✅ Structure clonée. Ctrl+C / Ctrl+V, version cubique.`,
    difficulty:()=>`✅ Difficulté réglée sur ${j||"normal"}. ${/hard/i.test(j)?"Bonne chance 😈":""}`,
    say:()=>`📢 [Serveur] ${j||"…"}`,
    me:()=>`* Player ${j||"…"}`,
    seed:()=>`✅ Graine : 42-1337-666 (démo). copie-la pour reproduire ton monde.`,
    clear:()=>`✅ Inventaire nettoyé. Adieu la chair putréfiée.`,
    execute:()=>cmdMode==="java"?"✅ Commande exécutée dans le contexte donné. Puissance du datapack !":"⚠️ En Bedrock, la syntaxe est : /execute <cible> <x y z> <commande> (ancienne syntaxe !)",
    locate:()=>`✅ Structure la plus proche trouvée à 247 blocs. Suis la flèche 🧭`,
    spreadplayers:()=>`✅ Joueurs dispersés dans la zone. Que le meilleur gagne.`,
    gamerule:()=>`✅ Règle du jeu modifiée : ${j||"(règle)"}. ${/keepinventory/i.test(j)?"Tu gardes ton stuff en mourant, malin !":""}`,
    defaultgamemode:()=>`✅ Mode par défaut des nouveaux joueurs mis à jour.`,
    particle:()=>`✅ Particules en gerbe. Effet pyrotechnique maîtrisé ✨`,
    playsound:()=>`🔊 Son joué. Tourne ton volume… surprise.`,
    title:()=>`✅ Titre affiché en grand à l'écran. Cinématique !`,
    tellraw:()=>`✅ Message formaté envoyé ${cmdMode==="java"?"(JSON)":"(texte brut en Bedrock)"}.`,
    testfor:()=>`✅ Joueur trouvé. (Bedrock uniquement : Java utilise /execute if entity)`,
    ability:()=>`✅ Capacité accordée. Tu voles désormais 🕊️`,
    structure:()=>`✅ Structure collée. Construction instantanée !`,
    ride:()=>`✅ Monté à bord. Accroche-toi.`,
    camerashake:()=>`🎥 Écran secoué. Les joueurs hurlent (de joie).`,
    daylock:()=>`✅ Cycle jour/nuit gelé. Soleil éternel.`,
    function:()=>`✅ Fonction exécutée : toutes les commandes du fichier ont tourné.`,
    tag:()=>`✅ Étiquette appliquée à la cible.`,
    scoreboard:()=>`✅ Scoreboard opérationnel. Les stats s'affichent.`,
    team:()=>`✅ Équipe créée. (Java uniquement)`,
    worldborder:()=>`✅ Frontière du monde fixée. Sortie interdite.`,
    spectate:()=>`👁️ Vue spectateur attachée à l'entité.`,
    help:()=>`📜 Liste des commandes affichée. Mais le plus simple : la liste ci-dessous !`,
    list:()=>`✅ Joueurs en ligne : Player (1/20)`,
    replaceitem:()=>`✅ Objet placé dans le slot indiqué.`
  };
  const fn = known[verb];
  if(fn) cmdLog(`<span class="ok">${fn()}</span>`,true);
  else cmdLog(`<span class="ok">✅ Commande « ${verb} » reconnue (${cmdMode==="java"?C.j:C.b}).</span>`,true);
}
function paintCmdList(){
  const q = norm($("#cmd-search").value.trim());
  const list = COMMANDES.filter(c=>!q||norm(c.n).includes(q)||norm(c.cat).includes(q)||norm(c.d).includes(q));
  $("#cmd-list").innerHTML = list.length?list.map(c=>`
    <button class="cmd-chip" data-cmd="${c.n}">
      <span class="cc-n">/${c.n}</span><br><span class="cc-c">${c.cat}</span>
    </button>`).join(""):`<p class="empty">Aucune commande trouvée.</p>`;
  $("#cmd-list").querySelectorAll(".cmd-chip").forEach(b=>b.addEventListener("click",()=>{
    const c = COMMANDES.find(x=>x.n===b.dataset.cmd);
    const ex = c.e.replace(/'/g,"\\'");
    $("#modal-content").innerHTML = `<div class="m-ico">💻</div><h2>/${c.n}</h2>
      <div class="stat-grid"><div class="sg"><b>${esc(c.cat)}</b><span>Catégorie</span></div></div>
      <p>${esc(c.d)}</p>
      <div class="syn" style="margin-top:14px">
        <div class="j"><b>☕ JAVA</b>${esc(c.j)}</div>
        <div class="b"><b>📱 BEDROCK</b>${esc(c.b)}</div>
      </div>
      <div class="tip" style="margin-top:14px">Exemple : <code>${esc(c.e)}</code></div>
      <button class="btn btn-green" style="margin-top:16px" id="modal-test" data-ex="${esc(c.e)}">▶️ Tester cette commande</button>`;
    $("#modal").hidden = false;
    $("#modal-test").addEventListener("click",function(){
      $("#modal").hidden = true; $("#cmd-input").value = this.dataset.ex;
      setTimeout(()=>$("#cmd-run").click(),100);
    });
  }));
}

/* ---------- Recherche globale ---------- */
(function(){
  const input = $("#global-search"), drop = $("#gs-drop");
  const paint = ()=>{
    const q = norm(input.value.trim());
    if(q.length<2){ drop.hidden = true; return; }
    let hits = CATALOGUE.filter(o=>norm(o.n).includes(q)||(o.b&&norm(o.b).includes(q))).slice(0,14);
    if(q.startsWith("red")) hits = CATALOGUE.filter(o=>/redstone|red/.test(norm(o.n))||/redstone/i.test(o.b||"")||/redstone/i.test(o.d||"")).slice(0,14).concat(hits);
    const seen = new Set(); hits = hits.filter(h=>!seen.has(h._cat+h._slug)&&seen.add(h._cat+h._slug)).slice(0,12);
    drop.innerHTML = hits.length?hits.map(h=>`<a data-goto="${h._page}" data-cat="${h._cat.toLowerCase().split(" ")[0]}" data-slug="${h._slug}"><span class="gs-cat">${h._cat}</span> <b>${h.i||""} ${h.n}</b></a>`).join("")
      :`<a>😬 Aucun résultat… essaie « creeper », « red », « tp »…</a>`;
    drop.hidden = false;
    drop.querySelectorAll("[data-goto]").forEach(a=>a.addEventListener("click",()=>{
      drop.hidden = true; input.value = "";
      showPage(a.dataset.goto);
      if(a.dataset.goto==="craft" && a.dataset.cat==="recettes"){
        selRecipe = RECETTES.find(r=>r.key===a.dataset.slug)||selRecipe; paintRecipe(); paintCraftList();
      } else if(a.dataset.goto==="craft" && a.dataset.cat==="commandes"){
        const c = COMMANDES.find(x=>x.n===a.dataset.slug);
        if(c){ $("#cmd-input").value = c.e; setTimeout(()=>$("#cmd-run").click(),200); }
      } else setTimeout(()=>openFiche(a.dataset.cat,a.dataset.slug),350);
    }));
  };
  input.addEventListener("input",paint);
  input.addEventListener("keydown",e=>{ if(e.key==="Escape") drop.hidden=true; });
  document.addEventListener("click",e=>{ if(!e.target.closest(".gsearch")) drop.hidden = true; });
})();

/* ---------- Lien direct ?fiche= & burger ---------- */
(function(){
  const p = new URLSearchParams(location.search).get("fiche");
  if(p){ const hit = CATALOGUE.find(c=>c._slug===p);
    if(hit){ showPage(hit._page); setTimeout(()=>openFiche(hit._cat.toLowerCase().split(" ")[0],hit._slug),350); } }
  $("#burger").addEventListener("click",()=>{
    const t = $("#tabs"), open = t.classList.toggle("open");
    $("#burger").setAttribute("aria-expanded",open);
  });
})();

/* ---------- Favoris count + Creeper easter egg ---------- */
saveFav();
$("#creeper-btn").addEventListener("click",function(){
  this.textContent = "💥 BOOM !"; this.classList.add("boom");
  document.body.style.animation = "shake .5s";
  setTimeout(()=>{ document.body.style.animation = ""; this.textContent = " Aw… respawn ?"; },700);
  setTimeout(()=>{ this.textContent = " Creeper ?"; this.classList.remove("boom"); },2200);
});
