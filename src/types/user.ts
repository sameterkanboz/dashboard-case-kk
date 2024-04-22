export type User = {
  status: boolean;
  data: {
    id: number;
    fullName: string;
    email: string;
    token: string;
  };
};
