// Idées de livres par thème, pour les 4-10 ans. Ce sont des suggestions de
// collections connues en librairie : vérifier la disponibilité sur place.
// ageMin/ageMax servent à mettre en avant les livres adaptés à l'âge de l'enfant.
window.BOOKS = {
  "commencement": [
    { t: "Les dinosaures — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "Un documentaire tout doux et illustré pour découvrir les dinosaures." },
    { t: "Le Kididoc des dinosaures", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Un livre animé avec des volets à soulever et des surprises à chaque page." },
    { t: "L'histoire de la vie — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "Du Big Bang aux premiers hommes, avec de grandes images réalistes." },
    { t: "La naissance du monde en cent épisodes", ed: "Bayard Jeunesse", ageMin: 7, ageMax: 10, d: "La grande histoire de l'Univers racontée comme un feuilleton." },
    { t: "Pop mange de toutes les couleurs", ed: "L'École des loisirs", ageMin: 3, ageMax: 5, d: "Pour les plus petits : Pop, le petit dinosaure multicolore." },
  ],
  "prehistoire": [
    { t: "La préhistoire — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "Le feu, les grottes, les mammouths : la préhistoire expliquée simplement." },
    { t: "Cromignon", ed: "L'École des loisirs", ageMin: 4, ageMax: 7, d: "Un petit héros de la préhistoire part à la chasse au mammouth. Malin et drôle !" },
    { t: "Le Kididoc de la préhistoire", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Un livre à volets pour explorer la vie des premiers hommes." },
    { t: "Préhistoire — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Un petit livre coloré avec frises, cartes et jeux." },
    { t: "Rahan (une aventure au choix)", ed: "Lécureux", ageMin: 8, ageMax: 10, d: "Pour les grands lecteurs : les aventures du célèbre fils des âges farouches." },
  ],
  "egypte": [
    { t: "L'Égypte — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "Pharaons, pyramides et momies racontés aux plus jeunes." },
    { t: "Le Kididoc — L'Égypte", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Soulève les volets pour percer les secrets des pyramides !" },
    { t: "Toutânkhamon — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "La vie du plus célèbre des pharaons, avec des illustrations rigolotes." },
    { t: "L'Égypte ancienne — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "De grandes images pour tout comprendre des temples et des dieux." },
    { t: "Les Petits Mythos et le Sphinx (BD)", ed: "Bamboo", ageMin: 7, ageMax: 10, d: "Une BD pleine d'humour autour des mythes de l'Antiquité." },
  ],
  "grece": [
    { t: "La mythologie grecque — Mes p'tits docs", ed: "Milan", ageMin: 4, ageMax: 7, d: "Zeus, Athéna et les héros grecs pour les petits curieux." },
    { t: "Le feuilleton d'Hermès", ed: "Bayard Jeunesse", ageMin: 7, ageMax: 10, d: "La mythologie en 100 épisodes, à lire un soir après l'autre. Un classique !" },
    { t: "Ulysse — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Le grand voyage d'Ulysse raconté avec des dessins colorés." },
    { t: "Les Petits Mythos (BD, tome 1)", ed: "Bamboo", ageMin: 7, ageMax: 10, d: "Les dieux de l'Olympe comme tu ne les as jamais vus : en BD rigolote." },
    { t: "La Grèce ancienne — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "Temples, Jeux olympiques et cités grecques en grandes images." },
  ],
  "rome": [
    { t: "Les Romains — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "Légionnaires, arènes et vie quotidienne des Romains, tout simplement." },
    { t: "Jules César — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "La vie du plus célèbre des Romains, frises et jeux inclus." },
    { t: "Le Kididoc — Les Romains", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Un livre animé pour explorer Rome, ses arènes et ses thermes." },
    { t: "Alix Origines (BD)", ed: "Casterman", ageMin: 9, ageMax: 12, d: "Pour les grands : les aventures d'un jeune Gaulois dans le monde romain." },
    { t: "La Rome antique — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "Le Colisée, les aqueducs et les légions en grandes images réalistes." },
  ],
  "gaulois": [
    { t: "Les Gaulois — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "La vraie vie des Gaulois : villages, artisans et druides." },
    { t: "Vercingétorix — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Le chef gaulois qui a tenu tête à Jules César !" },
    { t: "Astérix le Gaulois (BD)", ed: "Hachette", ageMin: 7, ageMax: 10, d: "L'incontournable ! Et ensuite, amuse-toi à trouver ce qui est vrai ou inventé." },
    { t: "Les Gaulois — Questions/Réponses", ed: "Nathan", ageMin: 7, ageMax: 10, d: "Toutes les questions que tu te poses sur nos ancêtres les Gaulois." },
    { t: "Le Kididoc — Les Gaulois", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Volets à soulever et roues à tourner pour visiter un village gaulois." },
  ],
  "vikings": [
    { t: "Les Vikings — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "Drakkars, maisons longues et grandes traversées pour les petits." },
    { t: "Les Vikings — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Les grands explorateurs du Nord, avec cartes et frises." },
    { t: "Le Kididoc — Les Vikings", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Un livre animé pour embarquer à bord d'un drakkar." },
    { t: "Vikings — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "Navires, dieux nordiques et vie quotidienne en grandes images." },
    { t: "Yasuke & petites histoires du soir : mythologie nordique", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Thor, Odin et les légendes du Nord à lire le soir." },
  ],
  "moyen-age": [
    { t: "Les châteaux forts — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "Pont-levis, donjons et chevaliers expliqués aux plus jeunes." },
    { t: "Le Kididoc des chevaliers", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Un livre animé pour devenir un vrai petit chevalier." },
    { t: "Jeanne d'Arc — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Le courage incroyable d'une jeune fille devenue héroïne." },
    { t: "Les châteaux forts — Questions/Réponses", ed: "Nathan", ageMin: 7, ageMax: 10, d: "Comment on construit un château ? Que mange un chevalier ? Réponses ici !" },
    { t: "Le Moyen Âge — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "Tournois, cathédrales et vie de château en grandes images." },
  ],
  "renaissance": [
    { t: "Léonard de Vinci — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Peintre, inventeur, savant : la vie du génie de la Renaissance." },
    { t: "La Renaissance — Mes p'tits docs", ed: "Milan", ageMin: 4, ageMax: 7, d: "Châteaux de la Loire, artistes et grandes découvertes pour les petits." },
    { t: "Christophe Colomb — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "La grande traversée de l'océan vers un nouveau monde." },
    { t: "Le Kididoc — Léonard de Vinci", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Machines volantes et inventions à découvrir en soulevant les volets." },
    { t: "Les châteaux de la Loire — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "Chambord, Chenonceau… les plus beaux châteaux en grandes images." },
  ],
  "temps-modernes": [
    { t: "Louis XIV — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "La vie du Roi Soleil et de son château de Versailles." },
    { t: "Le château de Versailles — Mes p'tits docs", ed: "Milan", ageMin: 4, ageMax: 7, d: "Visite le plus célèbre château du monde, côté coulisses !" },
    { t: "Les pirates — Kididoc", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Abordages, trésors et vie à bord : hisse et ho !" },
    { t: "D'Artagnan et les mousquetaires — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Un pour tous, tous pour un !" },
    { t: "Versailles — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "La galerie des Glaces, les jardins et les fêtes du Roi Soleil." },
  ],
  "revolution": [
    { t: "La Révolution française — Mes p'tits docs", ed: "Milan", ageMin: 4, ageMax: 7, d: "1789 raconté simplement : la Bastille, le drapeau, la devise." },
    { t: "La Révolution française — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Les grandes journées de la Révolution avec cartes et frises." },
    { t: "Napoléon — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "L'incroyable destin d'un petit Corse devenu empereur." },
    { t: "La Révolution française — Questions/Réponses", ed: "Nathan", ageMin: 7, ageMax: 10, d: "Pourquoi le peuple s'est fâché ? D'où vient la Marseillaise ?" },
    { t: "L'histoire de France — Le Kididoc", ed: "Nathan", ageMin: 5, ageMax: 9, d: "Toute l'histoire de France animée, de Vercingétorix à nos jours." },
  ],
  "notre-epoque": [
    { t: "La Tour Eiffel — Mes p'tits docs", ed: "Milan", ageMin: 3, ageMax: 7, d: "La grande dame de fer racontée aux petits." },
    { t: "Les frères Lumière — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "Comment deux frères lyonnais ont inventé le cinéma !" },
    { t: "L'espace — Kididoc", ed: "Nathan", ageMin: 4, ageMax: 8, d: "Fusées, astronautes et premiers pas sur la Lune." },
    { t: "Thomas Pesquet — Quelle Histoire", ed: "Quelle Histoire", ageMin: 6, ageMax: 10, d: "La vie d'un astronaute français dans la station spatiale." },
    { t: "Les inventions — La grande imagerie", ed: "Fleurus", ageMin: 6, ageMax: 10, d: "Du train à vapeur à internet : les inventions qui ont changé le monde." },
  ],
};
