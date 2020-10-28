export interface Transaction {
  id: number;
  trans: string;
  sum: number;
  date: Date;
  mentions: string;
  contact: Contact;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
