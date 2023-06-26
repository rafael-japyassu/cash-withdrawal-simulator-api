export type AuthenticateOutput = {
  token: string;
  user: {
    name: string;
    email: string;
    balance: number;
  }
}
