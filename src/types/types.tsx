export type project = {
  id: string;
  name: string;
  description: string;
  order: number;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
};

export type meeting = {
  id: string;
  project_id: string;
  name: string;
  description: string;
  order: number;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
};

export type minutes = {
  id: string;
  project_id: string;
  meeting_id: string;
  date: string;
  summary: string;
  vector: number[];
  minutes_original: string;
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
};

export type minutes_chunk = {
  id: string;
  project_id: string;
  meeting_id: string;
  minutes_id: string;
  date: string;
  minutes_chunk: string;
  vector: number[];
  _rid?: string;
  _self?: string;
  _etag?: string;
  _attachments?: string;
  _ts?: number;
};

// export interface ChatMessage {
//   text: string;
//   isUser: boolean;
// }

export interface ChatMessage {
  role: string;
  content: string;
}