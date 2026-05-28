export interface Profile {
  id: string;
  name: string;
  subtitle: string;
  image_url: string;
  selected_variant: string;
  updated_at: string;
}

export interface Link {
  id: string;
  profile_id: string;
  label: string;
  subtitle?: string;
  url: string;
  icon: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Social {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  sort_order: number;
}

export interface ProfileData extends Profile {
  links: Link[];
  socials: Social[];
}
