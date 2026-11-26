/* =====================================================
   MINECRAFT DICTIONNARY — ÉDITION ULTIME v2
   Mobs • Armes (bois→netherite) • Blocs + variantes • Potions • Biomes
   Pixel-art SVG • Recherche floue • Mini-jeu 2D
   ===================================================== */

/* ---------- 1. MOTEUR PIXEL-ART ---------- */
const PAL = {
  '.': null,
  k: '#0f0f12', w: '#f5f5f5', m: '#d8d8e0', s: '#9aa0a6', S: '#5f6368',
  g: '#57a63d', G: '#2f6b22', t: '#3ecf6f', e: '#4ee36a', E: '#2aa24a',
  b: '#8a5a2b', B: '#5c3a1a', u: '#7a4b22',
  r: '#d63c2f', R: '#8f1f16', o: '#e2762a', x: '#c96a1e',
  y: '#f2c12e', f: '#ff9d3c',
  c: '#35d9d9', C: '#1b8f8f', i: '#bfe8ff', I: '#7db8e8',
  p: '#a45de5', P: '#6b2fa8', n: '#3a3a44', N: '#23232b',
  h: '#f7d7a8', F: '#f2a0b5', D: '#c9758c',
  a: '#e7d8a8', A: '#c9b478', M: '#9b8bb0'
};

function svgFromGrid(grid, extraPal) {
  const pal = extraPal ? { ...PAL, ...extraPal } : PAL;
  let rects = '';
  grid.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const col = pal[ch];
      if (col) rects += `<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${col}"/>`;
    });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="crispEdges">${rects}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function face(main, out, eye, feature) {
  return [
    '.' + out.repeat(6) + '.',
    main.repeat(8),
    out + eye.repeat(2) + out + out + eye.repeat(2) + out,
    main.repeat(8),
    feature || main.repeat(8),
    main.repeat(8),
    '.' + out.repeat(6) + '.',
    '........'
  ];
}

function texGrid(base, dark, speck) {
  const rows = [];
  for (let y = 0; y < 8; y++) {
    let r = '';
    for (let x = 0; x < 8; x++) {
      const v = (x * 3 + y * 5 + x * y) % 7;
      r += (speck && v === 0) ? 'c' : (v < 2 ? 'b' : 'a');
    }
    rows.push(r);
  }
  return { grid: rows, pal: { a: base, b: dark, c: speck || dark } };
}

function bottleGrid(color) {
  return {
    grid: ['...ww...', '..w..w..', '.w....w.', '.wliilw.', '.wllllw.', '.wllllw.', '..wwww..', '........'],
    pal: { w: '#cfe3ee', l: color, i: '#ffffff' }
  };
}

/* ---------- 2. BASE DE DONNÉES ---------- */
function hashStr(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }
function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

const DATABASE = [];
function add(cat, sub, name, art, desc, tags, rarity, stats) {
  const id = slug(name);
  const h = hashStr(id);
  if (!stats) {
    if (cat === 'mob') stats = [
      { l: 'Danger', v: sub === 'boss' ? 100 : sub === 'hostile' ? Math.min(95, 35 + Math.round(rarity / 2) + h % 12) : 0 },
      { l: 'Vitesse', v: 30 + h % 60 },
      { l: 'Rareté', v: rarity }
    ];
    else if (cat === 'bloc') stats = [
      { l: 'Ressources', v: 40 + h % 50 },
      { l: 'Résistance', v: 20 + h % 70 },
      { l: 'Rareté', v: rarity }
    ];
    else if (cat === 'potion') stats = [
      { l: 'Efficacité', v: 50 + h % 45 },
      { l: 'Durée', v: 35 + h % 55 },
      { l: 'Rareté', v: rarity }
    ];
    else stats = [
      { l: 'Ressources', v: 40 + h % 55 },
      { l: 'Danger', v: sub === 'dimension' ? 90 : 15 + h % 55 },
      { l: 'Beauté', v: 45 + h % 50 }
    ];
  }
  DATABASE.push({ id, cat, sub, name, pix: art.grid, pal: art.pal, desc, stats, tags, rarity });
}

/* ===== MOBS — tous les mobs du jeu ===== */
function mob(sub, name, pix, desc, tags, rarity, stats) { add('mob', sub, name, pix, desc, tags, rarity, stats); }

mob('hostile', 'Zombie',
  { grid: ['.gggggg.', 'gGGGGGGg', 'gGkGGkGg', 'gGGGGGGg', 'gGGkkGGg', 'gGGGGGGg', '.gGGGGg.', '........'] },
  "Le mob hostile le plus iconique. Apparaît la nuit et dans le noir, frappe aux portes et brûle au soleil. Bébé zombie : plus rapide et il ne brûle pas !",
  ['nuit', 'foule', 'XP', 'village'], 10);
mob('hostile', 'Creeper',
  { grid: ['.gggggg.', 'gggggggg', 'gkkggkkg', 'gkkggkkg', 'gggkkggg', 'ggkkkkgg', 'ggkkkkgg', 'gggkkggg'] },
  "Shhh… BOUM. Il explose à proximité et détruit tes constructions. Les chats le terrifient : ton meilleur anti-creeper.",
  ['explosion', 'poudre à canon', 'icone', 'chat'], 20);
mob('hostile', 'Squelette',
  { grid: ['.ssssss.', 'ssssssss', 'sSkSSkSs', 'ssssssss', 'sSssssSs', 'ssskksss', '.ssssss.', '........'] },
  "Archer redoutable qui te canarde à distance. Brûle au soleil et craint les loups. Ses os servent à apprivoiser un chien et à faire de la farine d'os.",
  ['arc', 'os', 'nuit', 'loups'], 20);
mob('hostile', 'Enderman',
  { grid: ['.kkkkkk.', 'kkkkkkkk', 'kppkkppk', 'kkkkkkkk', 'kkkkkkkk', '.kkkkkk.', '........', '........'] },
  "Ne le regarde PAS dans les yeux. Téléporteur violet qui déplace des blocs. Une citrouille sur la tête le neutralise la nuit. Lâche des perles de l'Ender !",
  ['téléportation', 'perle', 'End', 'regard'], 45);
mob('hostile', 'Araignée',
  { grid: ['.kkkkkk.', 'kkkkkkkk', 'krrkkrrk', 'kkkkkkkk', 'kkkkkkkk', 'k.kkkk.k', 'k.k..k.k', '........'] },
  "Grimpe aux murs, passe par les fenêtres et saute sur toi. Neutre le jour, agressive la nuit. Sa soie sert aux crochets et à la laine.",
  ['grimpe', 'soie', 'nuit', 'œil'], 30);
mob('boss', "Dragon de l'Ender",
  { grid: ['n......n', 'nkkkkkkn', 'kppkkppk', 'kkkkkkkk', '.kkkkkk.', '.kkkkkk.', '..kkkk..', '........'] },
  "LE boss final. Vole autour des piliers d'obsidienne de l'End et se soigne grâce aux cristaux. Détruis les cristaux, frappe-le, récupère l'Œuf de Dragon !",
  ['boss', 'End', 'final', 'œuf'], 100);
mob('boss', 'Wither',
  { grid: ['.nnnnnn.', 'nnnnnnnn', 'nwwnnwwn', 'nnnnnnnn', 'nnwkkwnn', '.nnnnnn.', '..n..n..', '........'] },
  "Boss invoqué avec 4 sables des âmes et 3 têtes de Wither-Squelette. Tire des crânes explosifs et applique Wither II. Récompense : l'étoile du Nether !",
  ['boss', 'invoqué', 'nether star', 'sable des âmes'], 100);
mob('boss', 'Warden',
  { grid: ['.nnnnnn.', 'nnCnnCnn', 'nnnnnnnn', 'nnCnnCnn', 'nnnnnnnn', '.nCnnCn.', '........', '........'] },
  "L'horreur des Deep Dark. Aveugle, il chasse aux vibrations : reste immobile ou rampe avec de la laine. Il one-shot en difficulté normale.",
  ['aveugle', 'deep dark', 'sonar', 'sculk'], 95);
mob('hostile', 'Slime',
  { grid: ['........', '.gggggg.', 'gGGGGGGg', 'gGkGGkGg', 'gGGGGGGg', 'gGGGGGGg', '.GGGGGG.', '........'] },
  "Cube rebondissant qui se divise en petits slimes. Spawn dans les « chunks à slime ». La balle de slime fabrique blocs collants et pistons.",
  ['rebondit', 'chunk à slime', 'balle', 'divise'], 50);
mob('hostile', 'Blaze',
  { grid: ['..f..f..', '.yyyyyy.', 'yfkyykfy', 'yyyyyyyy', '.yykkyy.', '..yyyy..', '.f.ff.f.', 'f......f'] },
  "Gardien des forteresses du Nether. Vole, crache des boules de feu en rafale et brûle même sous l'eau. Ses bâtons sont OBLIGATOIRES pour l'End.",
  ['feu', 'nether', 'bâton', 'forteresse'], 60);
mob('hostile', 'Piglin',
  { grid: ['.FFFFFF.', 'FFFFFFFF', 'FFkFFkFF', 'FFFFFFFF', 'FFDDDFF.', 'FFFFFFFF', '.FFFFFF.', '........'] },
  "Obsédé par l'or. Porte son armure en or et il devient neutre — échange des lingots contre un cadeau aléatoire. Sans or, il appelle ses copains !",
  ['or', 'échange', 'nether', 'cadeau'], 55);
mob('passif', 'Golem de Fer',
  { grid: ['.ssssss.', 'ssssssss', 'sRssssRs', 'sssRRsss', 'sssRRsss', 'ssssssss', '.sSSSSs.', '........'] },
  "Le protecteur des villages : lance les ennemis à 30 blocs de haut. Construis-le avec 4 blocs de fer + une citrouille. Offre-lui une fleur !",
  ['village', 'protecteur', 'fer', 'fleur'], 40);
mob('passif', 'Loup',
  { grid: ['b......b', 'bbbbbbbb', 'bkbbbbkb', 'bbbbbbbb', 'bbBBBBbb', '.bBBBBb.', '..bbbb..', '........'] },
  "Ton meilleur ami pixel. Apprivoise-le avec des os : collier rouge, attaque tes cibles, se téléporte vers toi. Les loups sauvages chassent les squelettes.",
  ['os', 'animal', 'chien', 'apprivoise'], 35);
mob('passif', 'Axolotl',
  { grid: ['F.F..F.F', 'FFFFFFFF', 'FkFFFFkF', 'FFFFFFFF', '.FFFFFF.', '..F..F..', '........', '........'] },
  "Le mob le plus mignon du jeu. Combat pour toi sous l'eau et joue mort pour tromper ses ennemis. Nage avec lui : tu obtiens Régénération !",
  ['eau', 'mignon', 'seau', 'régén'], 70);
mob('passif', 'Vache',
  { grid: ['.bbbbbb.', 'bBbbbbBb', 'bkbbbbkb', 'bbbbbbbb', '.FFFFFF.', '.FkFFkF.', '..FFFF..', '........'] },
  "Source de steak, de lait et de cuir. Le lait supprime TOUS les effets, même le Wither du Wither ! Le classique indémodable des fermes.",
  ['lait', 'cuir', 'steak', 'village'], 15);
mob('passif', 'Allay', { grid: face('i', 'I', 'k', '.i....i.') },
  "Petit sprite bleu qui ramasse les objets pour toi. Donne-lui un item de référence et il collectera tous les exemplaires ! Adore danser sur la musique du juke-box.",
  ['collecte', 'juke-box', 'amate', 'danser'], 80);
mob('passif', 'Chat', { grid: face('m', 'S', 'k', 'mS.S.Sm.') },
  "S'apprivoise avec du poisson cru. 11 skins différents ! Dort sur ton lit et repousse les creepers et les phantoms de ton village.",
  ['poisson', 'animal', 'anti-creeper', 'câlin'], 35);
mob('passif', 'Poule', { grid: face('w', 'm', 'k', 'wwyyyyww') },
  "Pond un œuf toutes les 5-10 minutes. Les poussins naissent des œufs lancés ! Plumes + chair : le kit de survie du débutant.",
  ['œuf', 'plume', 'ferme', 'poussin'], 10);
mob('passif', 'Cochon', { grid: face('F', 'D', 'k', 'FDDDDDF.') },
  "Monte-le avec une selle et une carotte sur un bâton pour parcourir le monde en cochon-taxi. Porc cuit = le steak du pauvre.",
  ['porc', 'selle', 'carotte', 'ferme'], 10);
mob('passif', 'Mouton', { grid: face('w', 'm', 'k', 'wFFFFFFw') },
  "TONDS-LE avec des cisailles, ne le tue jamais : 1 à 3 laines renouvelables à l'infini. La laine se teint en 16 couleurs et bloque les vibrations du Warden.",
  ['laine', 'cisailles', 'teinture', 'tondre'], 10);
mob('passif', 'Champimeuh', { grid: face('r', 'R', 'k', 'rwrrwrrw') },
  "La vache mystique des îles aux champignons. Trais-la pour un ragoût suspect, coupe-la avec des cisailles et elle redevient une vache normale.",
  ['mycélium', 'ragoût', 'champignon', 'rare'], 75);
mob('passif', 'Cheval', { grid: face('b', 'B', 'k', 'bBb..bBb') },
  "Apprivoise-le à vide en montant dessus (cœurs = c'est bon). Le plus rapide des montures terrestres, avec armure en fer/or/diamant.",
  ['monture', 'selle', 'armure', 'rapide'], 35);
mob('passif', 'Âne', { grid: face('s', 'S', 'k', 'sS....Ss') },
  "Plus lent que le cheval mais il PORTE UN COFFRE : 15 emplacements de transport. Croise-le avec un cheval pour obtenir une mule.",
  ['coffre', 'monture', 'transport', 'mule'], 35);
mob('passif', 'Mule', { grid: face('s', 'S', 'k', 'sS.b.Ss.') },
  "Fille d'un âne et d'un cheval (stérile, comme dans la vraie vie). Combine la vitesse du cheval et le coffre de l'âne.",
  ['croisement', 'coffre', 'monture', 'rare'], 50);
mob('passif', 'Lama', { grid: face('m', 'S', 'k', 'mSSSSSm.') },
  "Crache sur ses agresseurs. Équipe-le d'un coffre (3 à 15 slots) et d'un tapis coloré. Suis-en un : toute la caravane te suit !",
  ['crache', 'caravane', 'tapis', 'coffre'], 40);
mob('passif', 'Ocelot', { grid: face('y', 'x', 'k', 'yxyxxyxy') },
  "Chat sauvage de la jungle. Extrêmement timide : reste immobile et regarde-le pour qu'il s'approche. Effraie les creepers comme son cousin domestique.",
  ['jungle', 'timide', 'chat', 'sauvage'], 45);
mob('passif', 'Panda', { grid: face('w', 'k', 'k', 'wkkwwkkw') },
  "Vit dans la jungle à bambou. 7 personnalités (paresseux, joueur, inquiet…) avec des visages différents ! Mange du bambou et fait des roulades.",
  ['bambou', 'mignon', 'jungle', 'personnalité'], 60);
mob('passif', 'Perroquet', { grid: face('r', 'R', 'k', 'ryyy.yyr') },
  "Imite le cri des mobs autour de lui et DANSE sur le juke-box. 5 couleurs. Jamais de cookies : c'est mortel pour lui (comme dans la vraie vie !).",
  ['imitation', 'danse', 'jungle', 'cookie'], 55);
mob('passif', 'Lapin', { grid: face('m', 'S', 'k', 'm..kk..m') },
  "Peaux, pattes de lapin (potion de saut !) et viande. Le légendaire Killer Bunny apparaît avec /summon… fuis si tu le croises.",
  ['peau', 'patte', 'saut', 'carotte'], 30);
mob('passif', 'Renard', { grid: face('o', 'x', 'k', 'ow....wo') },
  "Dort le jour, chasse la nuit. Ramasse des objets dans sa bouche (une épée !) et saute incroyablement haut. Aime les baies lumineuses.",
  ['nuit', 'chasse', 'baies', 'dort'], 45);
mob('passif', 'Abeille', { grid: face('y', 'x', 'k', 'ykyykyyk') },
  "Pollinise les fleurs puis fertilise tes cultures. Ne casse JAMAIS une ruche sans feu de camp dessous, sinon tout l'essaim te pique (poison !).",
  ['miel', 'ruche', 'pollen', 'feu de camp'], 40);
mob('passif', 'Tortue', { grid: face('g', 'G', 'k', 'ggk..kgg') },
  "Pond ses œufs sur SA plage d'origine. Les écailles font un casque de tortue (respiration aquatique +10s) et l'ingrédient de la potion du Maître Tortue.",
  ['écaille', 'plage', 'casque', 'œuf'], 50);
mob('passif', 'Grenouille', { grid: face('t', 'E', 'k', 'tt.tt.tt') },
  "Mange les petits slimes et crée des blocs lumineux (froglights) dont la couleur dépend de sa variante : tempérée, tropicale ou froide.",
  ['froglight', 'slime', 'variante', 'marais'], 45);
mob('passif', 'Têtard', { grid: face('n', 'N', 'k', '..n..n..') },
  "Le bébé de la grenouille. Se déplace dans un seau d'eau et grandit en grenouille selon le biome où il se développe.",
  ['bébé', 'seau', 'eau', 'croissance'], 55);
mob('passif', 'Dauphin', { grid: face('I', 'S', 'k', 'Ii....iI') },
  "Nage près de lui : la Grâce du Dauphin booste ta vitesse sous l'eau. Il te guide vers les épaves et les trésors engloutis.",
  ['grâce', 'nage', 'épave', 'trésor'], 50);
mob('passif', 'Calmar', { grid: face('C', 'N', 'k', 'CC.CC.CC') },
  "Lâche des poches d'encre pour fabriquer livres et panneaux. Les bébés calmars sortent des œufs posés dans l'eau.",
  ['encre', 'eau', 'livre', 'noir'], 20);
mob('passif', 'Calmar lumineux', { grid: face('c', 'C', 'k', 'cc.cc.cc') },
  "Version lumineuse des grandes profondeurs. Son encre illumine les cadres et fait briller le texte des panneaux.",
  ['lumineux', 'encre', 'cadre', 'profondeur'], 60);
mob('passif', 'Morue', { grid: face('s', 'S', 'k', '..s..s..') },
  "Le poisson des océans froids. Nourrit les chats et les ours polaires. Cuite, c'est l'encas de plongée.",
  ['océan', 'poisson', 'chat', 'froid'], 15);
mob('passif', 'Saumon', { grid: face('o', 'x', 'k', '..o..o..') },
  "Remonte les rivières et peuple les eaux froides. Cuit, il nourrit mieux que la morue. Les ours en raffolent.",
  ['rivière', 'ours', 'poisson', 'froid'], 15);
mob('passif', 'Poisson tropical', { grid: face('y', 'x', 'k', 'y.y..y.y') },
  "2700+ combinaisons de couleurs et de formes ! Se transporte dans un seau d'eau. La décoration vivante de ton aquarium.",
  ['couleur', 'seau', 'aquarium', 'corail'], 40);
mob('passif', 'Fugu', { grid: face('y', 'x', 'k', 'y.y.y.y.') },
  "Gonfle près des joueurs : le toucher empoisonne ! Le manger est une mauvaise idée… mais c'est LA source de potion de respiration aquatique.",
  ['poison', 'gonfle', 'respiration', 'océan'], 45);
mob('passif', 'Chauve-souris', { grid: face('n', 'N', 'k', 'n..nn..n') },
  "100 % décorative : vole en zigzag dans les grottes et n'en fait qu'à sa tête. Sa présence signale une grotte proche.",
  ['grotte', 'décoratif', 'vol', 'zigzag'], 25);
mob('passif', 'Chameau', { grid: face('a', 'A', 'k', 'a..aa..a') },
  "Deux places ! Monte à deux joueurs, saute TRÈS haut et marche au-dessus des zombies. Spawn dans les villages du désert.",
  ['désert', 'selle', 'saut', '2 places'], 45);
mob('passif', 'Sniffer', { grid: face('r', 'R', 'k', 'rDDDDDDr') },
  "Le grand gagnant du Mob Vote 2022. Renifle le sol et déterre des graines anciennes : fleur torche et graine de sniffer pour décorer !",
  ['vote 2022', 'graines', 'fleur torche', 'renifle'], 80);
mob('passif', 'Villageois', { grid: face('h', 'b', 'k', 'hbbbbb..') },
  "Échange des émeraudes contre tout un tas de trésors. Sa profession dépend du bloc pro (lettrine, alambic…). Protège-le : les golems veillent.",
  ['émeraude', 'échange', 'profession', 'village'], 15);
mob('passif', 'Marchand ambulant', { grid: face('h', 'b', 'k', 'h.p....p') },
  "Apparaît de nulle part avec ses lamas décoratifs. Échanges aléatoires (parfois nuls, parfois géniaux). Boit une potion d'invisibilité la nuit.",
  ['échange', 'lama', 'invisibilité', 'nomade'], 40);
mob('passif', 'Golem de Neige', { grid: face('w', 'm', 'k', 'wwffffww') },
  "Construis-le : 2 blocs de neige + citrouille. Tire des boules de neige (recul sans dégâts) et sème la neige derrière lui. Fond dans les biomes chauds.",
  ['neige', 'citrouille', 'boules', 'fond'], 35);
mob('passif', 'Cheval-squelette', { grid: face('s', 'S', 'k', 's..SS..s') },
  "Piège d'orage : un éclair fait apparaître 4 squelettes-cavaliers. Une fois libérés, les chevaux s'apprivoisent comme des chevaux normaux.",
  ['orage', 'éclair', 'piège', 'rare'], 80);
mob('passif', 'Cheval-zombie', { grid: face('g', 'G', 'k', 'g..GG..g') },
  "Extrêmement rare, jamais généré naturellement (uniquement /summon). Un zombie… qui aurait eu une vie plus saine.",
  ['zombie', 'summon', 'rare', 'monture'], 85);
mob('hostile', 'Noyé', { grid: face('t', 'E', 'k', 'tk..k..t') },
  "Zombie noyé des océans et rivières. Le SEUL moyen d'obtenir un trident : les noyés armés le lâchent (2 % sans enchantement… courage).",
  ['trident', 'océan', 'zombie', 'noyade'], 45);
mob('hostile', 'Momie (Husk)', { grid: face('a', 'A', 'k', 'ak..k..a') },
  "Zombie du désert : ne brûle PAS au soleil et inflige l'effet Faim. Sa poigne de sable te ralentit au contact.",
  ['désert', 'faim', 'sable', 'zombie'], 30);
mob('hostile', 'Wither Squelette', { grid: face('n', 'N', 'w', 'n.....n.') },
  "Hantent les forteresses du Nether avec leur épée de pierre : effet Wither 15 secondes ! Ramasse 3 têtes pour invoquer le Wither.",
  ['nether', 'wither', 'tête', 'forteresse'], 65);
mob('hostile', 'Vagabond (Stray)', { grid: face('s', 'S', 'I', 'sI....Is') },
  "Squelette des régions enneigées : ses flèches appliquent Lenteur. Bienvenue dans le club des archers glaciaires.",
  ['neige', 'lenteur', 'arc', 'froid'], 35);
mob('hostile', 'Bogged', { grid: face('s', 'S', 'k', 'sg..gs..') },
  "Squelette couvert de mousse des salles d'épreuve. Ses flèches sont empoisonnées. La mousse s'arrache… à la hache.",
  ['mousse', 'poison', 'trial', 'salle'], 55);
mob('hostile', 'Breeze', { grid: face('c', 'C', 'k', '.c.cc.c.') },
  "Le fantôme du vent des salles d'épreuve. Saute dans tous les sens, tire des boules de vent qui te propulsent. Lâche des bâtons de vent.",
  ['vent', 'saut', 'trial', 'bâton'], 65);
mob('hostile', 'Cube de Magma', { grid: face('x', 'o', 'k', 'xooooox.') },
  "La version infernale du slime : immunisé au feu, flotte dans la lave. La crème de magma sert aux potions de résistance au feu.",
  ['lave', 'feu', 'crème', 'nether'], 50);
mob('hostile', 'Ghast', { grid: face('w', 'm', 'k', 'wm..m..w') },
  "Le fantôme géant du Nether qui PLEURE. Ses boules de feu se renvoient à la main nue ou à l'épée (exploit légendaire). Larmes de ghast = régénération.",
  ['nether', 'boule de feu', 'larmes', 'vole'], 60);
mob('hostile', 'Piglin zombifié', { grid: face('g', 'G', 'k', 'gF..F..g') },
  "Neutre… jusqu'à ce que tu frappes UN SEUL d'entre eux. Alors c'est toute la horde qui te tombe dessus. Porte des pépites d'or.",
  ['neutre', 'horde', 'or', 'nether'], 40);
mob('hostile', 'Piglin Brute', { grid: face('F', 'D', 'k', 'FDN..NDF') },
  "La brute des bastions : JAMAIS neutre, aucun échange possible. Hache en or, 50 PV, zéro pitié. Évite-le ou prépare-toi à mourir.",
  ['bastion', 'hache', 'brute', 'nether'], 70);
mob('hostile', 'Hoglin', { grid: face('D', 'R', 'k', 'D.....D.') },
  "La bête sauvage des forêts carmin. FUIT les champignons tordus et les portails. Côtelettes crues/cuites = la nourriture du Nether.",
  ['nether', 'côtelette', 'champignon', 'bélier'], 55);
mob('hostile', 'Zoglin', { grid: face('D', 'R', 'k', 'Dk...kD.') },
  "Un hoglin resté trop longtemps dans le monde normal : zombifié et FOU. Attaque absolument tout le monde, même les autres zombies.",
  ['zombie', 'furie', 'attaque tout', 'rare'], 60);
mob('hostile', "Araignée des cavernes", { grid: face('N', 'k', 'r', 'N.r..r.N') },
  "La petite sœur venimeuse de l'araignée : elle s'infiltre PARTOUT (0,5 bloc !) et son poison s'accumule. Terreur des mines abandonnées.",
  ['poison', 'mine', 'petite', 'venin'], 50);
mob('hostile', 'Endermite', { grid: face('p', 'P', 'k', '.p.pp.p.') },
  "Apparaît parfois (5 %) quand une perle de l'Ender se téléporte. Les endermans la HAISSENT et la pourchassent. Parfaite pour farmer les endermans !",
  ['perle', 'téléportation', 'appât', 'End'], 60);
mob('hostile', "Poisson d'argent", { grid: face('s', 'S', 'k', '.s.ss.s.') },
  "Se cache dans les blocs de pierre infestés (impossibles à distinguer !). Quand tu en touches un, TOUTE la colonne sort de la muraille.",
  ['infesté', 'muraille', 'colonie', 'surprise'], 35);
mob('hostile', 'Phantom', { grid: face('I', 'S', 'k', 'I.I..I.I') },
  "Spawn si tu ne dors pas 3 jours d'affilée. Plongent en piqué sur toi. Leurs membranes réparent les élytras : DORS, ou farme !",
  ['insomnie', 'piqué', 'membrane', 'elytra'], 45);
mob('hostile', 'Gardien', { grid: face('C', 'N', 'k', 'CkkkkkkC') },
  "Œil unique géant, rayon laser à 15 blocs : cache-toi derrière des blocs entre deux tirs. Ils gardent les monuments océaniques.",
  ['laser', 'monument', 'océan', 'prismarine'], 55);
mob('hostile', 'Grand Gardien', { grid: face('C', 'N', 'k', 'CkkkkkkC') },
  "Le boss du monument : 3 par monument, effet « Mal de pioche » (minage 5x plus lent) et ÉPONGES en récompense. Le boss de la mi-partie aquatique.",
  ['boss', 'éponge', 'monument', 'mal de pioche'], 75);
mob('hostile', 'Pillard', { grid: face('m', 'S', 'k', 'm..bb..m') },
  "L'arbalétrier des avant-postes et des raids. Tue un capitaine (bannière sur la tête) et tu déclenches Mauvais Présage → RAID sur le village.",
  ['raid', 'arbalète', 'avant-poste', 'bannière'], 40);
mob('hostile', 'Évocateur', { grid: face('m', 'S', 'k', 'm.pp..p.') },
  "Le mage des manoirs et des raids. Invoque des crocs de sol et des vexs. Lâche le TOTEM d'immortalité : une seconde vie dans ta main !",
  ['totem', 'crocs', 'vex', 'manoir'], 80);
mob('hostile', 'Vindicateur', { grid: face('m', 'S', 'k', 'm.bb..b.') },
  "Le hachoir des manoirs : hache en fer, sprint, dégâts lourds. Nomme-le « Johnny » et il attaque ABSOLUMENT TOUT le monde (référence culte).",
  ['hache', 'manoir', 'johnny', 'raid'], 55);
mob('hostile', 'Illusionniste', { grid: face('m', 'S', 'k', 'm..cc..m') },
  "Le mage fantôme : non-généré naturellement, uniquement via /summon. Crée des clones d'illusion et devient invisible pour mieux te surprendre.",
  ['illusion', 'clones', 'summon', 'invisible'], 90);
mob('hostile', 'Vex', { grid: face('c', 'C', 'k', '.k....k.') },
  "Mini fantômes invoqués par l'évocateur : TRAVERSENT les murs avec leur épée de fer. Durée de vie limitée, mais insupportables.",
  ['murs', 'épée', 'invoqué', 'vol'], 60);
mob('hostile', 'Ravageur', { grid: face('s', 'S', 'r', 's.....s.') },
  "Le bélier de guerre des raids : 100 PV, détruit les récoltes et les feuilles, projette les joueurs en l'air. Lâche une selle.",
  ['raid', 'bélier', '100 PV', 'selle'], 70);
mob('hostile', 'Sorcière',
  { grid: ['..pppp..', '.pppppp.', 'pppppppp', '.hhhhhh.', 'hhkhhkhh', '.hkkkkh.', '........', '........'] },
  "Vit dans les cabanes des marais. Lance potions de poison, lenteur et dégâts… et se soigne avec ses propres potions. Drop : redstone, sucre, poudre.",
  ['potion', 'cabane', 'marais', 'alchimie'], 55);
mob('hostile', 'Géant', { grid: face('g', 'G', 'k', '.ggggg..') },
  "Le zombie de 12 blocs de haut : 100 PV mais incapable de te viser correctement. Uniquement invoqué avec /summon — le mob fantôme de la bêta.",
  ['zombie', '12 blocs', 'summon', 'bêta'], 85);
mob('hostile', 'Zombie villageois', { grid: face('g', 'G', 'k', 'g..hh..g') },
  "Un villageois mordu ! GUÉRIS-LE : potion de faiblesse + pomme dorée → rabais permanents sur ses échanges. La ruse des gros commerçants d'émeraudes.",
  ['guérison', 'rabais', 'pomme', 'village'], 40);

/* ===== ARMES & OUTILS : 6 matériaux x 5 outils, générés ===== */
/* ===== ARMES & OUTILS : 6 matériaux x 5 outils, générés ===== */
const MATERIAUX = [
  ['bois', 'b', 'B', 5], ['pierre', 's', 'S', 15], ['fer', 'm', 'S', 30],
  ['or', 'y', 'x', 40], ['diamant', 'c', 'C', 70], ['netherite', 'n', 'N', 95]
];
const MAT_DESC = {
  bois: "l'outil de débutant : fragile mais gratuit, parfait pour la première heure.",
  pierre: "le bon compromis de la early game, abondant et vite remplacé.",
  fer: "le standard fiable de l'aventure : solide, réparable, facile à trouver.",
  or: "ultra rapide mais casse vite : réserve-le au Nether et au style.",
  diamant: "robuste et redoutable : le rêve de tout mineur depuis 2010.",
  netherite: "le sommet absolu : résiste au feu et au lavage au lodestone."
};
const SHAPES = [
  ['......QQ', '.....QQ.', '....QQ..', '...QQ...', '..uQ....', '.uu.....', 'uu......', '........'],
  ['.QQQQQQ.', 'QQ....QQ', 'Q...u..Q', '....u...', '...u....', '..u.....', '..u.....', '.u......'],
  ['..QQQ...', '.QQQQQ..', '.QQuQQ..', '..Qu.q..', '...u....', '...u....', '..u.....', '..u.....'],
  ['...QQ...', '..QQQQ..', '..qQQq..', '...uu...', '...u....', '...u....', '..u.....', '..u.....'],
  ['.QQQQQ..', '.q...q..', '.....u..', '....u...', '....u...', '...u....', '...u....', '..u.....']
];
const OUTILS = ['Épée', 'Pioche', 'Hache', 'Pelle', 'Houe'];
MATERIAUX.forEach(([mat, c1, c2, rare], mi) => {
  OUTILS.forEach((outil, oi) => {
    const name = outil + ' en ' + mat;
    const grid = SHAPES[oi].map(r => r.replace(/Q/g, c1).replace(/q/g, c2));
    const stats = [
      { l: 'Dégâts', v: Math.min(95, 8 + mi * 15 + oi * 3) },
      { l: 'Durabilité', v: Math.min(100, 10 + mi * 18) },
      { l: 'Rareté', v: Math.min(100, rare + oi) }
    ];
    add('arme', outil.toLowerCase(), name, { grid }, "L'" + outil.toLowerCase() + " en " + mat + " : " + MAT_DESC[mat],
      [mat, outil.toLowerCase(), 'outil', 'craft'], Math.min(100, rare + oi), stats);
  });
});

/* ===== BLOCS ===== */
function bloc(sub, name, art, desc, tags, rarity) { add('bloc', sub, name, art, desc, tags, rarity); }
bloc('naturel', 'Herbe', texGrid('#57a63d', '#2f6b22', '#3ecf6f'),
  "Le bloc le plus répandu du monde. Les creepers y laissent des cratères, les moutons y paissent, et il meurt sous les blocs opaques.",
  ['vert', 'surface', 'commun', 'pelouse'], 1);
bloc('naturel', 'Terre', texGrid('#8a5a2b', '#5c3a1a', '#a06a35'),
  "Humble, innombrable, indestructible par l'érosion… mais sans elle, pas de fermes. Se transforme en chemin avec une pelle.",
  ['sol', 'ferme', 'commun', 'pelle'], 1);
bloc('naturel', 'Pierre', texGrid('#9a9aa0', '#7d7d84', '#b5b5bb'),
  "La base de la mining : 64 blocs plus bas, c'est chez toi. Se crainte en cobblestone et devient andésite au fil des veines.",
  ['mine', 'commun', 'cobblestone', 'souterrain'], 1);
bloc('naturel', 'Sable', texGrid('#e7d8a8', '#c9b478', '#f5e8c0'),
  "Tombant sous l'effet de la gravité, il ensevelit les imprudents. Fond en verre au four et s'accorde aux tortues.",
  ['gravité', 'verre', 'désert', 'plage'], 5);
bloc('naturel', 'Glowstone', texGrid('#f2c12e', '#c9932a', '#ffe98a'),
  "La lampe du Nether : éclaire 15 niveaux, au maximum possible. Se mine en poussière et se recompose en blocs.",
  ['lumière', 'nether', 'lampe', 'poussière'], 55);
bloc('naturel', 'Obsidienne', texGrid('#23232b', '#141419', '#3a3a52'),
  "Quasi indestructible (10 s à la pioche diamant !), née de l'eau sur la lave. 10 blocs suffisent pour un portail du Nether.",
  ['portail', 'lave', 'résistant', 'end'], 45);
bloc('naturel', 'Netherrack', texGrid('#7a2119', '#5a130e', '#93362c'),
  "La chair de pierre du Nether : brûle à l'infini une fois allumée. Fragile, mais forme tout l'enfer du jeu.",
  ['nether', 'feu', 'rouge', 'infini'], 20);
bloc('naturel', "Roche de l'End", texGrid('#d8dba8', '#b5b885', '#ecefbf'),
  "La pierre pâle de la dimension finale : résiste au dragon et ne brûle jamais. Un air de grès interstellaire.",
  ['end', 'pâle', 'dimension', 'dragon'], 50);
bloc('précieux', 'Minerai de diamant', texGrid('#9a9aa0', '#7d7d84', '#4ee3e3'),
  "LE graal du minage, entre les couches -59 et 16. Une pioche en fer minimum, sinon adieu le diamant…",
  ['diamant', 'mine', 'graal', 'profond'], 80);
bloc('précieux', 'Minerai d\'or', texGrid('#9a9aa0', '#7d7d84', '#f2c12e'),
  "Caché dans la pierre et les badlands. L'or du Nether est 10 fois plus fréquent : les piglins le savent.",
  ['or', 'mine', 'piglin', 'badlands'], 45);
bloc('précieux', "Minerai d'émeraude", texGrid('#9a9aa0', '#7d7d84', '#3ecf6f'),
  "Le minerai le plus rare du jeu : exclusif aux montagnes et aux biomes de pics. La monnaie officielle des villageois.",
  ['émeraude', 'rare', 'montagne', 'monnaie'], 90);
bloc('précieux', 'Minerai de redstone', texGrid('#9a9aa0', '#7d7d84', '#d63c2f'),
  "S'illumine quand on marche dessus. Poudre rouge = circuits, potions et horloges. La base de toute l'ingénierie du jeu.",
  ['redstone', 'circuit', 'lumière', 'ingénierie'], 40);
bloc('précieux', 'Minerai de lapis-lazuli', texGrid('#9a9aa0', '#7d7d84', '#4a9eff'),
  "Bleu profond du sous-sol : indispensable aux enchantements et aux teintures. Les pyramides égyptiennes n'ont qu'à bien se tenir.",
  ['lapis', 'enchantement', 'bleu', 'teinture'], 40);
bloc('fabriqué', 'Table de craft', texGrid('#8a5a2b', '#5c3a1a', '#b5885a'),
  "Le premier bloc à poser de toute aventure : 2x2 devient 3x3 et le monde s'ouvre. Sans elle, tu restes un villageois sans métier.",
  ['craft', '3x3', 'premier', 'essentiel'], 2);
bloc('fabriqué', 'Four', texGrid('#7d7d84', '#5a5a60', '#9a9aa0'),
  "Cuire un steak, fondre un fer, griller du sable : le four est la seconde moitié de ta base. Version blast furnace pour l'urgence.",
  ['cuisson', 'fondre', 'base', 'steak'], 2);
bloc('fabriqué', 'Coffre', texGrid('#8a5a2b', '#5c3a1a', '#c9a35a'),
  "27 cases de bonheur (54 pour le double). Résiste à la lave ? Non. Mais un âne mort récupère son coffre : pense-y !",
  ['stockage', '27 cases', 'butin', 'base'], 5);
bloc('fabriqué', 'TNT', texGrid('#d63c2f', '#8f1f16', '#f5f5f5'),
  "4 sables + 5 poudres = 1 TNT. Mine massive, pièges, canons… ou la fin de ta base si tu confonds clic gauche et briquet.",
  ['explosion', 'poudre', 'mine', 'piège'], 35);
bloc('fabriqué', 'Verre', texGrid('#bfe8ff', '#7db8e8', '#e8f6ff'),
  "Transparent, artisanal, fragile : le luxe du bâtisseur. Fond en 0,5 s face à un creeper en colère.",
  ['transparent', 'fenêtre', 'bâtiment', 'sable'], 10);
bloc('fabriqué', 'Briques', texGrid('#c96a1e', '#9a4a12', '#e2762a'),
  "Argile cuite au four : résistant au ghast, esthétique à souhait. Le bloc des maisons de bourgeois du village.",
  ['maison', 'résistant', 'argile', 'bâtiment'], 20);
bloc('fabriqué', 'Bloc d\'or', texGrid('#f2c12e', '#c9932a', '#ffe98a'),
  "9 lingots compactés en décoration criarde. Les piglins s'en servent de piédestal : pose-toi la question du luxe.",
  ['or', 'piglin', 'décoration', 'luxe'], 45);
bloc('fabriqué', "Bloc d'émeraude", texGrid('#3ecf6f', '#2aa24a', '#8ef5b0'),
  "9 émeraudes = 1 bloc de richesse pure. Le modo de la banque du village : personne ne peut te le voler en survie.",
  ['émeraude', 'richesse', 'stockage', 'vert'], 75);
bloc('fabriqué', 'Bloc de diamant', texGrid('#4ee3e3', '#1b8f8f', '#b0f5f5'),
  "Le symbole de la réussite Minecraft. 9 diamants, une armure full enchantée et le respect éternel du serveur.",
  ['diamant', 'richesse', 'finale', 'cyan'], 85);

/* ===== POTIONS ===== */
function potion(sub, name, color, desc, tags, rarity) { add('potion', sub, name, bottleGrid(color), desc, tags, rarity); }
potion('positive', 'Potion de soin', '#e04a3a',
  "Rend instantanément 4 points de vie. La classique des combats de boss : garde-en toujours deux sur toi.",
  ['soin', 'instantané', 'combat', 'nether wart'], 25);
potion('positive', 'Potion de force', '#c96a1e',
  "Booste tes dégâts au corps à corps de 130 % en niveau II. Le combo tueur : force II + épée en netherite.",
  ['force', 'dégâts', 'combat', 'poudre à canon'], 45);
potion('positive', 'Potion de rapidité', '#7db8e8',
  "Vitesse de déplacement +20 % (II : +40 %). Le choice des pvp-istes et des fuyards de creepers.",
  ['vitesse', 'fuite', 'pvp', 'sucre'], 30);
potion('positive', 'Potion de régénération', '#f2a0b5',
  "Régénère la vie progressivement pendant 45 s. Ghast tears + nether wart : le remède des longues sessions de raid.",
  ['régén', 'lent', 'ghast', 'raid'], 55);
potion('positive', 'Potion de résistance au feu', '#ff9d3c',
  "Immunise contre le feu et la lave : plonge dans le Nether sans stress. Le choix n°1 des explorateurs de l'enfer.",
  ['feu', 'lave', 'nether', 'magma'], 40);
potion('positive', 'Potion d\'invisibilité', '#bfe8ff',
  "Rend ton skin invisible (pas ton armure !). Idéal pour infiltrer un bastion ou jouer au fantôme entre amis.",
  ['invisible', 'furtif', 'bastion', 'carrot'], 60);
potion('positive', 'Potion de nuit', '#1b2f8f',
  "Vois clair dans le noir absolu. Indispensable pour miner ou visiter les Deep Dark sans torche en main.",
  ['nuit', 'vision', 'grotte', 'minage'], 35);
potion('positive', 'Potion de chute lente', '#cfe3ee',
  "Tombe en douceur pendant 90 s : fini les chutes mortelles de l'End. À boire avant tout saut de la foi.",
  ['chute', 'saut', 'end', 'plume'], 40);
potion('négative', 'Potion de poison', '#3ecf6f',
  "Empoisonne jusqu'à laisser 1 demi-cœur. Redoutable en flèche traînante sur un boss… ou sur ton ami.",
  ['poison', 'dégâts', 'flèche', 'araignée'], 35);
potion('négative', 'Potion de faiblesse', '#9aa0a6',
  "Réduit les dégâts infligés de 4 points. Le secret pour ZOMBIFIER puis guérir un villageois : coût réduit garanti.",
  ['faiblesse', 'guérison', 'villageois', 'zombie'], 30);
potion('négative', 'Potion de lenteur', '#7a8f9c',
  "Ralentit la cible à 60 % de sa vitesse. La peur des pvp-istes : impossible de fuir, impossible de rattraper.",
  ['lenteur', 'pvp', 'piege', 'slime'], 30);
potion('spéciale', 'Potion d\'expérience', '#4ee36a',
  "Version rare du savoir : donne des points d'XP à la bouteille. Lâchée par les pêcheurs et les towers de mobs.",
  ['xp', 'bouteille', 'rare', 'pêche'], 65);
potion('spéciale', 'Potion du Maître Tortue', '#3ecf6f',
  "Slowness IV + Résistance III : un escargot blindé. Le choix stratégique contre les boss rapides comme le Warden.",
  ['tortue', 'résistance', 'lenteur', 'stratégie'], 75);
potion('spéciale', 'Potion de chance', '#3ecf6f',
  "Augmente la qualité du butin de pêche et de trésor. Non-craftable : exclusive aux maps et aux luck blocks.",
  ['chance', 'butin', 'pêche', 'rare'], 85);

/* ===== BIOMES ===== */
function biome(sub, name, art, desc, tags, rarity) { add('biome', sub, name, art, desc, tags, rarity); }
biome('overworld', 'Plaines', texGrid('#57a63d', '#2f6b22', '#6bc94f'),
  "Le biome du départ : plat, vert, sûr. Villages, abeilles, chevaux et le coucher de soleil le plus instagrammable.",
  ['départ', 'village', 'vert', 'sur'], 1);
biome('overworld', 'Désert', texGrid('#e7d8a8', '#c9b478', '#f5e8c0'),
  "Sable, cactus, temples à pièges à TNT et momies qui ne brûlent pas au soleil. Apportez de l'eau et de la prudence.",
  ['sable', 'temple', 'husk', 'cactus'], 20);
biome('overworld', 'Jungle', texGrid('#2aa24a', '#1a6b2f', '#3ecf6f'),
  "L'enfer vert : bambous, pandas, perroquets et temples aux crochets. On y perd vite le nord (et la laine).",
  ['bambou', 'panda', 'temple', 'dense'], 35);
biome('overworld', 'Taïga', texGrid('#3a6b3f', '#255228', '#4a8a52'),
  "Sapins, loups, renards, villages et baies lumineuses. Le biome cocon parfait pour une base en rondins.",
  ['loups', 'renard', 'sapin', 'village'], 25);
biome('overworld', 'Marais', texGrid('#4a6b3a', '#2f4a24', '#5c7a3a'),
  "Grenouilles, sorcières, cabanes et nénuphars. Le paradis du slime : creuse sous la lune et écoute le « boing ».",
  ['sorcière', 'slime', 'grenouille', 'cabane'], 30);
biome('overworld', 'Toundra enneigée', texGrid('#eef0f6', '#b8c4d8', '#ffffff'),
  "Blanc à perte de vue : igloos, ours polaires, strays et villages gelés. La neige transforme tout en carte postale.",
  ['neige', 'igloo', 'ours', 'froid'], 25);
biome('overworld', 'Montagnes', texGrid('#8a8f9c', '#5a5f6c', '#c9ccd8'),
  "Pics à 250 blocs d'altitude, émeraudes, chèvres et chutes vertigineuses. La vue la plus belle du jeu.",
  ['émeraude', 'hauteur', 'chèvre', 'pic'], 40);
biome('overworld', 'Océan', texGrid('#1b8f8f', '#0f5a5a', '#35d9d9'),
  "Monuments gardés par des gardiens, épaves, trésors et corridors de corail. Apporte ta potion de respiration !",
  ['monument', 'épave', 'trésor', 'gardien'], 30);
biome('overworld', 'Grottes de stalactites', texGrid('#8a5a2b', '#5c3a1a', '#b5885a'),
  "Stalactites qui tombent, stalagmites qui percent et gouffres de lave. Le biome le plus dangereux du Overworld.",
  ['grotte', 'lave', 'pointe', 'dangereux'], 45);
biome('nether', 'Forêt carmin', texGrid('#8f1f16', '#5a130e', '#c96a1e'),
  "Le bois rouge du Nether : hoglins, piglins et champignons géants. Le biome le plus vivant de l'enfer.",
  ['hoglin', 'piglin', 'rouge', 'champignon'], 40);
biome('nether', 'Forêt tordue', texGrid('#6b2fa8', '#3a1a5c', '#a45de5'),
  "Le seul endroit sûr du Nether : les piglins la fuient ! Endermans à gogo, parfait pour farmer les perles.",
  ['enderman', 'perle', 'sûr', 'violet'], 45);
biome('nether', 'Terres désolées', texGrid('#7a2119', '#4a0f0a', '#93362c'),
  "Le Nether classique : netherrack, lave à perte de vue, ghasts et Forteresses aux blazes. Apporte des bottes en or.",
  ['ghast', 'lave', 'forteresse', 'blaze'], 35);
biome('nether', 'Deep Dark', texGrid('#23232b', '#141419', '#35d9d9'),
  "Le biome du silence : sculk, capteurs et WARDEN. Rampe, rampe, rampe. Le butin le plus riche… si tu sors vivant.",
  ['warden', 'sculk', 'silence', 'cité'], 85);
biome('end', "L'End (île centrale)", texGrid('#d8dba8', '#b5b885', '#ecefbf'),
  "Le plateau de Combat : piliers d'obsidienne, cristaux et le Dragon. Une fois vaincu, le portail vers la ville s'ouvre.",
  ['dragon', 'boss', 'cristaux', 'final'], 90);
biome('end', "Terres de l'End", texGrid('#d8dba8', '#b5b885', '#ecefbf'),
  "L'infinité pâle des îles extérieures : villes de l'End, elytras et shulkers. La zone de fin de partie la plus gratifiante.",
  ['elytra', 'shulker', 'ville', 'fin de partie'], 70);

/* ---------- 3. ÉTAT + OUTILS UI ---------- */
const $ = s => document.querySelector(s);
const RAR_CLASS = { commun: 'rarity-commun', rare: 'rarity-rare', 'épique': 'rarity-épique', 'légendaire': 'rarity-légendaire' };
const SUBS = {
  mob: ['boss', 'hostile', 'passif'],
  arme: ['épée', 'pioche', 'hache', 'pelle', 'houe'],
  bloc: ['naturel', 'précieux', 'fabriqué'],
  potion: ['positive', 'négative', 'spéciale'],
  biome: ['overworld', 'nether', 'end']
};
const state = {
  cat: 'mob', sub: null, q: '',
  favs: JSON.parse(localStorage.getItem('mcd-favs') || '[]')
};
function rarityOf(v) { return v >= 85 ? 'légendaire' : v >= 60 ? 'épique' : v >= 25 ? 'rare' : 'commun'; }

function matchQuery(it) {
  if (!state.q) return true;
  const q = norm(state.q);
  const n = norm(it.name);
  if (n.includes(q)) return true;
  let i = 0;
  for (const ch of n) { if (ch === q[i]) i++; }
  return i === q.length || norm(it.tags.join(' ') + ' ' + (it.desc || '')).includes(q);
}

function cardHTML(it) {
  const rar = rarityOf(it.rarity);
  return `<article class="card cat-${it.cat} rarity-${rar}" tabindex="0" data-id="${it.id}">
    <button class="fav-btn ${state.favs.includes(it.id) ? 'on' : ''}" aria-label="Ajouter aux favoris">★</button>
    <img src="${svgFromGrid(it.pix, it.pal)}" alt="${it.name}">
    <h3>${it.name}</h3>
    <div class="card-meta">
      <span class="card-cat">${it.cat}</span>
      <span class="rarity-pill ${RAR_CLASS[rar]}">${rar}</span>
    </div>
    <span class="top-stat">${it.stats[0].l} : ${it.stats[0].v}</span>
  </article>`;
}

function renderSubs() {
  const bar = $('#subfilter-bar');
  const subs = SUBS[state.cat] || [];
  bar.innerHTML = subs.map(s =>
    `<button class="chip ${state.sub === s ? 'active' : ''}" data-sub="${s}">${s}</button>`
  ).join('') + `<button class="chip random" title="Fiche au hasard">🎲 Aléatoire</button>`;
}

function render() {
  const list = DATABASE.filter(it => it.cat === state.cat)
    .filter(it => !state.sub || it.sub === state.sub)
    .filter(matchQuery);
  $('#cards-grid').innerHTML = list.map(cardHTML).join('');
  $('#shown-count').textContent = list.length;
  $('#empty-state').classList.toggle('hidden', list.length > 0);
  renderSubs();
}

function updateCounts() {
  ['mob', 'arme', 'bloc', 'potion', 'biome'].forEach(c => {
    const el = $('#count-' + c);
    if (el) el.textContent = DATABASE.filter(i => i.cat === c).length;
  });
  $('#total-count').textContent = DATABASE.length;
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.add('hidden'), 2200);
}

/* ---------- 4. MODAL ---------- */
function openModal(it) {
  const rar = rarityOf(it.rarity);
  $('#modal-body').innerHTML = `
    <div class="modal-hero cat-${it.cat}">
      <img src="${svgFromGrid(it.pix, it.pal)}" alt="${it.name}">
      <div>
        <h2>${it.name}</h2>
        <div class="modal-tags">
          <span class="pill">${it.cat}</span>
          <span class="pill">${it.sub || ''}</span>
          <span class="rarity-pill ${RAR_CLASS[rar]}">${rar}</span>
        </div>
      </div>
    </div>
    <p class="modal-desc">${it.desc}</p>
    <div class="stat-bars">${it.stats.map(s => `
      <div class="stat-row">
        <span class="stat-label">${s.l}</span>
        <span class="stat-track"><span class="stat-fill" style="width:${Math.min(100, s.v)}%"></span></span>
        <span class="stat-val">${s.v}</span>
      </div>`).join('')}</div>
    <div class="modal-chips">${it.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>`;
  $('#modal-overlay').classList.remove('hidden');
}
function closeModal() { $('#modal-overlay').classList.add('hidden'); }

/* ---------- 5. RECHERCHE ---------- */
function showSuggestions() {
  const box = $('#search-suggestions');
  if (!state.q) { box.classList.add('hidden'); return; }
  const q = norm(state.q);
  const picks = DATABASE.filter(it => norm(it.name).includes(q)).slice(0, 6);
  box.innerHTML = picks.map(it =>
    `<button class="suggestion" data-id="${it.id}">
       <span class="sug-name">${it.name}</span>
       <span class="sug-cat">${it.cat}</span>
     </button>`).join('');
  box.classList.toggle('hidden', !picks.length);
}

/* ---------- 6. MINI-JEU : DIAMOND DASH ---------- */
const cv = $('#game-canvas'), cx = cv.getContext('2d');
const W = cv.width, H = cv.height, GROUND = H - 34;
let game = null, rafId = 0;

function newGame() {
  return {
    run: false, paused: false, t: 0, speed: 3,
    p: { x: 50, y: GROUND - 26, vy: 0, jumps: 0, inv: 0 },
    obs: [], gems: [], score: 0, gemsN: 0, lives: 3
  };
}
function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function hud() {
  $('#hud-score').textContent = '💎 ' + game.gemsN;
  $('#hud-lives').textContent = '❤'.repeat(Math.max(0, game.lives)) + '·'.repeat(3 - Math.max(0, game.lives));
  $('#hud-best').textContent = '🏆 Record : ' + (localStorage.getItem('mcd-best') || 0);
}
function startGame() {
  game = newGame();
  game.run = true;
  $('#game-start').classList.add('hidden');
  $('#game-over').classList.add('hidden');
  hud();
  cancelAnimationFrame(rafId);
  loop();
  toast('C\'est parti ! Espace = sauter, double saut possible !');
}
function endGame() {
  game.run = false;
  const best = Math.max(Number(localStorage.getItem('mcd-best') || 0), Math.floor(game.score));
  localStorage.setItem('mcd-best', best);
  $('#go-score').textContent = 'Score : ' + Math.floor(game.score) + ' • 💎 ' + game.gemsN + ' diamants';
  $('#game-over').classList.remove('hidden');
  $('#game-start').classList.remove('hidden');
  hud();
}
function jump() {
  if (!game || !game.run || game.paused) return;
  const p = game.p;
  if (p.jumps < 2) { p.vy = p.jumps ? -10 : -11.5; p.jumps++; }
}
function togglePause() {
  if (!game || !game.run) return;
  game.paused = !game.paused;
  toast(game.paused ? 'Pause…' : 'Reprise !');
}
function stopGame() { if (game) { game.run = false; cancelAnimationFrame(rafId); } }

function step() {
  const g = game;
  if (g.paused) return;
  g.t++;
  g.speed = 3 + Math.min(4, g.score / 150);
  const p = g.p;
  p.vy += 0.55;
  p.y += p.vy;
  if (p.y >= GROUND - 26) { p.y = GROUND - 26; p.vy = 0; p.jumps = 0; }
  if (g.t % Math.max(50, Math.round(110 - g.speed * 9)) === 0) g.obs.push({ x: W + 20, w: 22, h: 26 });
  if (g.t % 95 === 0) g.gems.push({ x: W + 20, y: GROUND - 55 - Math.random() * 95, w: 16, h: 16 });
  g.obs.forEach(o => o.x -= g.speed);
  g.gems.forEach(o => o.x -= g.speed);
  g.obs = g.obs.filter(o => o.x + o.w > -10);
  g.gems = g.gems.filter(o => o.x > -10);
  if (p.inv > 0) p.inv--;
  g.score += 0.1;
  const pb = { x: p.x, y: p.y, w: 22, h: 26 };
  for (const o of g.obs) {
    if (p.inv === 0 && hit(pb, { x: o.x, y: GROUND - o.h, w: o.w, h: o.h })) {
      g.lives--; p.inv = 90; hud();
      if (g.lives <= 0) { endGame(); return; }
      toast('Aïe ! Encore ' + g.lives + ' vie(s)…');
    }
  }
  g.gems = g.gems.filter(gm => {
    if (hit(pb, gm)) { g.gemsN++; g.score += 5; hud(); return false; }
    return true;
  });
}

function draw() {
  const g = game;
  cx.clearRect(0, 0, W, H);
  cx.fillStyle = '#1a1a2e';
  cx.fillRect(0, 0, W, H);
  cx.fillStyle = 'rgba(87, 166, 61, .12)';
  for (let i = 0; i < 5; i++) cx.fillRect((i * 137 + (g.t * 0.4) % 137) % W, 40 + i * 18, 26, 8);
  cx.fillStyle = '#2f6b22';
  cx.fillRect(0, GROUND, W, H - GROUND);
  cx.fillStyle = '#8a5a2b';
  for (let x = -(g.t * g.speed % 24); x < W; x += 24) cx.fillRect(x, GROUND + 12, 10, 6);
  g.gems.forEach(gm => {
    cx.fillStyle = '#4ee3e3';
    cx.beginPath();
    cx.moveTo(gm.x + 8, gm.y);
    cx.lineTo(gm.x + 16, gm.y + 6);
    cx.lineTo(gm.x + 8, gm.y + 16);
    cx.lineTo(gm.x, gm.y + 6);
    cx.closePath();
    cx.fill();
  });
  g.obs.forEach(o => {
    cx.fillStyle = '#3ecf6f';
    cx.fillRect(o.x, GROUND - o.h, o.w, o.h);
    cx.fillStyle = '#0f0f12';
    cx.fillRect(o.x + 4, GROUND - o.h + 6, 4, 5);
    cx.fillRect(o.x + 14, GROUND - o.h + 6, 4, 5);
    cx.fillRect(o.x + 9, GROUND - o.h + 14, 4, 6);
  });
  const p = g.p;
  if (p.inv === 0 || Math.floor(g.t / 4) % 2 === 0) {
    cx.fillStyle = '#57a63d';
    cx.fillRect(p.x, p.y, 22, 26);
    cx.fillStyle = '#0f0f12';
    cx.fillRect(p.x + 4, p.y + 7, 4, 4);
    cx.fillRect(p.x + 14, p.y + 7, 4, 4);
  }
  if (g.paused) {
    cx.fillStyle = 'rgba(13, 14, 20, .7)';
    cx.fillRect(0, 0, W, H);
    cx.fillStyle = '#4ee3e3';
    cx.font = "16px 'Press Start 2P', monospace";
    cx.textAlign = 'center';
    cx.fillText('PAUSE', W / 2, H / 2);
  }
}

function loop() {
  rafId = requestAnimationFrame(loop);
  if (!game || !game.run) { cancelAnimationFrame(rafId); return; }
  step();
  draw();
}

/* ---------- 7. ÉVÉNEMENTS ---------- */
function bindTabs() {
  $('#tabs').addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    const jeu = tab.dataset.cat === 'jeu';
    $('#game-section').classList.toggle('hidden', !jeu);
    $('#browser').classList.toggle('hidden', jeu);
    if (jeu) { stopGame(); $('#game-start').classList.remove('hidden'); $('#game-over').classList.add('hidden'); }
    else { state.cat = tab.dataset.cat; state.sub = null; render(); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
function bindSubs() {
  $('#subfilter-bar').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (chip.classList.contains('random')) {
      const list = DATABASE.filter(it => it.cat === state.cat);
      const pick = list[Math.floor(Math.random() * list.length)];
      openModal(pick);
      toast('Fiche aléatoire : ' + pick.name + ' !');
      return;
    }
    state.sub = state.sub === chip.dataset.sub ? null : chip.dataset.sub;
    render();
  });
}
function bindSearch() {
  const input = $('#search-input');
  input.addEventListener('input', () => {
    state.q = input.value.trim();
    $('#search-clear').classList.toggle('hidden', !state.q);
    render();
    showSuggestions();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); input.blur(); }
    if (e.key === 'Enter') {
      const first = $('#search-suggestions .suggestion');
      if (first) { first.click(); }
    }
  });
  $('#search-suggestions').addEventListener('mousedown', e => {
    const sug = e.target.closest('.suggestion');
    if (!sug) return;
    e.preventDefault();
    openModal(DATABASE.find(it => it.id === sug.dataset.id));
    $('#search-suggestions').classList.add('hidden');
  });
  $('#search-clear').addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.focus();
  });
  document.querySelectorAll('.hint-chip').forEach(chip => chip.addEventListener('click', () => {
    input.value = chip.dataset.q;
    input.dispatchEvent(new Event('input'));
    input.focus();
  }));
}
function bindGrid() {
  const grid = $('#cards-grid');
  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const item = DATABASE.find(it => it.id === card.dataset.id);
    if (e.target.closest('.fav-btn')) {
      const i = state.favs.indexOf(item.id);
      if (i >= 0) { state.favs.splice(i, 1); toast('Retiré des favoris.'); }
      else { state.favs.push(item.id); toast('★ ' + item.name + ' ajouté aux favoris !'); }
      localStorage.setItem('mcd-favs', JSON.stringify(state.favs));
      e.target.closest('.fav-btn').classList.toggle('on');
      return;
    }
    openModal(item);
  });
  grid.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) {
      e.preventDefault();
      openModal(DATABASE.find(it => it.id === e.target.dataset.id));
    }
  });
  $('#reset-filters').addEventListener('click', () => {
    state.q = ''; state.sub = null;
    $('#search-input').value = '';
    $('#search-clear').classList.add('hidden');
    render();
    toast('Filtres réinitialisés.');
  });
}
function bindModal() {
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
function bindGame() {
  $('#game-start').addEventListener('click', startGame);
  $('#game-restart').addEventListener('click', startGame);
  cv.addEventListener('mousedown', e => { e.preventDefault(); jump(); });
  document.addEventListener('keydown', e => {
    const jeuVisible = !$('#game-section').classList.contains('hidden');
    if (!jeuVisible) return;
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    if (e.code === 'KeyP') togglePause();
  });
}

/* ---------- 8. INIT ---------- */
updateCounts();
bindTabs();
bindSubs();
bindSearch();
bindGrid();
bindModal();
bindGame();
render();
