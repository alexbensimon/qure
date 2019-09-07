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
};
