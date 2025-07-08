
export type Language = 'en' | 'es' | 'pt';

export type ContactMethod = 'email' | 'whatsapp' | 'phone' | 'instagram' | 'facebook' | 'linkedin' | 'telegram';

export interface User {
  name: string;
  contactMethod: ContactMethod;
  contactInfo: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}