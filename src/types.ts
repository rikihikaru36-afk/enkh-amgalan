export interface Game {
  id: string;
  title: string;
  genre: string;
  platform: string;
  description: string;
  progress: number;
  tags: string[];
}

export interface Song {
  title: string;
  album: string;
  year: number;
  duration: string;
  riffNotes: number[]; // Frequencies for mock synthesizer
}

export interface ContactMessage {
  name: string;
  email: string;
  role: string;
  message: string;
}
