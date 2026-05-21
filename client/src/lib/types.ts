type themeType = "light" | "dark";

type profileOptions = "profile" | "settings" | "feedback";

type User = {
  _id: string;
  email: string;
  higherEducation: string;
  college: string;
  achievements: string;
  linkedin: string;
  name: string;
  currentJobRole?: string;
  phone: string;
  github: string
  theme: themeType;
  createdAt: string;
  updatedAt: string;
  _v: number;
};

export type {
  themeType,
  profileOptions,
  User,
};
