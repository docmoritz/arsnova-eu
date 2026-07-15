/** Erste 40 Einträge aus `nickname-themes.ts` (de, KINDERGARTEN) – wie im Join-UI. */
export const KINDERGARTEN_NICKNAMES = [
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

export function kindergartenNickname(index) {
  const base = KINDERGARTEN_NICKNAMES[index % KINDERGARTEN_NICKNAMES.length];
  const cycle = Math.floor(index / KINDERGARTEN_NICKNAMES.length);
  return cycle === 0 ? base : `${base} ${cycle + 1}`;
}
