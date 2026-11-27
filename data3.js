/* ============ DONNÉES v3 — Enchantements, Nourriture, Villageois, Succès, Redstone, Seeds ============ */
"use strict";

const ENCHANTS = [
 // Armure
 {n:"Protection",obj:"Casque, plastron, jambières, bottes",max:"IV",eff:"Réduit presque tous les dégâts de 4% par niveau (max 16% par pièce, plafond à 80% cumulés)."},
 {n:"Protection contre le feu",obj:"Toutes les pièces",max:"IV",eff:"Réduit les dégâts de feu et de lave. Niveau IV = baignade dans la lave presque sans douleur."},
 {n:"Protection contre les explosions",obj:"Toutes les pièces",max:"IV",eff:"Anti-creeper et anti-TNT. Indispensable en raid ou en mine TNT."},
 {n:"Protection contre les projectiles",obj:"Toutes les pièces",max:"IV",eff:"Anti-squelettes et anti-ghasts."},
 {n:"Épines",obj:"Plastron (toutes pièces)",max:"III",eff:"Renvoie des dégâts à l'attaquant. Attention : use l'armure vite."},
 {n:"Respiration",obj:"Casque",max:"III",eff:"+15 secondes d'air sous l'eau par niveau, et chance de voir clair en apnée."},
 {n:"Affinité aquatique",obj:"Casque",max:"I",eff:"Mine sous l'eau à la vitesse normale (sinon 5× plus lent)."},
 {n:"Chute amortie",obj:"Bottes",max:"IV",eff:"Réduit fortement les dégâts de chute. Bottes de survie obligatoires."},
 {n:"Marche glaciale",obj:"Bottes",max:"II",eff:"Transforme l'eau en glace en marchant. Pratique, risqué (le sol redevient eau)."},
 {n:"Solidité",obj:"Tout",max:"III",eff:"Durabilité ×(1+niveau). III = l'objet dure 4× plus longtemps."},
 {n:"Réparation (Mending)",obj:"Tout",max:"I",eff:"L'XP réparé l'objet au lieu de monter tes niveaux. LE meilleur enchantement du jeu."},
 // Épée
 {n:"Tranchant",obj:"Épée, hache",max:"V",eff:"+1 à +3 dégâts. Le choix polyvalent contre tout."},
 {n:"Châtiment",obj:"Épée",max:"V",eff:"+2,5 dégâts par niveau contre les undead (zombies, squelettes, withers)."},
 {n:"Fléau des arthropodes",obj:"Épée",max:"V",eff:"Dégâts massifs contre araignées, silverfish et endermites, +ralentissement."},
 {n:"Recul",obj:"Épée",max:"II",eff:"Pousse la cible plus loin. Bien contre les creepers."},
 {n:"Aure de feu",obj:"Épée",max:"II",eff:"Enflamme la cible 4 secondes par niveau. Cuit le porc à la mort !"},
 {n:"Butin",obj:"Épée (houe aussi)",max:"III",eff:"Plus de drops : +1 drop par niveau. Farm de perles et de têtes obligatoire."},
 {n:"Affilage",obj:"Épée",max:"III",eff:"Attaque en balayage plus forte contre les groupes."},
 // Outils
 {n:"Efficacité",obj:"Pioche, hache, pelle, houe",max:"V",eff:"Mine de plus en plus vite. V = vitesse fulgurante."},
 {n:"Toucher de soie",obj:"Pioche, hache, pelle, houe",max:"I",eff:"Récolte le bloc lui-même (diamant brut, bibliothèque, bloc de spawner…)."},
 {n:"Fortune",obj:"Pioche, hache, houe",max:"III",eff:"Plus de drops sur les minerais (jusqu'à ×4 diamants !) et les cultures."},
 // Arc / Arbalète / Trident / Massue
 {n:"Puissance",obj:"Arc",max:"V",eff:"+25% × (niveau+1) dégâts. Puissance V = tue un squelette en un coup chargé."},
 {n:"Frappe",obj:"Arc",max:"II",eff:"Recul énorme sur la cible."},
 {n:"Flamme",obj:"Arc",max:"I",eff:"Flèches enflammées. Cuit la viande et allume la TNT."},
 {n:"Infinité",obj:"Arc",max:"I",eff:"Une seule flèche suffit (sauf flèches spéciales). incompatible avec Réparation."},
 {n:"Recharge rapide",obj:"Arbalète",max:"III",eff:"Recharge quasi instantanée."},
 {n:"Tir multiple",obj:"Arbalète",max:"I",eff:"3 flèches d'un coup. Dévastateur avec des feux d'artifice."},
 {n:"Perforation",obj:"Arbalète",max:"IV",eff:"Les flèches traversent les mobs et les boucliers."},
 {n:"Loyauté",obj:"Trident",max:"III",eff:"Le trident revient dans ta main. Lancement illimité."},
 {n:"Impulsion",obj:"Trident",max:"V",eff:"+1,25 dégât par niveau sous l'eau ou sous la pluie."},
 {n:"Courant marin",obj:"Trident",max:"III",eff:"Téléporte-toi avec en temps de pluie. VOL par temps d'orage !"},
 {n:"Canal",obj:"Trident",max:"I",eff:"Foudroie la cible touchée en orage. Creeper chargé garanti."},
 {n:"Densité",obj:"Massue",max:"V",eff:"+0,5 dégât par bloc de chute par niveau."},
 {n:"Brèche",obj:"Massue",max:"IV",eff:"Ignore une partie de l'armure adverse. Anti-warden et anti-boss."},
 {n:"Souffle du vent",obj:"Massue",max:"III",eff:"Propulse en l'air après un coup. Combo aérien infini."}
];

const FOODS = [
 {n:"Steak",i:"🥩",h:8,s:12.8,w:"Vaches",s2:"Le meilleur rapport faim/saturation du jeu. La base de la survie."},
 {n:"Porc cuit",i:"🍖",h:8,s:12.8,w:"Cochons",s2:"Équivalent steak."},
 {n:"Mouton cuit",i:"🍖",h:6,s:9.6,w:"Moutons",s2:"Bon rendement avec Fortune sur la culture."},
 {n:"Poulet rôti",i:"🍗",h:6,s:7.2,w:"Poules",s2:"Fermes à poulets ultra efficaces avec œufs."},
 {n:"Carotte dorée",i:"🥕",h:6,s:14.4,w:"Craft : 8 pépites d'or + carotte",s2:"LA meilleure saturation du jeu. Nourriture des chevaux et des lamas."},
 {n:"Pomme dorée",i:"🍎",h:4,s:9.6,w:"Craft : 8 lingots d'or + pomme",s2:"+2 cœurs d'absorption et régénération. À garder pour les combats."},
 {n:"Pomme enchantée",i:"🏆",h:4,s:9.6,w:"Craft : 8 blocs d'or + pomme",s2:"Régénération IV, résistance, absorption IV. Le trésor ultime."},
 {n:"Pain",i:"🍞",h:5,s:6,w:"Blé",s2:"La nourriture du débutant. Fermes automatiques de blé faciles."},
 {n:"Pomme de terre au four",i:"🥔",h:5,s:6,w:"Four + pomme de terre",s2:"Facile à mass-produire. Ferme à pommes de terre = survival food."},
 {n:"Soupe de champignons",i:"🍲",h:6,s:7.2,w:"Champignons + bol",s2:"Avec une Champimeuh : soupe infinie !"},
 {n:"Ragoût suspect",i:"🍄",h:6,s:7.2,w:"Champignons + fleur",s2:"Effet bonus selon la fleur : vision, saut, régénération…"},
 {n:"Gâteau",i:"🍰",h:14,s:2.8,w:"Craft : lait, sucre, œuf, blé",s2:"7 parts, mangé sur place. Parfait pour une base."},
 {n:"Tarte à la citrouille",i:"🥧",h:8,s:4.8,w:"Citrouille + sucre + œuf",s2:"Excellente nourriture de milieu de jeu, sans viande."},
 {n:"Saumon cuit",i:"🐟",h:6,s:9.6,w:"Saumon au four",s2:"Bon plan en bord de rivière."},
 {n:"Morue cuite",i:"🐠",h:5,s:6,w:"Morue au four",s2:"Correct et abondant."},
 {n:"Baies lumineuses",i:"🫐",h:2,s:1.2,w:"Taïga (buissons)",s2:"Récolte infinie, nourriture d'appoint."},
 {n:"Fruit de chorus",i:"🟪",h:4,s:2.4,w:"L'End",s2:"Téléporte aléatoirement. Sympa et pratique pour descendre les tours."},
 {n:"Miel",i:"🍯",h:6,s:2.4,w:"Ruches",s2:"Soigne le poison instantanément !"},
 {n:"Biscuit",i:"🍪",h:2,s:0.4,w:"Blé + cacao",s2:"Mignon mais faible. Ne le donne PAS aux perroquets !"},
 {n:"Citrouille",i:"🎃",h:4,s:2.4,w:"Culture",s2:"Mangeable crue, mieux en tarte."},
 {n:"Melon",i:"🍉",h:2,s:1.2,w:"Culture",s2:"Fermes à melons rapides, nourriture de masse."},
 {n:"Kelp séché",i:"🌿",h:1,s:0.6,w:"Ferme à kelp + fumoir",s2:"Nourriture infinie automatisable à 100%."},
 {n:"Chair putréfiée",i:"🥩",h:4,s:0.8,w:"Zombies",s2:"80% de risque de Faim. Mangeable en secours seulement."},
 {n:"Œil d'araignée",i:"👁️",h:2,s:3.2,w:"Araignées",s2:"Empoisonne. À éviter, sauf craft de potions."},
 {n:"Fugu",i:"🐡",h:1,s:0.2,w:"Océans chauds",s2:"Poison + nausée + poison II. Ingrediant de potion seulement."},
 {n:"Porc cru",i:"🥓",h:3,s:1.8,w:"Cochons",s2:"Cuis-le, c'est 3× mieux."}
];

const VILLAGERS = [
 {n:"Fermier",i:"🌾",bloc:"Composteur",trades:"Blé → émeraude · Émeraude → pain, tarte, pomme dorée (maître)",s:"Le plus rentable en début de partie : vend ton blé automatisé."},
 {n:"Bibliothécaire",i:"📚",bloc:"Lutrin",trades:"Papier → émeraude · Émeraude → livres enchantés",s:"LE métier roi : choisis l'enchantement en cassant/reposant le lutrin. Réparation, Fortune, Mending !"},
 {n:"Armurier",i:"🛡️",bloc:"Haut fourneau",trades:"Charbon, fer, diamant → émeraude · Émeraude → armures enchantées",s:"Peut vendre un plastron en diamant enchanté Fléau IV."},
 {n:"Forgeron d'armes",i:"⚔️",bloc:"Meule",trades:"Charbon, fer, silex → émeraude · Émeraude → épées, haches enchantées",s:"Épée en diamant Tranchant en apprentice !"},
 {n:"Outilleur",i:"⛏️",bloc:"Table de forge",trades:"Charbon, fer, silex → émeraude · Émeraude → outils enchantés",s:"Pioche Efficacité III en apprenti."},
 {n:"Clerc",i:"⚗️",bloc:"Table d'alchimie",trades:"Rot, or → émeraude · Émeraude → fioles, ender perles, bouteilles XP",s:"Perles de l'End sans danger de type Endermen !"},
 {n:"Cartographe",i:"🗺️",bloc:"Table de cartographie",trades:"Papier → émeraude · Émeraude → cartes d'exploration",s:"Vend les cartes vers les monuments océans et les manoirs."},
 {n:"Maçon",i:"🧱",bloc:"Tailleur de pierre",trades:"Argile, pierre → émeraude · Émeraude → briques, poterie",s:"Briques de pierre lisses et terracotta colorées."},
 {n:"Berger",i:"🐑",bloc:"Métier à tisser",trades:"Laine → émeraude · Émeraude → laines, ciseaux, lits colorés",s:"Toutes les couleurs de laine, pratique pour les builds."},
 {n:"Boucher",i:"🍖",bloc:"Fumoir",trades:"VIANDE crue → émeraude · Émeraude → viandes cuites, lapin stew",s:"Convertit ton bétail en émeraudes."},
 {n:"Fléchier",i:"🏹",bloc:"Table de fléchage",trades:"Bâtons, silex, plumes → émeraude · Émeraude → flèches, arcs, arcs à effet",s:"Flèches à effet (lenteur, poison) en expert."},
 {n:"Pêcheur",i:"🎣",bloc:"Tonneau",trades:"Ficelle, charbon, poissons → émeraude · Émeraude → cannes enchantées, chaudières",s:"Canne appât III + infinie chance dans la pêche."},
 {n:"Tanneur",i:"🧤",bloc:"Chaudron",trades:"Peaux → émeraude · Émeraude → armures en cuir, selle",s:"Vend la selle (sinon que les pêcheurs/donjons) et les armures en cuir teintées."}
];

const SUCCES = [
 {n:"Inventaire en main",i:"📦",d:"Ouvre ton inventaire",how:"Appuie sur E. Le tout premier succès."},
 {n:"Du bois en veux-tu",i:"🌳",d:"Récupère un bloc de bois",how:"Frappe un arbre à poings. Classique."},
 {n:"Banc de travail",i:"🛠️",d:"Fabrique une table de craft",how:"4 planches en grille."},
 {n:"Âge de pierre",i:"⛏️",d:"Extrais une nouvelle pierre",how:"Fabrique une pioche en bois et mine."},
 {n:"On va avoir besoin de plus de minerais",i:"⚙️",d:"Fonds 3 fer en lingots",how:"Four + minerai de fer."},
 {n:"Équipement complet",i:"🛡️",d:"Chaque type d'outil une fois",how:"Épée, pioche, hache, pelle, houe en même matière."},
 {n:"Les poissons",i:"🎣",d:"Attrape et mange un poisson",how:"Canne à pêche + patience."},
 {n:"Ça roule",i:"🚂",d:"Voyage en minecart",how:"Rails + minecart + poussée."},
 {n:"Quand les cochons voleront",i:"🐷",d:"Tombe sur un cochon avec un minecart propulsé",how:"Chute + rail propulse = cochon volant."},
 {n:"Chasseur de monstres",i:"⚔️",d:"Tue un monstre hostile",how:"N'importe quel zombie, squelette ou creeper."},
 {n:"Vache folle",i:"🐄",d:"Récupère du cuir",how:"Tue une vache (ou un hoglin)."},
 {n:"Mensonge",i:"🍰",d:"Mange un gâteau entier",how:"Fabrique-le : lait ×3, sucre, œuf, blé ×3."},
 {n:"DIAMANTS !",i:"💎",d:"Récupère un diamant",how:"Pioche en fer, y -59, grottes. Le moment culte."},
 {n:"On doit aller plus profond",i:"🟪",d:"Construis un portail du Nether",how:"Obsidienne + allume-feu. 10 blocs minimum."},
 {n:"Retour à l'envoyeur",i:"👻",d:"Tue un ghast avec sa boule de feu",how:"Frappe ou tire sur la boule pour la renvoyer."},
 {n:"Dans le feu de l'action",i:"🔥",d:"Brise un casque de blaze",how:"Tire sur un blaze pour lui prendre son bâton."},
 {n:"Brasserie locale",i:"⚗️",d:"Fabrique une potion",how:"Table d'alchimie + nether wart + ingrédient."},
 {n:"La fin ?",i:"🐲",d:"Entres dans le portail de l'End",how:"Œils de l'End + forteresse."},
 {n:"LA fin.",i:"🏆",d:"Tue l'Ender Dragon",how:"Détruis les cristaux, tape la tête, lits si tu oses."},
 {n:"Enchanté !",i:"📖",d:"Enchante un objet",how:"Table d'enchantement + lapis-lazuli."},
 {n:"Surpuissant",i:"🍎",d:"Fabrique une pomme enchantée",how:"8 blocs d'or + pomme. Coûteux mais légendaire."},
 {n:"Bibliothécaire",i:"📚",d:"Fabrique un livre",how:"Papier ×3 + cuir."},
 {n:"Corsaire",i:"🏴‍☠️",d:"Vide un bateau d'épave",how:"Trouve un trésor enfoui avec la carte."},
 {n:"Belle aventure",i:"🗺️",d:"Échange avec un marchand ambulant",how:"Repère le marchand avec ses lamas."},
 {n:"Sniffarsene et le baton",i:"🐘",d:"Fais éclore un sniffer",how:"Œuf ancient trouvé dans les épaves, sur la mousse."},
 {n:"La tournée du patron",i:"🥤",d:"Récolte du sculk avec un Warden en vue",how:"Sneak, laine au sol, et prie."}
];

const REDSTONE_GUIDE = [
 {t:"⚡ Les bases",d:"La poudre de redstone = fil électrique (15 blocs max). Torche de redstone = source inverse. Répéteur : prolonge + délai réglable. Comparateur : mesure/multiplie le signal. Levier, bouton, plaque de pression = interrupteurs."},
 {t:"🚪 Porte 3×3 en piston",d:"2 pistons collants par côté + 2 pour le haut + observateur ou câblage caché. Le classique de la base blindée. Astuce : recouvre de blocs pour tout cacher."},
 {t:"🏭 Ferme à fer automatique",d:"3 villageois + 20 lits + zombifié piglin dans un brouette sous la cage de panique. Le golem apparaît, tombe dans l'eau, meurt sur les laves ? Non : buisson de lumière ou chute. Rendement : ~400 fer/heure."},
 {t:"🗡️ Ferme à XP (spawner)",d:"Trouve un spawner (zombie, squelette, araignée). Creuse autour, l'eau les pousse vers un trou, tombe à 1 coup de finir. Torche sur le spawner pour pauser. Mending + épée = XP infini."},
 {t:"🫧 Ascenseur à bulles",d:"Colonne de blocs d'âme (soul sand) au fond = monte. Colonne de magma au fond = descend. 2 colonnes côte à côte = ascenseur parfait du Nether."},
 {t:"📦 Machine à trier",d:"Entonnoirs + comparateurs + coffres : chaque item remplit son coffre dédié. Filtre : un coffre tampon rempli de l'item à trier (41 items de blocs, 18 d'items stackés par 16…)."},
 {t:"🚀 Canon TNT",d:"TNT flottantes sur eau + dispensers à TNT + redstone délais. Range : 100+ blocs. Attention aux accidents… et aux serveurs."},
 {t:"✈️ Machines volantes",d:"Observateur + piston collant + bloc de slime = moteur volant. Limite Bedrock : machines volantes limitées (et interdites sur certains serveurs). Le rêve : la ferme volante à brouettes."},
 {t:"🔴 Porte logique",d:"NON (torche sous le bloc), ET (2 redstone fusionnées), OU (2 fils), XOR (comparateurs). Avec ça, tu peux construire des calculatrices, des horloges, et même des ordinateurs complets !"}
];

const SEEDS = [
 {n:"2151901553968352745",i:"🖼️",d:"La seed du logo historique de Minecraft (pack.png). Mythique.",v:"Java"},
 {n:"478868574082066804",i:"🏝️",d:"Île de survie hardcore : spawn sur île, océan à perte de vue.",v:"Java"},
 {n:"-4172144997902289642",i:"🌸",d:"Spawn à côté d'une Cherry Grove géante et d'un village.",v:"Java 1.20+"},
 {n:"3257840388504953787",i:"👻",d:"La fameuse seed « Herobrine » chassée par la communauté.",v:"Java"},
 {n:"666",i:"💀",d:"Spawn des cavernes profondes et d'un avant-poste de pillards proche. Ambiance dark.",v:"Bedrock"},
 {n:"1848963743",i:"🍄",d:"Champs de champignons à distance de nage : base sans monstres garantie.",v:"Java"},
 {n:"1234567890",i:"🗺️",d:"Tout près : village, temple du désert et pyramide. Speedrun friendly.",v:"Bedrock"},
 {n:"-77107740",i:"🏔️",d:"Montagnes surréalistes culminant à y 250+ avec un village accroché.",v:"Java 1.18+"}
];
