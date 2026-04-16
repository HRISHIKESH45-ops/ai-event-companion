export interface OutputScheduleItem {
  time: string;
  type?: string;
  activity: string;
  reason: string;
  backup_option?: string;
  energy_drain_score: number;
}

export interface GeneratedSchedule {
  title: string;
  hype_summary: string;
  prep_sheet: string[];
  plan: OutputScheduleItem[];
}

export interface FormData {
  name: string;
  interests: string;
  eventType: string;
  startTime: string;
  endTime: string;
  priority: string;
  notes: string;
  persona: string;
  image?: string;
}
