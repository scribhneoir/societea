// Type definitions for Societea TTRPG

export interface Character {
  name: string;
  age: number;
  gender: "male" | "female" | "";
  constitution: number;
  wit: number;
  genderSpecificScore: number; // Beauty for female, Wealth for male
  accomplishment: number;
  socialStanding: number;
  skills: Set<string> | string[]; // Set in memory, array in storage
  inventory: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "acceptable" | "forbidden";
}
