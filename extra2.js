/* ============ ULTRA v3 — Pages : Enchantements, Nourriture, Villageois, Succès, Redstone, Seeds + Jarvis + Comparateur ============ */
"use strict";

/* ---------- CSS additionnel ---------- */
(function(){ const st=document.createElement("style"); st.textContent=`
.v3-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.v3-card{background:#12151c;border:3px solid #000;padding:14px;cursor:pointer;transition:.18s;box-shadow:inset -4px -4px 0 rgba(0,0,0,.4)}
.v3-card:hover{transform:translateY(-3px);border-color:var(--diamond);box-shadow:var(--glow-d)}
.v3-card h4{font-family:var(--px);font-size:10px;color:#fff;margin:8px 0;line-height:1.6}
.v3-card p{color:var(--muted);font-size:17px}
.jarvis-box{background:#0d1f24;border:3px solid #000;padding:18px;box-shadow:0 0 24px rgba(74,237,217,.25)}
.jarvis-log{background:#050b0d;border:3px solid #000;padding:12px;min-height:220px;max-height:420px;overflow:auto;margin-top:12px;font-size:19px}
.j-msg{margin-bottom:10px;padding:8px 10px;border-radius:2px}
.j-msg.u{background:#1a2430;color:#fff}
.j-msg.b{background:#0d2818;color:#a8f0c0;border-left:4px solid var(--grass)}
.j-msg b{color:var(--diamond)}
.j-input{display:flex;gap:10px;margin-top:12px}
.j-input input{flex:1;min-width:200px;padding:12px;background:#0a0c10;color:var(--text);border:3px solid #000;font-family:var(--body);font-size:19px}
.j-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
.j-chips button{background:#0d1016;border:2px solid #262b34;color:var(--muted);padding:6px 10px;font-size:16px;font-family:var(--body)}
.j-chips button:hover{border-color:var(--diamond);color:#fff}
.seed-code{font-family:'Courier New',monospace;color:var(--gold);background:#0a0c10;border:2px solid #262b34;padding:2px 6px;word-break:break-all}
.rg-card{background:#12151c;border:3px solid #000;padding:16px;margin-bottom:12px;box-shadow:inset -4px -4px 0 rgba(0,0,0,.4)}
.rg-card h4{font-family:var(--px);font-size:11px;color:var(--gold);margin-bottom:8px}
.rg-card p{color:var(--muted);font-size:18px}
`;document.head.appendChild(st);})();

/* ---------- Ouverture de fiche générique v3 ---------- */
const V3CATS = {
 ench:{arr:ENCHANTS, t:"✨ Enchantement"},
 food:{arr:FOODS, t:"🍗 Nourriture"},
 vill:{arr:VILLAGERS, t:"💰 Métier"},
 succes:{arr:SUCCES, t:"🏆 Succès"},
 red:{arr:REDSTONE_GUIDE, t:"⚡ Guide Redstone"},
 seed:{arr:SEEDS, t:"🗺️ Seed"}
};
function openViche(cat,k){
  const c = V3CATS[cat]; if(!c) return;
  const o = c.arr.find(x=>slug(x.n)===k || slug(x.t||x.n)===k);
  if(!o) return;
  const stats = [];
  if(cat==="ench"){ stats.push([o.obj,"Objets"],[o.max,"Niveau max"],[o.eff,"Effet"]); }
  if(cat==="food"){ stats.push([o.h,"Faim"],[o.s,"Saturation"],[o.w,"Obtention"]); }
  if(cat==="vill"){ stats.push([o.bloc,"Bloc de métier"],[o.trades,"Échanges"]); }
  if(cat==="succes"){ stats.push([o.d,"Objectif"],[o.how,"Comment"]); }
  if(cat==="seed"){ stats.push([o.v,"Version"],[o.n,"Graine"]); }
  const tip = o.s2 || o.s || o.d;
  $("#modal-content").innerHTML = `
    <div class="m-ico">${o.i||"✨"}</div><h2>${o.n||o.t}</h2>
    <div class="stat-grid">${stats.map(([v,l])=>`<div class="sg"><b>${esc(String(v))}</b><span>${l}</span></div>`).join("")}</div>
    ${tip?`<div class="tip">💡 ${esc(tip)}</div>`:""}
    <p class="share-hint">Lien : ${location.origin+location.pathname}?fiche=${k}</p>
    <button class="btn btn-green" style="margin-top:16px" id="modal-fav2">${isFav(cat+"/"+slug(o.n))?"★ Retirer des favoris":"☆ Ajouter aux favoris"}</button>`;
  $("#modal").hidden = false;
  $("#modal-fav2").onclick = ()=>{ toggleFav(cat+"/"+slug(o.n)); openViche(cat,k); };
}
function v3Grid(cat){
  const c = V3CATS[cat];
  return `<div class="v3-grid">${c.arr.map(o=>`
    <div class="v3-card" data-v3="${cat}" data-k="${slug(o.n)}" tabindex="0">
      <div style="font-size:30px">${o.i||"✨"}</div>
      <h4>${o.n||o.t}</h4>
      <p>${cat==="ench"?o.obj:cat==="food"?`🍖 ${o.h} faim · ${o.s} sat.`:cat==="vill"?o.bloc:cat==="succes"?o.d:cat==="seed"?o.v:esc(String(o.d).slice(0,80))+"…"}</p>
    </div>`).join("")}</div>`;
}
document.addEventListener("click",e=>{
  const c = e.target.closest("[data-v3]");
  if(c) openViche(c.dataset.v3,c.dataset.k);
});
document.addEventListener("keydown",e=>{
  const c = e.target.closest && e.target.closest("[data-v3]");
  if(c && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); openViche(c.dataset.v3,c.dataset.k); }
});

/* ---------- Rendu des pages v3 ---------- */
function v3Page(id,title,sub,cat,listHTML){
  const page = document.getElementById(id);
  page.innerHTML = `<h2 class="page-title">${title}<small>${sub}</small></h2>
    <div class="toolbar"><input type="search" placeholder="🔍 Filtrer…" data-v3filter="${cat}"></div>${listHTML}`;
  const input = page.querySelector("input");
  input.addEventListener("input",()=>{
    const q = norm(input.value.trim());
    const arr = V3CATS[cat].arr.filter(o=>!q||norm(o.n||o.t).includes(q)||norm(JSON.stringify(o)).includes(q));
    page.querySelector(".v3-grid").innerHTML = arr.map(o=>`
      <div class="v3-card" data-v3="${cat}" data-k="${slug(o.n)}" tabindex="0">
        <div style="font-size:30px">${o.i||"✨"}</div><h4>${o.n||o.t}</h4>
        <p>${cat==="ench"?o.obj:cat==="food"?`🍖 ${o.h} faim · ${o.s} sat.`:cat==="vill"?o.bloc:cat==="succes"?o.d:esc(String(o.d).slice(0,80))+"…"}</p>
      </div>`).join("") || `<p class="empty">Aucun résultat.</p>`;
  });
}
v3Page("page-enchantements","✨ Encyclopédie des enchantements",ENCHANTS.length+" enchantements · niveaux max, objets compatibles et effets","ench",v3Grid("ench"));
v3Page("page-nourriture","🍗 Toute la nourriture",FOODS.length+" aliments · faim, saturation et où les trouver","food",v3Grid("food"));
v3Page("page-villageois","💰 Guide des villageois",VILLAGERS.length+" métiers · tous les échanges en un coup d'œil","vill",v3Grid("vill"));
v3Page("page-succes","🏆 Les succès",SUCCES.length+" succès avec leur méthode de déblocage","succes",v3Grid("succes"));
v3Page("page-seeds","🗺️ Seeds célèbres",SEEDS.length+" graines à tester · copie le code dans la création de monde","seed",v3Grid("seed"));

/* Page Redstone (pas de grille, cartes larges) */
document.getElementById("page-redstone").innerHTML = `
  <h2 class="page-title">⚡ Guide Redstone complet<small>${REDSTONE_GUIDE.length} chapitres · des bases aux machines volantes</small></h2>
  ${REDSTONE_GUIDE.map(g=>`<div class="rg-card"><h4>${g.t}</h4><p>${g.d}</p></div>`).join("")}`;

/* ---------- COMPARATEUR D'ARMES (dans le simulateur) ---------- */
(function(){
  const page = document.getElementById("page-simulateur");
  const box = document.createElement("div");
  const armes = TOUTES_ARMES;
  box.innerHTML = `
    <h2 class="page-title" style="margin-top:40px">📊 Comparateur d'armes<small>Mets deux armes face à face</small></h2>
    <div class="sim-box">
      <div class="sim-row"><label>Arme A</label><select id="cmp-a">${armes.map((a,i)=>`<option value="${i}">${a.i} ${a.n}</option>`).join("")}</select></div>
      <div class="sim-row"><label>Arme B</label><select id="cmp-b">${armes.map((a,i)=>`<option value="${i}" ${i===1?"selected":""}>${a.i} ${a.n}</option>`).join("")}</select></div>
      <div class="sim-out" id="cmp-out"></div>
    </div>`;
  page.appendChild(box);
  const paint = ()=>{
    const a = armes[+document.getElementById("cmp-a").value];
    const b = armes[+document.getElementById("cmp-b").value];
    const row = (label,va,vb,best)=>{
      const goodA = va>=vb, colA = goodA?"var(--diamond)":"var(--muted)", colB = goodA?"var(--muted)":"var(--diamond)";
      return `<tr><td style="color:${colA};font-weight:bold">${va}</td><th>${label}</th><td style="color:${colB};font-weight:bold">${vb}</td></tr>`;
    };
    document.getElementById("cmp-out").innerHTML = `
      <table class="weapon-table" style="margin-top:0">
        <tr><th>${a.n}</th><th style="text-align:center">VS</th><th>${b.n}</th></tr>
        ${row("Dégâts par coup",a.d??0,b.d??0)}
        ${row("Durabilité",a.dur??"∞",b.dur??"∞")}
        ${row("DPS (frappe continue)",((a.d??0)/0.625).toFixed(1),((b.d??0)/0.625).toFixed(1))}
        ${row("Type",a.t,b.t)}
      </table>
      <div class="tip" style="margin-top:12px">💡 ${((a.d??0)>=(b.d??0))?a.n:b.n} frappe plus fort, ${((a.dur??9999)>(b.dur??9999))?a.n:b.n} dure plus longtemps.</div>`;
  };
  document.getElementById("cmp-a").addEventListener("change",paint);
  document.getElementById("cmp-b").addEventListener("change",paint);
  paint();
})();

/* ---------- JARVIS v2 ---------- */
(function(){
  const page = document.getElementById("page-jarvis");
  page.innerHTML = `
    <h2 class="page-title">🤖 Jarvis v2<small>L'assistant Minecraft : pose ta question, il répond à partir des fiches du site</small></h2>
    <div class="jarvis-box">
      <div class="j-input">
        <input id="j-q" type="text" placeholder="Ex : combien de PV a le warden ? recette arc ? commande tp ?" aria-label="Question pour Jarvis">
        <button class="btn btn-diamond" id="j-send">Demander</button>
      </div>
      <div class="j-chips">
        ${["Combien de PV a le creeper ?","Comment craft un arc ?","Meilleure nourriture ?","Enchantement épée ?","Métier villageois ?","Commande pour voler ?"].map(q=>`<button data-jq="${q}">${q}</button>`).join("")}
      </div>
      <div class="jarvis-log" id="j-log" aria-live="polite">
        <div class="j-msg b">🤖 Bonjour, je suis Jarvis. Je réponds à toute question sur le contenu du site : mobs, armes, potions, blocs, biomes, recettes, commandes, enchantements, nourriture, villageois, succès et seeds. Je ne réponds à rien d'autre : je suis 100% Minecraft !</div>
      </div>
    </div>`;
  const log = document.getElementById("j-log");
  const add = (html,cls)=>{ log.insertAdjacentHTML("beforeend",`<div class="j-msg ${cls}">${html}</div>`); log.scrollTop = log.scrollHeight; };
  const answer = qRaw=>{
    const q = norm(qRaw);
    if(!q) return;
    add("🧑‍🚀 "+esc(qRaw),"u");
    if(/^(salut|bonjour|hey|coucou|hello)/.test(q)){ add("🤖 Salut commandant ! Quelle est ta question Minecraft ?","b"); return; }
    // Recherche dans tous les corpus
    const corpus = [
      ...MOBS.map(o=>({cat:"Mob",o,k:slug(o.n),ico:o.i,fields:[[o.hp,"PV"],[o.d,"Dégâts"],[o.b,"Habitat"],[o.l,"Butin"]],tip:o.s})),
      ...TOUTES_ARMES.map(o=>({cat:"Arme",o,k:slug(o.n),ico:o.i,fields:[[o.d,"Dégâts"],[o.dur,"Durabilité"],[o.b,"Obtention"]],tip:o.s})),
      ...POTIONS.map(o=>({cat:"Potion",o,k:slug(o.n),ico:o.i,fields:[[o.e,"Effet"],[o.d,"Durée"],[o.ing,"Ingrédient"]],tip:o.s})),
      ...BLOCS.map(o=>({cat:"Bloc",o,k:slug(o.n),ico:o.i,fields:[[o.hard,"Dureté"],[o.o,"Outil"],[o.w,"Où"]],tip:o.s})),
      ...BIOMES.map(o=>({cat:"Biome",o,k:slug(o.n),ico:o.i,fields:[[o.dim,"Dimension"],[o.cl,"Climat"],[o.mobs,"Mobs"]],tip:o.s})),
      ...RECETTES.map(o=>({cat:"Recette",o,k:o.key,ico:"🛠️",fields:[[o.o,"Résultat"],[Object.values(o.m).join(", "),"Ingrédients"]],tip:"Ouvre l'onglet Craft pour la grille 3×3."})),
      ...COMMANDES.map(o=>({cat:"Commande",o,k:slug(o.n),ico:"💻",fields:[["/"+o.n,"Syntaxe Java : "+o.j,"Syntaxe Bedrock : "+o.b].slice(0,1),[o.e,"Exemple"]],tip:o.d})),
      ...ENCHANTS.map(o=>({cat:"Enchantement",o,k:slug(o.n),ico:"✨",fields:[[o.obj,"Objets"],[o.max,"Niveau max"],[o.eff,"Effet"]],tip:""})),
      ...FOODS.map(o=>({cat:"Nourriture",o,k:slug(o.n),ico:o.i,fields:[[o.h,"Faim"],[o.s,"Saturation"],[o.w,"Obtention"]],tip:o.s2})),
      ...VILLAGERS.map(o=>({cat:"Métier",o,k:slug(o.n),ico:o.i,fields:[[o.bloc,"Bloc"],[o.trades,"Échanges"]],tip:o.s})),
      ...SUCCES.map(o=>({cat:"Succès",o,k:slug(o.n),ico:o.i,fields:[[o.d,"Objectif"],[o.how,"Comment"]],tip:""})),
      ...SEEDS.map(o=>({cat:"Seed",o,k:slug(o.n),ico:o.i,fields:[[o.n,"Graine"],[o.v,"Version"]],tip:o.d}))
    ];
    let hits = corpus.filter(c=>norm(c.o.n||c.o.t||"").includes(q) || q.split(/\s+/).some(w=>w.length>3 && norm(c.o.n||"").includes(w)));
    hits.sort((a,b)=>(norm(b.o.n||"").includes(q)?1:0)-(norm(a.o.n||"").includes(q)?1:0));
    if(/recette|craft|fabriq/.test(q) && !hits.length) hits = corpus.filter(c=>c.cat==="Recette");
    if(!hits.length){
      add(`🤖 Hmm, je ne trouve pas ça dans mes fiches… Je ne connais que Minecraft et seulement ce qui est sur le site ! Essaie par exemple : « warden », « épée netherite », « potion de vitesse », « recette four », « commande tp », « villageois », « seed ».`,`b`);
      return;
    }
    const h = hits[0];
    const extra = hits.length>1 ? `<br><span style="color:var(--muted);font-size:16px">(J'ai aussi trouvé : ${hits.slice(1,4).map(x=>x.o.n).join(", ")})</span>` : "";
    add(`🤖 <b>${h.ico} ${esc(h.o.n||h.o.t)}</b> · ${h.cat}${extra}<br>
      ${h.fields.filter(f=>f[0]!==undefined&&f[0]!=="").map(f=>`<br>▸ <span style="color:var(--muted)">${esc(f[1])} :</span> ${esc(String(f[0]))}`).join("")}
      ${h.tip?`<br>💡 ${esc(h.tip)}`:""}${h.cat==="Commande"?`<br><span style="color:var(--muted);font-size:16px">⚠️ En Java : ${esc(h.o.j)} · En Bedrock : ${esc(h.o.b)}</span>`:""}
      ${h.cat==="Recette"?`<br><button class="btn btn-green" style="margin-top:10px;font-size:9px;padding:8px 12px" onclick="showPage('craft');setTimeout(()=>{const r=RECETTES.find(x=>x.key==='${h.k}');if(r){selRecipe=r;paintRecipe();paintCraftList();}},400)">Voir la grille 3×3</button>`:""}`,"b");
  };
  document.getElementById("j-send").addEventListener("click",()=>{ const i=document.getElementById("j-q"); answer(i.value); i.value=""; });
  document.getElementById("j-q").addEventListener("keydown",e=>{ if(e.key==="Enter"){ answer(e.target.value); e.target.value=""; } });
  document.querySelectorAll(".j-chips button").forEach(b=>b.addEventListener("click",()=>answer(b.dataset.jq)));
})();
