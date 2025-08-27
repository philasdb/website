export interface Announcement {
  startDate: string;
  endDate?: string;
  time?: string;
  description: string;
  additionalInfo?: string;
  location?: string;
  link?: { href: string; name: string };
}

export interface SabbathSchoolLesson {
  topic: string;
  study: string;
  background: string;
  devotional: string;
}

export interface Song {
  title: string;
  hymnal?: string;
  hymnNumber?: string;
  artist?: string;
  additionalInfo?: string;
  url?: string;
}

export interface Message {
  title: string;
  speaker: string;
}

export interface Communion {
  name: string;
  description: string;
  songs: number[];
}

export interface Bulletin {
  date: string;
  sabbathSchool: SabbathSchoolLesson;
  announcements: Announcement[];
  notes: string[];
  thoughtOfTheDay: string;
  openingSong: number | Song;
  responsiveReading: string;
  tithesAndOfferingSong: number | Song;
  scriptureReading?: string;
  specialMusic?: number | Song;
  message?: Message;
  communion?: Communion;
  closingSong?: number | Song;
  youth?: boolean;
}
