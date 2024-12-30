export type project = {
  id: string;
  name: string;
  description: string;
  order: number;
};

export type meeting = {
  id: string;
  project_id: string;
  name: string;
  description: string;
  order: number;
};

export type minutes = {
  id: string;
  project_id: string;
  meeting_id: string;
  date: string;
  summary: string;
  vector: number[];
  minutes_original: string;
};

export type minutes_chunk = {
  id: string;
  project_id: string;
  meeting_id: string;
  minutes_id: string;
  date: string;
  minutes_chunk: string;
  vector: number[];
};

// export interface ChatMessage {
//   text: string;
//   isUser: boolean;
// }

export interface ChatMessage {
  role: string;
  content: string;
}