// Bible book structure
export interface BibleBook {
  id: string;
  name: string;
  shortName: string;
  testament: 'old' | 'new';
  chapters: number;
}

export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  book: string;
  chapter: number;
  verses: Verse[];
}

// Bible books metadata
export const bibleBooks: BibleBook[] = [
  // Old Testament
  { id: 'gen', name: 'Genesis', shortName: 'Gen', testament: 'old', chapters: 50 },
  { id: 'exo', name: 'Exodus', shortName: 'Exo', testament: 'old', chapters: 40 },
  { id: 'lev', name: 'Leviticus', shortName: 'Lev', testament: 'old', chapters: 27 },
  { id: 'num', name: 'Numbers', shortName: 'Num', testament: 'old', chapters: 36 },
  { id: 'deu', name: 'Deuteronomy', shortName: 'Deu', testament: 'old', chapters: 34 },
  { id: 'jos', name: 'Joshua', shortName: 'Jos', testament: 'old', chapters: 24 },
  { id: 'jdg', name: 'Judges', shortName: 'Jdg', testament: 'old', chapters: 21 },
  { id: 'rut', name: 'Ruth', shortName: 'Rut', testament: 'old', chapters: 4 },
  { id: '1sa', name: '1 Samuel', shortName: '1Sa', testament: 'old', chapters: 31 },
  { id: '2sa', name: '2 Samuel', shortName: '2Sa', testament: 'old', chapters: 24 },
  { id: '1ki', name: '1 Kings', shortName: '1Ki', testament: 'old', chapters: 22 },
  { id: '2ki', name: '2 Kings', shortName: '2Ki', testament: 'old', chapters: 25 },
  { id: '1ch', name: '1 Chronicles', shortName: '1Ch', testament: 'old', chapters: 29 },
  { id: '2ch', name: '2 Chronicles', shortName: '2Ch', testament: 'old', chapters: 36 },
  { id: 'ezr', name: 'Ezra', shortName: 'Ezr', testament: 'old', chapters: 10 },
  { id: 'neh', name: 'Nehemiah', shortName: 'Neh', testament: 'old', chapters: 13 },
  { id: 'est', name: 'Esther', shortName: 'Est', testament: 'old', chapters: 10 },
  { id: 'job', name: 'Job', shortName: 'Job', testament: 'old', chapters: 42 },
  { id: 'psa', name: 'Psalms', shortName: 'Psa', testament: 'old', chapters: 150 },
  { id: 'pro', name: 'Proverbs', shortName: 'Pro', testament: 'old', chapters: 31 },
  { id: 'ecc', name: 'Ecclesiastes', shortName: 'Ecc', testament: 'old', chapters: 12 },
  { id: 'sng', name: 'Song of Solomon', shortName: 'Sng', testament: 'old', chapters: 8 },
  { id: 'isa', name: 'Isaiah', shortName: 'Isa', testament: 'old', chapters: 66 },
  { id: 'jer', name: 'Jeremiah', shortName: 'Jer', testament: 'old', chapters: 52 },
  { id: 'lam', name: 'Lamentations', shortName: 'Lam', testament: 'old', chapters: 5 },
  { id: 'ezk', name: 'Ezekiel', shortName: 'Ezk', testament: 'old', chapters: 48 },
  { id: 'dan', name: 'Daniel', shortName: 'Dan', testament: 'old', chapters: 12 },
  { id: 'hos', name: 'Hosea', shortName: 'Hos', testament: 'old', chapters: 14 },
  { id: 'jol', name: 'Joel', shortName: 'Jol', testament: 'old', chapters: 3 },
  { id: 'amo', name: 'Amos', shortName: 'Amo', testament: 'old', chapters: 9 },
  { id: 'oba', name: 'Obadiah', shortName: 'Oba', testament: 'old', chapters: 1 },
  { id: 'jon', name: 'Jonah', shortName: 'Jon', testament: 'old', chapters: 4 },
  { id: 'mic', name: 'Micah', shortName: 'Mic', testament: 'old', chapters: 7 },
  { id: 'nam', name: 'Nahum', shortName: 'Nam', testament: 'old', chapters: 3 },
  { id: 'hab', name: 'Habakkuk', shortName: 'Hab', testament: 'old', chapters: 3 },
  { id: 'zep', name: 'Zephaniah', shortName: 'Zep', testament: 'old', chapters: 3 },
  { id: 'hag', name: 'Haggai', shortName: 'Hag', testament: 'old', chapters: 2 },
  { id: 'zec', name: 'Zechariah', shortName: 'Zec', testament: 'old', chapters: 14 },
  { id: 'mal', name: 'Malachi', shortName: 'Mal', testament: 'old', chapters: 4 },
  // New Testament
  { id: 'mat', name: 'Matthew', shortName: 'Mat', testament: 'new', chapters: 28 },
  { id: 'mrk', name: 'Mark', shortName: 'Mrk', testament: 'new', chapters: 16 },
  { id: 'luk', name: 'Luke', shortName: 'Luk', testament: 'new', chapters: 24 },
  { id: 'jhn', name: 'John', shortName: 'Jhn', testament: 'new', chapters: 21 },
  { id: 'act', name: 'Acts', shortName: 'Act', testament: 'new', chapters: 28 },
  { id: 'rom', name: 'Romans', shortName: 'Rom', testament: 'new', chapters: 16 },
  { id: '1co', name: '1 Corinthians', shortName: '1Co', testament: 'new', chapters: 16 },
  { id: '2co', name: '2 Corinthians', shortName: '2Co', testament: 'new', chapters: 13 },
  { id: 'gal', name: 'Galatians', shortName: 'Gal', testament: 'new', chapters: 6 },
  { id: 'eph', name: 'Ephesians', shortName: 'Eph', testament: 'new', chapters: 6 },
  { id: 'php', name: 'Philippians', shortName: 'Php', testament: 'new', chapters: 4 },
  { id: 'col', name: 'Colossians', shortName: 'Col', testament: 'new', chapters: 4 },
  { id: '1th', name: '1 Thessalonians', shortName: '1Th', testament: 'new', chapters: 5 },
  { id: '2th', name: '2 Thessalonians', shortName: '2Th', testament: 'new', chapters: 3 },
  { id: '1ti', name: '1 Timothy', shortName: '1Ti', testament: 'new', chapters: 6 },
  { id: '2ti', name: '2 Timothy', shortName: '2Ti', testament: 'new', chapters: 4 },
  { id: 'tit', name: 'Titus', shortName: 'Tit', testament: 'new', chapters: 3 },
  { id: 'phm', name: 'Philemon', shortName: 'Phm', testament: 'new', chapters: 1 },
  { id: 'heb', name: 'Hebrews', shortName: 'Heb', testament: 'new', chapters: 13 },
  { id: 'jas', name: 'James', shortName: 'Jas', testament: 'new', chapters: 5 },
  { id: '1pe', name: '1 Peter', shortName: '1Pe', testament: 'new', chapters: 5 },
  { id: '2pe', name: '2 Peter', shortName: '2Pe', testament: 'new', chapters: 3 },
  { id: '1jn', name: '1 John', shortName: '1Jn', testament: 'new', chapters: 5 },
  { id: '2jn', name: '2 John', shortName: '2Jn', testament: 'new', chapters: 1 },
  { id: '3jn', name: '3 John', shortName: '3Jn', testament: 'new', chapters: 1 },
  { id: 'jud', name: 'Jude', shortName: 'Jud', testament: 'new', chapters: 1 },
  { id: 'rev', name: 'Revelation', shortName: 'Rev', testament: 'new', chapters: 22 },
];

// Sample verses for demonstration (in production, this would come from an API)
export const sampleVerses: Record<string, Chapter> = {
  'gen-1': {
    book: 'Genesis',
    chapter: 1,
    verses: [
      { number: 1, text: 'In the beginning God created the heaven and the earth.' },
      { number: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
      { number: 3, text: 'And God said, Let there be light: and there was light.' },
      { number: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
      { number: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
      { number: 6, text: 'And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.' },
      { number: 7, text: 'And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.' },
      { number: 8, text: 'And God called the firmament Heaven. And the evening and the morning were the second day.' },
      { number: 9, text: 'And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.' },
      { number: 10, text: 'And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.' },
      { number: 11, text: 'And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.' },
      { number: 12, text: 'And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.' },
      { number: 13, text: 'And the evening and the morning were the third day.' },
      { number: 14, text: 'And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years.' },
      { number: 15, text: 'And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.' },
      { number: 16, text: 'And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.' },
      { number: 17, text: 'And God set them in the firmament of the heaven to give light upon the earth.' },
      { number: 18, text: 'And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.' },
      { number: 19, text: 'And the evening and the morning were the fourth day.' },
      { number: 20, text: 'And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.' },
      { number: 21, text: 'And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.' },
      { number: 22, text: 'And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.' },
      { number: 23, text: 'And the evening and the morning were the fifth day.' },
      { number: 24, text: 'And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.' },
      { number: 25, text: 'And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.' },
      { number: 26, text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.' },
      { number: 27, text: 'So God created man in his own image, in the image of God created he him; male and female created he them.' },
      { number: 28, text: 'And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.' },
      { number: 29, text: 'And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.' },
      { number: 30, text: 'And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.' },
      { number: 31, text: 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.' },
    ],
  },
  'jhn-3': {
    book: 'John',
    chapter: 3,
    verses: [
      { number: 1, text: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:' },
      { number: 2, text: 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.' },
      { number: 3, text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.' },
      { number: 4, text: 'Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother\'s womb, and be born?' },
      { number: 5, text: 'Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.' },
      { number: 6, text: 'That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.' },
      { number: 7, text: 'Marvel not that I said unto thee, Ye must be born again.' },
      { number: 8, text: 'The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit.' },
      { number: 9, text: 'Nicodemus answered and said unto him, How can these things be?' },
      { number: 10, text: 'Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?' },
      { number: 11, text: 'Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.' },
      { number: 12, text: 'If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?' },
      { number: 13, text: 'And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.' },
      { number: 14, text: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:' },
      { number: 15, text: 'That whosoever believeth in him should not perish, but have eternal life.' },
      { number: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
      { number: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
      { number: 18, text: 'He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.' },
      { number: 19, text: 'And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.' },
      { number: 20, text: 'For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.' },
      { number: 21, text: 'But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.' },
    ],
  },
  'psa-23': {
    book: 'Psalms',
    chapter: 23,
    verses: [
      { number: 1, text: 'The LORD is my shepherd; I shall not want.' },
      { number: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
      { number: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
      { number: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
      { number: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
      { number: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' },
    ],
  },
};

// Get chapter data (in production, this would be an API call)
export const getChapter = (bookId: string, chapter: number): Chapter | null => {
  const key = `${bookId}-${chapter}`;
  if (sampleVerses[key]) {
    return sampleVerses[key];
  }
  
  // Generate placeholder verses for demo
  const book = bibleBooks.find(b => b.id === bookId);
  if (!book) return null;
  
  const verses: Verse[] = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    text: `This is verse ${i + 1} of ${book.name} chapter ${chapter}. In a production app, this would be the actual scripture text from a Bible API or database.`,
  }));
  
  return {
    book: book.name,
    chapter,
    verses,
  };
};

export const getBook = (bookId: string): BibleBook | undefined => {
  return bibleBooks.find(b => b.id === bookId);
};
