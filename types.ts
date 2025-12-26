
export enum Language {
  EN = 'EN',
  ZH = 'ZH'
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  link?: string;
}

export interface Conference {
  id: string;
  title: string;
  event: string;
  date: string;
  location: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string; // Markdown-like text
  tags: string[];
  image?: string;
}

export interface MemePost {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
}

export type ThemeMode = 'light' | 'dark';

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  color: string;
}

export interface UserProfile {
  name: string;
  title: string;
  affiliation: string;
  avatarUrl: string;
  bio: string;
  cvPdfUrl?: string;
  motto?: string;
  coverTitle?: string;
  coverImage?: string;
  nameZh?: string;
  titleZh?: string;
  affiliationZh?: string;
  bioZh?: string;
  mottoZh?: string;
  coverTitleZh?: string;
}
