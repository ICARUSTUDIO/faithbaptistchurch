export interface Story {
  id: string;
  type: 'video' | 'quote' | 'verse' | 'image';
  title: string;
  content: string;
  author: string;
  authorRole: string;
  authorImage?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  verseReference?: string;
  createdAt: Date;
  likes: number;
}

export interface DailyManna {
  id: string;
  date: string;
  title: string;
  verse: string;
  verseReference: string;
  reflection: string;
  prayer: string;
  author: string;
}

// Sample stories data
export const sampleStories: Story[] = [
  {
    id: '1',
    type: 'verse',
    title: 'Verse of the Day',
    content: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    author: 'Pastor Johnson',
    authorRole: 'Senior Pastor',
    verseReference: 'John 3:16',
    createdAt: new Date(),
    likes: 234,
  },
  {
    id: '2',
    type: 'quote',
    title: 'Morning Inspiration',
    content: 'Faith is taking the first step even when you don\'t see the whole staircase.',
    author: 'Pastor Grace',
    authorRole: 'Youth Pastor',
    createdAt: new Date(Date.now() - 3600000),
    likes: 156,
  },
  {
    id: '3',
    type: 'video',
    title: 'Sunday Sermon Highlights',
    content: 'Watch the key moments from this week\'s powerful sermon on faith and perseverance.',
    author: 'Pastor Johnson',
    authorRole: 'Senior Pastor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 86400000),
    likes: 89,
  },
  {
    id: '4',
    type: 'image',
    title: 'Church Fellowship',
    content: 'Beautiful moments from our community gathering last weekend. We are truly blessed!',
    author: 'Media Team',
    authorRole: 'Church Media',
    mediaUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop',
    createdAt: new Date(Date.now() - 172800000),
    likes: 312,
  },
  {
    id: '5',
    type: 'verse',
    title: 'Evening Reflection',
    content: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
    author: 'Pastor Michael',
    authorRole: 'Associate Pastor',
    verseReference: 'Proverbs 3:5-6',
    createdAt: new Date(Date.now() - 259200000),
    likes: 198,
  },
];

// Sample daily manna data
export const sampleDailyManna: DailyManna[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    title: 'Walking in Faith',
    verse: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
    verseReference: 'Hebrews 11:1',
    reflection: 'Faith is not just believing in what we can see, but trusting in God\'s promises even when the path ahead is unclear. Today, let us remember that our faith is built on the solid foundation of God\'s word and His unwavering love for us. Every step we take in faith brings us closer to His perfect plan for our lives.',
    prayer: 'Heavenly Father, strengthen our faith today. Help us to trust in Your plans even when we cannot see the way forward. Guide our steps and fill our hearts with confidence in Your love. In Jesus\' name, Amen.',
    author: 'Pastor Johnson',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    title: 'The Power of Prayer',
    verse: 'The effectual fervent prayer of a righteous man availeth much.',
    verseReference: 'James 5:16',
    reflection: 'Prayer is our direct line of communication with our Creator. Through prayer, we express our gratitude, share our burdens, and seek His guidance. God hears every prayer, spoken or silent, and He responds according to His perfect will and timing.',
    prayer: 'Lord, teach us to pray with sincerity and faith. Open our hearts to Your voice and help us to be persistent in our communication with You. We thank You for the privilege of prayer. Amen.',
    author: 'Pastor Grace',
  },
];

export const getTodaysManna = (): DailyManna => {
  const today = new Date().toISOString().split('T')[0];
  return sampleDailyManna.find(m => m.date === today) || sampleDailyManna[0];
};
