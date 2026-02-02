export interface Icomment {
  id: number;
  user: User;
  comment: string;
  created_at: string;
  created_at_full: string;
}

interface User {
  id: number;
  name: string;
  profile_image: string;
}
