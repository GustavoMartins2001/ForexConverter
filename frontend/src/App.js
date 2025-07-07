import React from 'react';
import './App.css';
import CurrencyPairs from './components/CurrencyPairs';
import NewCurrency from './components/NewCurrency';
import Login from './components/Login';
import UserAuthentication from './components/UserAuthentication';
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
            // UserAuthentication encobre toda a tela padrão, garantindo que só um usuario logado pode acessar a tela.
            // ForexApiProvider é usado para fornecer o contexto da API de câmbio para os componentes filhos;
            <UserAuthentication>
              <ForexApiProvider>
              <CurrencyPairs />
              </ForexApiProvider>
            </UserAuthentication>

            }
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/currencies/new"
          element={<NewCurrency />}
        />
      </Routes>
    </Router>
  );
}

export default App;
