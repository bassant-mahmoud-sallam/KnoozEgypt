export interface Iplace {
  id: number;
  name: string;
  cover_image: string;
  rating: number;
  rating_count: number;
  views_count: string;
  governorate: Governorate;
  is_saved: boolean;
}

interface Governorate {
  id: number;
  name: string;
}

