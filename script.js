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