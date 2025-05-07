import React, { use, useContext , useEffect, useState} from 'react';
import axios from 'axios';
import { Button, Container, Modal, Image, Form, Alert, Badge } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import { ForexApiContext } from '../contexts/ForexApiContext';

function CurrencyPairs(){
    const forexData = useContext(ForexApiContext);
    const [selectedPair, setSelectedPair] = useState();
    const [currencyString, setCurrencyString] = useState();

    useEffect(()=>{
        // setSelectedPair() só atualiza selectedPair quando o código é renderizado novamente. useEffect é chamado após a renderização.
        if (selectedPair !== undefined) {
            console.log("Updated selectedPair:", selectedPair);
            console.log("Updated selectedPair:", selectedPair.toCurrency);

        }
    }, [selectedPair]);


    /**
     * 
     * @param {*} e Selected coinPair.
     * @return void
     * @description when selecting a pair, compare it against the forexData list to extract extra information
     */
    const handlePairSelect = (e) => {
        const selected = e.target.value;
        const selectedObject = forexData.find(item => item.symbol == selected);
        // Se tiver tempo, implementar tradução com api do google.
        const selectedString = "De " + selectedObject.fromName + " para " + selectedObject.toName
        console.log(selected)
        console.log(selectedString)
        setSelectedPair(selected); 
      };

    return (
      <Container>
        <Form>
        <Form.Group>
          <Form.Label>Selecione as moedas</Form.Label>
          <Form.Control as="select" onChange={handlePairSelect}>
            <option value="">Escolha um par de moedas</option>
            {forexData && Array.isArray(forexData) ? (
                forexData.map((coin) => (
                    
                    <option key={coin.symbol} value={coin.symbol}>
                    {"De " + coin.fromCurrency + " Para " + coin.toCurrency}
                    </option>
                ))
            ) : (
                <option value="" disabled>No data available</option>
            )}
            
          </Form.Control>
        </Form.Group>
      </Form>
      <p>bla bla bla</p>
      
    </Container>
    );

    
};

export default CurrencyPairs;