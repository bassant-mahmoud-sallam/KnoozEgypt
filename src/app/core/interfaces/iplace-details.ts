export interface IplaceDetails {
  id: number;
  name: string;
  description: string;
  governorate: Governorate;
  location: Location;
  rating: number;
  rating_count: number;
  views_count: string;
  opening_hours: Openinghours;
  best_time_to_visit: null;
  media: Media[];
  ticket_prices: Ticketprice[];
  is_saved: boolean;
  is_rating: boolean;
}

interface Ticketprice {
  id: number;
  visitor_type: string;
  visitor_type_label: string;
  price: number;
  currency: string;
}

interface Media {
  id: number;
  image_url: string;
  is_primary: boolean;
}

interface Openinghours {
  open_time: null;
  close_time: null;
  is_open_24_hours: boolean;
  is_closed: boolean;
}

interface Location {
  latitude: string;
  longitude: string;
}

interface Governorate {
  id: number;
  name: string;
}
