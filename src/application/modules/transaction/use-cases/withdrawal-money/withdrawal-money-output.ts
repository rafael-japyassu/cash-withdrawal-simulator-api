export type WithdrawalMoneyNote = {
  note: string;
  quantity: number;
};

export type WithdrawalMoneyOutput = {
  transactionId: string;
  currentValue: number;
  notes: WithdrawalMoneyNote[];
};
