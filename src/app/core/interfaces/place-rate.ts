export interface PlaceRate {
  id: number;
  rating: string;
  review: null;
  created_at: string;
  user: User;
}

interface User {
  id: number;
  name: string;
  profile_image: string;
}
