export type User = {
  uid: string;
  displayName: string;
  photoURL: string;
  points: number;
};

export type Challenge = {
  id: string;
  topics: Array<string>;
  title: string;
  subTitle: string;
  description: string;
  rules: Array<string>;
  duration: number;
  level: number;
};

export type ChallengeTakenType = {
  id: string;
  challengeId: Challenge['id'];
  timestamp: number;
  duration: Challenge['duration'];
  level: Challenge['level'];
  succeed: boolean | null;
  title: Challenge['title'];
};
