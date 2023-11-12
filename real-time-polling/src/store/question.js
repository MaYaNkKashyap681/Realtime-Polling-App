// questionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalUsers: 0,
  question: {
    description: '',
    image: {
      file: null,
      name: '',
      url: '',
    },
    options: ['', '', '', ''],
    correctOption: ''
  },
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setTotalUsers: (state, action) => {
      state.totalUsers = action.payload;
    },
    setQuestionDescription: (state, action) => {
      state.question.description = action.payload;
    },
    setAudioFile: (state, action) => {
      // Handle audio file here if needed
    },
    setImageFile: (state, action) => {
      const { file, name, url } = action.payload;
      state.question.image.file = file;
      state.question.image.name = name;
      state.question.image.url = url;
    },
    setOptions: (state, action) => {
      state.question.options = action.payload;
    },
    setCorrectOption: (state, action) => {
      state.correctOption = action.payload
    },
    resetQuestionState: (state, action) => {
      state.question.options = initialState.question.options;
      state.question.image.file = initialState.question.image.file;
      state.question.image.name = initialState.question.image.name;
      state.question.image.url = initialState.question.image.url;
      state.correctOption = initialState.question.correctOption
    },
  },
});

export const {
  setTotalUsers,
  setQuestionDescription,
  setAudioFile,
  setImageFile,
  setOptions,
  setCorrectOption,
  resetQuestionState,
} = questionSlice.actions;

export const selectTotalUsers = (state) => state.totalUsers;
export const selectQuestion = (state) => state.question;

export default questionSlice.reducer;
