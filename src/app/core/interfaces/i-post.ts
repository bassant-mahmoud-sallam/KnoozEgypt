export interface IPost {
  id: number;
  user: User;
  caption: string;
  image: string;
  location: Location;
  mentioned_user: null;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  created_at_full: string;
}

interface Location {
  name: null;
  latitude: null;
  longitude: null;
}

interface User {
  id: number;
  name: string;
  username: string;
  profile_image: string;
}



