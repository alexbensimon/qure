export type User = {
  uid: string;
  displayName: string;
};

export type Challenge = {
  topic: string;
  title: string;
  subTitle: string;
  description: string;
  rules: Array<string>;
  duration: number;
};
