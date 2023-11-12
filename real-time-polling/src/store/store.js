import { configureStore } from "@reduxjs/toolkit"
import questionReducer from './question.js'

export const store = configureStore({
    reducer: {
        question: questionReducer
    },
})