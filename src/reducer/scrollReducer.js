import { createSlice } from "@reduxjs/toolkit";

const scrollSlice = createSlice({
    name: 'scroll',
    initialState: {value: {position: {posX:0, posY:0}}},
    reducers: {
        save: (state, action) => {
            state.value.position = action.payload;
        }
    }
})

// export store (to read data)
export default scrollSlice.reducer

// export function to interact with the store
export const { save } = scrollSlice.actions;