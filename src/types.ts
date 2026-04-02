export type ContentType = 'Post' | 'Reels' | 'Hikaye' | 'Kaydırmalı' | 'Video';

export type TaskStatus = 'Planlandı' | 'Tasarımda' | 'Müşteri Onayı Bekliyor' | 'Yayına Hazır' | 'Yayınlandı';

export interface Client {
  id: string;
  name: string;
  brandColor: string;
  monthlyTargets: {
    posts: number;
    reels: number;
    stories: number;
  };
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Task {
  id: string;
  clientId: string;
  date: string; // ISO string
  type: ContentType;
  title: string;
  description: string;
  assignedStaff: string[]; // User IDs
  status: TaskStatus;
  hashtags?: string;
  caption?: string;
  designLink?: string;
  videoLink?: string;
}
