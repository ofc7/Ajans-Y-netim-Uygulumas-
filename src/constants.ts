import { Client, Task, User } from './types';
import { addDays, format, startOfMonth, subDays } from 'date-fns';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Ahmet', role: 'Design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet' },
  { id: '2', name: 'Ömer', role: 'Copywriting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omer' },
  { id: '3', name: 'Zeynep', role: 'Publishing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep' },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Aden Gıda',
    brandColor: '#f59e0b',
    monthlyTargets: { posts: 12, reels: 8, stories: 10 },
  },
  {
    id: 'c2',
    name: 'BS3D',
    brandColor: '#3b82f6',
    monthlyTargets: { posts: 5, reels: 3, stories: 15 },
  },
  {
    id: 'c3',
    name: 'BlackSea Additive',
    brandColor: '#10b981',
    monthlyTargets: { posts: 8, reels: 4, stories: 5 },
  },
];

const today = new Date();

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    clientId: 'c1',
    date: format(today, 'yyyy-MM-dd'),
    type: 'Post',
    title: 'Yeni şurup ürünleri',
    description: 'Yeni aromalı şurup serisinin tanıtımı.',
    assignedStaff: ['1', '2'],
    status: 'Tasarımda',
  },
  {
    id: 't2',
    clientId: 'c1',
    date: format(today, 'yyyy-MM-dd'),
    type: 'Reels',
    title: 'Kahve hazırlama videosu',
    description: 'Şuruplarımızla nasıl latte hazırlanacağını gösteren kısa bir video.',
    assignedStaff: ['3'],
    status: 'Planlandı',
  },
  {
    id: 't3',
    clientId: 'c2',
    date: format(today, 'yyyy-MM-dd'),
    type: 'Hikaye',
    title: '3D yazıcı ipucu',
    description: 'Tabla hizalama hakkında hızlı ipucu.',
    assignedStaff: ['2'],
    status: 'Yayına Hazır',
  },
  {
    id: 't4',
    clientId: 'c3',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    type: 'Post',
    title: 'Haftalık güncelleme',
    description: 'Eklemeli imalat hakkında genel güncelleme.',
    assignedStaff: ['1'],
    status: 'Yayınlandı',
  },
  {
    id: 't5',
    clientId: 'c1',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    type: 'Kaydırmalı',
    title: 'Şurup tarifleri',
    description: 'Şuruplarımızı kullanan 5 farklı tarif.',
    assignedStaff: ['1', '2'],
    status: 'Planlandı',
  },
];
