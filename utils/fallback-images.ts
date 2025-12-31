import { Category } from '@/lib/types';

// Fallback images for each category using Unsplash
export const FALLBACK_IMAGES: Record<Category, string> = {
  music: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  tech: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  workshop: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
  food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  art: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
};

export function getFallbackImage(category: string): string {
  return FALLBACK_IMAGES[category as Category] || FALLBACK_IMAGES.other;
}
