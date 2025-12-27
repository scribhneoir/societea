// Skills data for High Societea TTRPG

export const skills = {
  beauty: {
    feminine: ["flirtation", "match making", "fashion"],
    masculine: ["intimidation", "book keeping", ""],
    mutuallyAcceptable: ["whist", "etiquette"],
    mutuallyForbidden: ["seduction"],
  },
  wit: {
    feminine: ["recitation", "persuasion", ""],
    masculine: ["oration", "logic", "politics"],
    mutuallyAcceptable: ["charm", "well read"],
    mutuallyForbidden: ["deception", "evesdropping"],
  },
  constitution: {
    feminine: ["archery", ""],
    masculine: ["fencing", "hunting", "military training"],
    mutuallyAcceptable: ["dancing", "horsmanship"],
    mutuallyForbidden: ["stealth", "boxing", "alchohol tolerance"],
  },
  accomplishment: {
    feminine: ["illustration", "needlework"],
    masculine: ["patronage", "publishing", "clericship", "medicine", "classical languages"],
    mutuallyAcceptable: [
      "singing",
      "piano forte",
      "penmanship",
      "conversational languages",
      "well traveled",
    ],
    mutuallyForbidden: ["piracy", "gambling"],
  },
};

// Helper types
export type AbilityScore = "beauty" | "wit" | "constitution" | "accomplishment";
export type Gender = "male" | "female";

export interface SkillWithAbility {
  name: string;
  ability: AbilityScore;
  isForbidden: boolean;
}

// Helper function to get all acceptable skills for a gender
export function getAcceptableSkills(gender: Gender): SkillWithAbility[] {
  const result: SkillWithAbility[] = [];
  const skillCategories: AbilityScore[] = ["beauty", "wit", "constitution", "accomplishment"];

  skillCategories.forEach((ability) => {
    const categorySkills = skills[ability];
    const genderSkills = gender === "female" ? categorySkills.feminine : categorySkills.masculine;
    const mutualSkills = categorySkills.mutuallyAcceptable;

    // Add gender-specific skills
    genderSkills.forEach((skill) => {
      if (skill.trim()) {
        result.push({ name: skill, ability, isForbidden: false });
      }
    });

    // Add mutually acceptable skills
    mutualSkills.forEach((skill) => {
      if (skill.trim()) {
        result.push({ name: skill, ability, isForbidden: false });
      }
    });
  });

  return result;
}

// Helper function to get all forbidden skills for a gender
export function getForbiddenSkills(gender: Gender): SkillWithAbility[] {
  const result: SkillWithAbility[] = [];
  const skillCategories: AbilityScore[] = ["beauty", "wit", "constitution", "accomplishment"];

  skillCategories.forEach((ability) => {
    const categorySkills = skills[ability];
    // Opposite gender skills are forbidden
    const oppositeGenderSkills =
      gender === "female" ? categorySkills.masculine : categorySkills.feminine;
    const forbiddenSkills = categorySkills.mutuallyForbidden;

    // Add opposite gender skills
    oppositeGenderSkills.forEach((skill) => {
      if (skill.trim()) {
        result.push({ name: skill, ability, isForbidden: true });
      }
    });

    // Add mutually forbidden skills
    forbiddenSkills.forEach((skill) => {
      if (skill.trim()) {
        result.push({ name: skill, ability, isForbidden: true });
      }
    });
  });

  return result;
}

// Helper function to get the ability score for a specific skill
export function getSkillAbility(skillName: string): AbilityScore | null {
  const skillCategories: AbilityScore[] = ["beauty", "wit", "constitution", "accomplishment"];
  const normalizedSkillName = skillName.toLowerCase().trim();

  for (const ability of skillCategories) {
    const categorySkills = skills[ability];
    const allSkills = [
      ...categorySkills.feminine,
      ...categorySkills.masculine,
      ...categorySkills.mutuallyAcceptable,
      ...categorySkills.mutuallyForbidden,
    ];

    if (allSkills.some((skill) => skill.toLowerCase().trim() === normalizedSkillName)) {
      return ability;
    }
  }

  return null;
}

// Helper function to check if a skill is forbidden for a gender
export function isSkillForbidden(skillName: string, gender: Gender): boolean {
  const forbiddenSkills = getForbiddenSkills(gender);
  const normalizedSkillName = skillName.toLowerCase().trim();
  return forbiddenSkills.some((skill) => skill.name.toLowerCase().trim() === normalizedSkillName);
}
