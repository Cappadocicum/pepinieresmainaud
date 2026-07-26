// Lieux à visiter en France, classés par thème : musées, sites, parcs.
// Coordonnées approximatives (précision « ville ») — l'itinéraire exact
// s'ouvre dans l'appli de cartes du téléphone.
// type: "musee" (bon Musée) | "site" ou "parc" (bon Sortie)
window.PLACES = [
  // ——— Le commencement (dinosaures, origines) ———
  { slug: "commencement", type: "musee", nom: "Muséum national d'Histoire naturelle", ville: "Paris (5e)", lat: 48.8430, lng: 2.3560, d: "La Grande Galerie de l'Évolution et la galerie des dinosaures : immanquable !" },
  { slug: "commencement", type: "musee", nom: "Musée des Confluences", ville: "Lyon", lat: 45.7327, lng: 4.8180, d: "Squelettes de dinosaures et origines du monde dans un bâtiment futuriste." },
  { slug: "commencement", type: "parc", nom: "Paléopolis, la colline aux dinosaures", ville: "Gannat (Allier)", lat: 46.0890, lng: 3.1920, d: "Parc dédié aux dinosaures et à la paléontologie, fouilles pour enfants." },
  { slug: "commencement", type: "musee", nom: "Paléospace l'Odyssée", ville: "Villers-sur-Mer (Calvados)", lat: 49.3210, lng: -0.0080, d: "Fossiles des falaises des Vaches Noires et animations pour enfants." },
  { slug: "commencement", type: "musee", nom: "Musée des Dinosaures Dinosauria", ville: "Espéraza (Aude)", lat: 42.9330, lng: 2.2210, d: "L'un des plus grands musées de dinosaures d'Europe, avec chantier de fouilles." },
  { slug: "commencement", type: "parc", nom: "Dino-Zoo", ville: "Charbonnières-les-Sapins (Doubs)", lat: 47.1830, lng: 6.2200, d: "Parcours en forêt parmi des dinosaures grandeur nature." },

  // ——— La Préhistoire ———
  { slug: "prehistoire", type: "site", nom: "Grottes du Cerdon", ville: "Cerdon (Ain)", lat: 46.0745, lng: 5.4664, d: "Parc de loisirs préhistoriques : visite de la grotte et ateliers (feu, chasse, poterie). À 30 min de Bourg-en-Bresse !" },
  { slug: "prehistoire", type: "site", nom: "Lascaux IV", ville: "Montignac (Dordogne)", lat: 45.0570, lng: 1.1700, d: "La réplique complète de la plus célèbre grotte ornée du monde." },
  { slug: "prehistoire", type: "site", nom: "Grotte Chauvet 2", ville: "Vallon-Pont-d'Arc (Ardèche)", lat: 44.4070, lng: 4.3930, d: "Les plus anciens dessins de l'humanité (36 000 ans !), reconstitués à l'identique." },
  { slug: "prehistoire", type: "musee", nom: "Musée national de Préhistoire", ville: "Les Eyzies (Dordogne)", lat: 44.9380, lng: 1.0120, d: "Au cœur de la vallée de l'Homme, la plus grande collection préhistorique de France." },
  { slug: "prehistoire", type: "musee", nom: "Musée de Solutré", ville: "Solutré-Pouilly (Saône-et-Loire)", lat: 46.2990, lng: 4.7180, d: "Au pied de la Roche de Solutré, célèbre site de chasse préhistorique. Tout près de Mâcon." },
  { slug: "prehistoire", type: "parc", nom: "Parc Samara", ville: "La Chaussée-Tirancourt (Somme)", lat: 49.9450, lng: 2.1600, d: "Démonstrations de taille de silex, feu et habitats reconstitués." },
  { slug: "prehistoire", type: "site", nom: "Alignements de Carnac", ville: "Carnac (Morbihan)", lat: 47.5920, lng: -3.0660, d: "Des milliers de menhirs alignés il y a 6 000 ans. Mystérieux !" },
  { slug: "prehistoire", type: "musee", nom: "Musée de l'Homme de Tautavel", ville: "Tautavel (Pyrénées-Orientales)", lat: 42.8150, lng: 2.7440, d: "À la rencontre de l'Homme de Tautavel, 450 000 ans !" },

  // ——— L'Égypte Antique ———
  { slug: "egypte", type: "musee", nom: "Musée du Louvre — département égyptien", ville: "Paris (1er)", lat: 48.8606, lng: 2.3376, d: "Momies, sarcophages, sphinx : l'une des plus belles collections égyptiennes du monde." },
  { slug: "egypte", type: "musee", nom: "Musée Champollion", ville: "Figeac (Lot)", lat: 44.6080, lng: 2.0320, d: "Dans la maison natale de celui qui a déchiffré les hiéroglyphes." },
  { slug: "egypte", type: "musee", nom: "Musée des Beaux-Arts — collection égyptienne", ville: "Lyon", lat: 45.7670, lng: 4.8340, d: "Sarcophages et objets des pharaons en plein centre de Lyon." },
  { slug: "egypte", type: "musee", nom: "Musée d'Archéologie méditerranéenne", ville: "Marseille", lat: 43.3000, lng: 5.3670, d: "Belle collection égyptienne à la Vieille Charité." },
  { slug: "egypte", type: "musee", nom: "Musée Georges-Labit", ville: "Toulouse", lat: 43.5930, lng: 1.4560, d: "Une momie et des antiquités égyptiennes dans une jolie villa mauresque." },

  // ——— La Grèce Antique ———
  { slug: "grece", type: "musee", nom: "Musée du Louvre — antiquités grecques", ville: "Paris (1er)", lat: 48.8606, lng: 2.3376, d: "La Vénus de Milo, la Victoire de Samothrace et les héros grecs." },
  { slug: "grece", type: "musee", nom: "Musée d'Histoire de Marseille", ville: "Marseille", lat: 43.2990, lng: 5.3750, d: "Marseille a été fondée par des Grecs il y a 2 600 ans : bateaux antiques et port ancien." },
  { slug: "grece", type: "musee", nom: "Musée d'Archéologie nationale", ville: "Saint-Germain-en-Laye (Yvelines)", lat: 48.8980, lng: 2.0930, d: "Un voyage de la préhistoire à l'Antiquité dans un château royal." },
  { slug: "grece", type: "musee", nom: "MuCEM et fort Saint-Jean", ville: "Marseille", lat: 43.2960, lng: 5.3610, d: "Les civilisations de la Méditerranée face à la mer." },

  // ——— La Rome Antique ———
  { slug: "rome", type: "site", nom: "Pont du Gard", ville: "Vers-Pont-du-Gard (Gard)", lat: 43.9470, lng: 4.5350, d: "L'aqueduc romain le plus spectaculaire du monde, avec espace enfants Ludo." },
  { slug: "rome", type: "site", nom: "Arènes de Nîmes", ville: "Nîmes (Gard)", lat: 43.8350, lng: 4.3590, d: "Un amphithéâtre romain superbement conservé, casque audio enfants disponible." },
  { slug: "rome", type: "musee", nom: "Lugdunum — musée et théâtres romains", ville: "Lyon (Fourvière)", lat: 45.7600, lng: 4.8200, d: "Lyon était la capitale des Gaules ! Musée et deux théâtres romains à explorer." },
  { slug: "rome", type: "site", nom: "Théâtre antique d'Orange", ville: "Orange (Vaucluse)", lat: 44.1360, lng: 4.8080, d: "Le théâtre romain le mieux conservé d'Europe, avec son mur géant." },
  { slug: "rome", type: "site", nom: "Amphithéâtre et musée d'Arles", ville: "Arles (Bouches-du-Rhône)", lat: 43.6780, lng: 4.6310, d: "Arènes, cirque romain et un incroyable bateau antique repêché dans le Rhône." },
  { slug: "rome", type: "musee", nom: "Musée gallo-romain de Saint-Romain-en-Gal", ville: "Vienne (Isère)", lat: 45.5250, lng: 4.8710, d: "Mosaïques géantes et vie quotidienne gallo-romaine, au sud de Lyon." },

  // ——— Les Gaulois ———
  { slug: "gaulois", type: "site", nom: "MuséoParc Alésia", ville: "Alise-Sainte-Reine (Côte-d'Or)", lat: 47.5370, lng: 4.5000, d: "Sur les lieux de la célèbre bataille entre Vercingétorix et César. Animations familles." },
  { slug: "gaulois", type: "site", nom: "Bibracte, ville gauloise", ville: "Mont Beuvray (Morvan)", lat: 46.9230, lng: 4.0370, d: "Une vraie capitale gauloise en pleine forêt, avec musée et chantiers de fouilles." },
  { slug: "gaulois", type: "musee", nom: "Musée de Gergovie", ville: "La Roche-Blanche (Puy-de-Dôme)", lat: 45.7190, lng: 3.1250, d: "Sur le plateau de la victoire de Vercingétorix, vue magnifique sur l'Auvergne." },
  { slug: "gaulois", type: "musee", nom: "Musée d'Archéologie nationale", ville: "Saint-Germain-en-Laye (Yvelines)", lat: 48.8980, lng: 2.0930, d: "La plus grande collection d'objets gaulois de France." },
  { slug: "gaulois", type: "parc", nom: "Parc Astérix", ville: "Plailly (Oise)", lat: 49.1360, lng: 2.5730, d: "Pour rire avec les Gaulois d'Astérix… et chercher ce qui est vrai ou inventé !" },

  // ——— Les Vikings ———
  { slug: "vikings", type: "musee", nom: "Musée de la Tapisserie de Bayeux", ville: "Bayeux (Calvados)", lat: 49.2740, lng: -0.7000, d: "Une « BD » brodée de 70 mètres racontant Guillaume le Conquérant, descendant de Vikings. (Fermé pour travaux jusqu'en 2027 — vérifier avant d'y aller.)" },
  { slug: "vikings", type: "parc", nom: "Ornavik, parc historique", ville: "Hérouville-Saint-Clair (Calvados)", lat: 49.2110, lng: -0.3210, d: "Un village viking et normand reconstitué grandeur nature, avec artisans en costume." },
  { slug: "vikings", type: "site", nom: "Château Guillaume-le-Conquérant", ville: "Falaise (Calvados)", lat: 48.8920, lng: -0.2010, d: "Le château natal de Guillaume, avec tablettes de visite en réalité augmentée." },
  { slug: "vikings", type: "musee", nom: "Musée de Normandie", ville: "Caen (Calvados)", lat: 49.1860, lng: -0.3630, d: "L'histoire de la Normandie, terre offerte aux Vikings en 911 !" },

  // ——— Le Moyen Âge ———
  { slug: "moyen-age", type: "site", nom: "Chantier médiéval de Guédelon", ville: "Treigny (Yonne)", lat: 47.5830, lng: 3.1550, d: "Ils construisent un vrai château fort avec les techniques du Moyen Âge ! Fascinant." },
  { slug: "moyen-age", type: "site", nom: "Cité de Carcassonne", ville: "Carcassonne (Aude)", lat: 43.2060, lng: 2.3650, d: "Une cité fortifiée complète avec 52 tours : on se croirait dans un conte." },
  { slug: "moyen-age", type: "site", nom: "Mont-Saint-Michel", ville: "Le Mont-Saint-Michel (Manche)", lat: 48.6360, lng: -1.5110, d: "L'abbaye-forteresse au milieu de la mer, la merveille du Moyen Âge." },
  { slug: "moyen-age", type: "site", nom: "Cité médiévale de Pérouges", ville: "Pérouges (Ain)", lat: 45.9040, lng: 5.1780, d: "Un village médiéval superbement conservé, à 40 min de Bourg-en-Bresse. Goûte la galette de Pérouges !" },
  { slug: "moyen-age", type: "site", nom: "Château de Castelnaud", ville: "Castelnaud-la-Chapelle (Dordogne)", lat: 44.8150, lng: 1.1460, d: "Le château des machines de guerre médiévales, avec démonstrations de trébuchet." },
  { slug: "moyen-age", type: "site", nom: "Cité médiévale de Provins", ville: "Provins (Seine-et-Marne)", lat: 48.5600, lng: 3.2870, d: "Remparts, souterrains et spectacles de chevalerie et d'aigles." },
  { slug: "moyen-age", type: "site", nom: "Château des Allymes", ville: "Ambérieu-en-Bugey (Ain)", lat: 45.9770, lng: 5.3830, d: "Un vrai château fort dans l'Ain, avec vue sur la plaine de la Bresse." },

  // ——— La Renaissance ———
  { slug: "renaissance", type: "site", nom: "Château de Chambord", ville: "Chambord (Loir-et-Cher)", lat: 47.6160, lng: 1.5170, d: "Le château géant de François Ier et son escalier à double révolution imaginé avec Léonard." },
  { slug: "renaissance", type: "site", nom: "Château du Clos Lucé", ville: "Amboise (Indre-et-Loire)", lat: 47.4100, lng: 0.9920, d: "La maison de Léonard de Vinci, avec ses machines grandeur nature dans le parc." },
  { slug: "renaissance", type: "site", nom: "Château de Chenonceau", ville: "Chenonceaux (Indre-et-Loire)", lat: 47.3250, lng: 1.0700, d: "Le château construit sur un pont, au-dessus de la rivière !" },
  { slug: "renaissance", type: "site", nom: "Monastère royal de Brou", ville: "Bourg-en-Bresse (Ain)", lat: 46.1980, lng: 5.2360, d: "Un chef-d'œuvre à Bourg-en-Bresse même : église flamboyante et jeux de piste pour enfants." },
  { slug: "renaissance", type: "site", nom: "Château royal de Blois", ville: "Blois (Loir-et-Cher)", lat: 47.5850, lng: 1.3310, d: "Quatre châteaux en un, et un spectacle son et lumière le soir." },

  // ——— Les Temps Modernes ———
  { slug: "temps-modernes", type: "site", nom: "Château de Versailles", ville: "Versailles (Yvelines)", lat: 48.8040, lng: 2.1200, d: "La galerie des Glaces, les jardins et les fontaines du Roi Soleil." },
  { slug: "temps-modernes", type: "site", nom: "Château de Vaux-le-Vicomte", ville: "Maincy (Seine-et-Marne)", lat: 48.5660, lng: 2.7140, d: "Le château qui a inspiré Versailles, avec visites aux chandelles." },
  { slug: "temps-modernes", type: "site", nom: "Corderie royale et l'Hermione", ville: "Rochefort (Charente-Maritime)", lat: 45.9400, lng: -0.9560, d: "Les grands navires du roi et la célèbre frégate de La Fayette." },
  { slug: "temps-modernes", type: "musee", nom: "Musée national de la Marine", ville: "Paris (16e)", lat: 48.8620, lng: 2.2880, d: "Maquettes géantes de vaisseaux royaux et histoires de marins." },

  // ——— La Révolution ———
  { slug: "revolution", type: "musee", nom: "Musée de la Révolution française", ville: "Vizille (Isère)", lat: 45.0780, lng: 5.7720, d: "Le seul musée au monde dédié à la Révolution, dans un château avec grand parc à roussettes… non, à cygnes !" },
  { slug: "revolution", type: "site", nom: "Conciergerie", ville: "Paris (1er)", lat: 48.8560, lng: 2.3450, d: "Le palais devenu prison de la Révolution, avec tablette « HistoPad » pour remonter le temps." },
  { slug: "revolution", type: "musee", nom: "Musée Carnavalet", ville: "Paris (3e)", lat: 48.8570, lng: 2.3630, d: "L'histoire de Paris, avec de fabuleuses salles sur la Révolution. Gratuit !" },
  { slug: "revolution", type: "site", nom: "Hôtel des Invalides — tombeau de Napoléon", ville: "Paris (7e)", lat: 48.8550, lng: 2.3130, d: "Le gigantesque tombeau de l'Empereur et le musée de l'Armée." },

  // ——— Notre époque ———
  { slug: "notre-epoque", type: "musee", nom: "Cité des Sciences et de l'Industrie", ville: "Paris (19e)", lat: 48.8950, lng: 2.3880, d: "La Cité des Enfants : sciences et inventions à toucher dès 2 ans." },
  { slug: "notre-epoque", type: "musee", nom: "Musée de l'Air et de l'Espace", ville: "Le Bourget (Seine-Saint-Denis)", lat: 48.9460, lng: 2.4360, d: "Monte dans un Concorde et approche de vraies fusées !" },
  { slug: "notre-epoque", type: "musee", nom: "Cité du Train", ville: "Mulhouse (Haut-Rhin)", lat: 47.7430, lng: 7.2970, d: "Le plus grand musée ferroviaire d'Europe, des locos à vapeur au TGV." },
  { slug: "notre-epoque", type: "musee", nom: "Institut Lumière", ville: "Lyon (8e)", lat: 45.7450, lng: 4.8710, d: "Là où le cinéma est né en 1895, dans la maison des frères Lumière." },
  { slug: "notre-epoque", type: "site", nom: "Tour Eiffel", ville: "Paris (7e)", lat: 48.8584, lng: 2.2945, d: "330 mètres de fer construits en 2 ans en 1889. Toujours magique." },
  { slug: "notre-epoque", type: "musee", nom: "Musée des Arts et Métiers", ville: "Paris (3e)", lat: 48.8660, lng: 2.3550, d: "Avions de Blériot, premières voitures et machines extraordinaires." },
];
