export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Backend",
    skills: ["Node.js", "Express", "Java", "Spring Boot", "REST APIs", "JWT Auth"],
  },
  {
    name: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "D3.js"],
  },
  {
    name: "Cloud",
    skills: ["Docker", "Redis", "Linux", "CI/CD"],
  },
  {
    name: "Databases",
    skills: ["MongoDB", "Redis", "SQL"],
  },
  {
    name: "Tools",
    skills: [
      "Git",
      "Python",
      "XGBoost",
      "Scikit-learn",
      "Pandas",
      "OpenCV",
      "MediaPipe",
      "NetworkX",
    ],
  },
];
