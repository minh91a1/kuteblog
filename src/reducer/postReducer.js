import { createSlice } from "@reduxjs/toolkit";

const postReducer = createSlice({
    name: 'post',
    initialState: { value: { title: '', post: '' }},
    reducers: {
        edit: (state, action) => {
            state.value = action.payload
        }
    }
})

export default postReducer