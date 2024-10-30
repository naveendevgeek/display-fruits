import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FruitState {
  data: any[];
  fruitsGroupByFamily: string[];
  fruitsGroupByOrder: string[];
  fruitsGroupByGenus: string[];

}

const initialState: FruitState = {
  data: [],
  fruitsGroupByFamily: [],
  fruitsGroupByOrder: [],
  fruitsGroupByGenus: []
};

const fruitsSlice = createSlice({
  name: 'fruits',
  initialState,
  reducers: {
    fetchDataSuccess(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    },
    setFruitsGroupByFamily(state, action: PayloadAction<any[]>) {
      state.fruitsGroupByFamily = action.payload;
    },
    setFruitsGroupByOrder(state, action: PayloadAction<any[]>) {
      state.fruitsGroupByOrder = action.payload;
    },
    setFruitsGroupByGenus(state, action: PayloadAction<any[]>) {
      state.fruitsGroupByGenus = action.payload;
    },
  },
});

export const { fetchDataSuccess, setFruitsGroupByFamily, setFruitsGroupByOrder, setFruitsGroupByGenus } = fruitsSlice.actions;
export default fruitsSlice.reducer;