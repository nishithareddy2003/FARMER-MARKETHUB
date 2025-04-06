export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  severity: 'normal' | 'warning' | 'critical';
  createdAt: Date;
  updatedAt: Date;
} 