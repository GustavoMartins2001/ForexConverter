import React from 'react';
import './App.css';
import CurrencyPairs from './components/CurrencyPairs';
import { Container  } from 'react-bootstrap';
import {ForexApiProvider} from './contexts/ForexApiContext';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {
          <ForexApiProvider>
            <Container className="text-center">
              <h1>Forex API</h1>
              <CurrencyPairs />
              
            </Container>
          </ForexApiProvider>
        }
      </header>
    </div>
  );
}

export default App;
