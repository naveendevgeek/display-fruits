import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FruitState {
    data: object[];
  }
  
  const initialState: FruitState = {
    data: [],
  };

const fruitSlice = createSlice({
  name: 'fruits',
  initialState,
  reducers: {
    fetchDataSuccess(state, action: PayloadAction<object[]>) {
      state.data = action.payload;
    },
  },
});

// export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default fruitSlice.reducer;
