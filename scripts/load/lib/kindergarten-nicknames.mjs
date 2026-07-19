/** Erste 40 Einträge aus `nickname-themes.ts` (KINDERGARTEN) – wie im Join-UI. */
export const KINDERGARTEN_NICKNAMES_DE = [
  'Roter Drache',
  'Grüner Frosch',
  'Gelber Löwe',
  'Lila Delfin',
  'Oranger Fuchs',
  'Rosa Schmetterling',
  'Türkiser Wal',
  'Brauner Bär',
  'Schwarzer Panther',
  'Weißer Hase',
  'Grauer Wolf',
  'Goldene Auster',
  'Silberner Dodo',
  'Bunter Papagei',
  'Hellblauer Schwan',
  'Dunkelgrüne Schlange',
  'Zitronengelbe Biene',
  'Pfirsichfarbenes Pferd',
  'Mintgrüne Eidechse',
  'Korallenroter Krebs',
  'Himmelblauer Marienkäfer',
  'Olivgrüne Maus',
  'Beiger Igel',
  'Lachsfarbener Flamingo',
  'Lavendelblaue Eule',
  'Senfgelber Hahn',
  'Tannengrüner Biber',
  'Apfelgrüne Raupe',
  'Maulwurfsgrauer Hamster',
  'Kastanienbrauner Pavian',
  'Salbeigrünes Krokodil',
  'Terrakottafarbener Dachs',
  'Smaragdgrüne Libelle',
  'Safrangelber Vogel',
  'Indigoblauer Wal',
  'Magenta Schildkröte',
  'Petrolfarbener Fisch',
  'Vanillefarbenes Lamm',
  'Türkisfarbener Hund',
  'Korallenfarbene Katze',
];

/** Englische Demo-Nicknames (gleiche Reihenfolge wie DE). */
export const KINDERGARTEN_NICKNAMES_EN = [
  'Red Dragon',
  'Green Frog',
  'Yellow Lion',
  'Purple Dolphin',
  'Orange Fox',
  'Pink Butterfly',
  'Turquoise Whale',
  'Brown Bear',
  'Black Panther',
  'White Rabbit',
  'Gray Wolf',
  'Golden Oyster',
  'Silver Dodo',
  'Colorful Parrot',
  'Light Blue Swan',
  'Dark Green Snake',
  'Lemon Yellow Bee',
  'Peach Horse',
  'Mint Green Lizard',
  'Coral Crab',
  'Sky Blue Ladybug',
  'Olive Green Mouse',
  'Beige Hedgehog',
  'Salmon Flamingo',
  'Lavender Owl',
  'Mustard Yellow Rooster',
  'Pine Green Beaver',
  'Apple Green Caterpillar',
  'Mole Gray Hamster',
  'Chestnut Baboon',
  'Sage Green Crocodile',
  'Terracotta Badger',
  'Emerald Dragonfly',
  'Saffron Bird',
  'Indigo Whale',
  'Magenta Turtle',
  'Petrol Fish',
  'Vanilla Lamb',
  'Turquoise Dog',
  'Coral Cat',
];

/** Französische Demo-Nicknames (gleiche Reihenfolge wie DE). */
export const KINDERGARTEN_NICKNAMES_FR = [
  'Dragon rouge',
  'Grenouille verte',
  'Lion jaune',
  'Dauphin violet',
  'Renard orange',
  'Papillon rose',
  'Baleine turquoise',
  'Ours brun',
  'Panthère noire',
  'Lapin blanc',
  'Loup gris',
  'Huître dorée',
  'Dodo argenté',
  'Perroquet coloré',
  'Cygne bleu clair',
  'Serpent vert foncé',
  'Abeille jaune citron',
  'Cheval pêche',
  'Lézard vert menthe',
  'Crabe corail',
  'Coccinelle bleu ciel',
  'Souris vert olive',
  'Hérisson beige',
  'Flamant saumon',
  'Chouette lavande',
  'Coq jaune moutarde',
  'Castor vert sapin',
  'Chenille vert pomme',
  'Hamster gris taupe',
  'Babouin châtain',
  'Crocodile vert sauge',
  'Blaireau terracotta',
  'Libellule émeraude',
  'Oiseau safran',
  'Baleine indigo',
  'Tortue magenta',
  'Poisson pétrole',
  'Agneau vanille',
  'Chien turquoise',
  'Chat corail',
];

/** @deprecated Use KINDERGARTEN_NICKNAMES_DE */
export const KINDERGARTEN_NICKNAMES = KINDERGARTEN_NICKNAMES_DE;

/**
 * @param {number} index
 * @param {string} [locale='de']
 */
export function kindergartenNickname(index, locale = 'de') {
  const lang = String(locale || 'de')
    .trim()
    .slice(0, 2)
    .toLowerCase();
  const list =
    lang === 'en'
      ? KINDERGARTEN_NICKNAMES_EN
      : lang === 'fr'
        ? KINDERGARTEN_NICKNAMES_FR
        : KINDERGARTEN_NICKNAMES_DE;
  const base = list[index % list.length];
  const cycle = Math.floor(index / list.length);
  return cycle === 0 ? base : `${base} ${cycle + 1}`;
}
