import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExampleState {
  data: string[];
}

const initialState: ExampleState = {
  data: [],
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    fetchDataSuccess(state, action: PayloadAction<string[]>) {
      state.data = action.payload;
    },
  },
});

export const { fetchDataSuccess } = exampleSlice.actions;
export default exampleSlice.reducer;
