type themeType = "light" | "dark";

type profileOptions = "profile" | "settings" | "feedback";

type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
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
