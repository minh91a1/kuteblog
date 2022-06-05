import { createSlice } from "@reduxjs/toolkit";

const trashSlice = createSlice({
    name: 'trash',
    initialState: {value: {active: false}},
    reducers: {
        openTrash: (state, action) => {
            if (state.value.active !== action.payload) {
                state.value.active = action.payload;
            }
        }
    }
})

// export store (to read data)
export default trashSlice.reducer

// export function to interact with the store
export const { openTrash } = trashSlice.actions;