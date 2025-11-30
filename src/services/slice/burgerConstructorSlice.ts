import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderNumber: number | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderNumber: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const dragged = state.ingredients[action.payload.dragIndex];
      state.ingredients.splice(action.payload.dragIndex, 1);
      state.ingredients.splice(action.payload.hoverIndex, 0, dragged);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    setOrderNumber: (state, action: PayloadAction<number>) => {
      state.orderNumber = action.payload;
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setOrderNumber
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

export const selectConstructor = (state: RootState) => state.burgerConstructor;

export const selectIngredientCount = createSelector(
  [selectConstructor],
  ({ bun, ingredients }) => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 1;
    }

    ingredients.forEach((item) => {
      counts[item._id] = (counts[item._id] || 0) + 1;
    });

    return counts;
  }
);
