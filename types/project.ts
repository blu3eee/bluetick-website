export type ProjectInfo = {
  name: string;
  time: string;
  role?: string;
  brief_description: string;
  key_words: string[];
  url?: string;
  links?: {
    github?: string;
    product?: string;
  };
  resume_points?: string[];
  team_of?: number;
};
