import React from 'react';
import './App.css';
import CurrencyPairs from './components/CurrencyPairs';
import Login from './components/Login';
import {ForexApiProvider} from './contexts/ForexApiContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'




function App() {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ForexApiProvider>
              <CurrencyPairs />
            </ForexApiProvider>}
        />
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </Router>
  );
}

export default App;
