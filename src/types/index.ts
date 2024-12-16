import { TimerMode } from '../hooks/useTimer';
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Folder {
  folder_id: number;
  title: string;
  created_date: string;
  user_id: string;
  parent_folder_id: string | null;
  last_accessed_date?: string;
}

export interface Presentation {
  presentation_id: string;
  title: string;
  uploaded_date: string;
  file_path: string;
  user_id: string;
  thumbnail: string;
  folder_id: number | null;
  last_accessed_date?: string;
  total_time: number;
}

export interface Presentations {
  [key: string]: Presentation;
}

export interface CueCard {
  cuecard_id: number;
  presentation_id: string;
  page_number: number;
  content: string;
  order: number;
  emojis: string[];
  position_x: number;
  position_y: number;
  is_emoji_collapsed: boolean;
  bold_ranges: string[];
  recognizedParts?: {
    word: string;
    recognized: boolean;
  }[];
}
export interface IndicatorPosition {
  cuecard_id: number;
  x: number;
  y: number;
}
export interface TimerSession {
  session_id: number;
  presentation_id: string;
  user_id: string;
  total_time: number;
  actual_time: number;
  mode: TimerMode;
  created_at: string;
  view_counts: { [key: number]: number };
}

export type EditingType = 'presentation' | 'folder' | null;

export type SortOption = 'date' | 'name';

export interface Feedback {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  email: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  platform: string | null;
}