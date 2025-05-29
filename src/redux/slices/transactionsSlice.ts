import { createSlice } from '@reduxjs/toolkit';
import axios from 'src/utils/axios';
import { _transactions } from 'src/_mock/_transactions';
import { HOST_API } from 'src/config-global';

interface TransactionsState {
  transactions: any[];
}

const initialState: TransactionsState = {
  transactions: _transactions.map((user: any) => ({
    id: user.id,
    name: user.customer.name,
    date: user.date,
    amount: user.amount,
    avatarUrl: user.customer.avatarUrl,
    status: user.status,
  })),
};

export const gitTransactions = async () => {
  const transactions = await axios.get(`${HOST_API}users/transactions`);

  return transactions.data.transactions;
};

const TransactionsSlice = createSlice({
  name: 'Transactions',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload.transactions;
    },
  },
});

export const { setTransactions } = TransactionsSlice.actions;

export default TransactionsSlice.reducer;
