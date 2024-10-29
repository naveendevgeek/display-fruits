import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FruitState {
  data: any[];
}

const initialState: FruitState = {
  data: [],
};

const fruitsSlice = createSlice({
  name: 'fruits',
  initialState,
  reducers: {
    fetchDataSuccess(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    },
  },
});

export const { fetchDataSuccess } = fruitsSlice.actions;
export default fruitsSlice.reducer;
