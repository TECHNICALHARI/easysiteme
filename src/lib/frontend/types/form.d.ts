export interface FormData {
  fullName: string;
  username: string;
  title: string;
  bio: string;
  avatar: string;
  links: any[];            
  headers: any[];          
  gallery: any[];         
  youtube: string;
  instagram: string;
  calendly: string;
  posts: any[];            
  metaTitle: string;
  metaDescription: string;
  nsfwWarning: boolean;
  preferredLink: 'primary' | 'custom';
  customDomain: string;
  emojiLink: string;
  gaId: string;
  theme: string; 
}
