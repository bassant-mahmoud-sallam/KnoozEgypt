export interface Iuser {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: null;
  profile_image: null;
  cover_image: null;
  country: Country;
}

interface Country {
  id: number;
  name: string;
}


