export type User = {
  uid: string;
  displayName: string;
};

export type Challenge = {
  id: string;
  topic: string;
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
  done: boolean;
};
