export interface MinutesSection {
  section_title: string;
  minutes_section: string;
}

export interface Minutes {
  date: string;
  minutes: MinutesSection[];
}