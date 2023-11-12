import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import QuestionPage from './pages/QuestionPage';
import PollPage from './components/PollPage';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import { Provider } from 'react-redux';
import { store } from './store/store'
import EndQuiz from './pages/EndQuiz';

const App = () => {


  return (
    <>
      <Provider store={store}>
        <div>
          <Toaster position="top-right" />
        </div>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Use a ternary operator to conditionally render QuestionPage or PollPage */}
            <Route path='/poll/:roomId' element={<MainPage />} />
            <Route path="/qended/:roomId" element={<EndQuiz />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;
