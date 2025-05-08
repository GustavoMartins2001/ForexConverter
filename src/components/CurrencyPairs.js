import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
// import { createPortal } from 'react-dom';
import { ForexApiContext } from "../contexts/ForexApiContext";
import "bootstrap/dist/css/bootstrap.css";

function CurrencyPairs() {
  // organiza em ordem alfabética
  var forexData = useContext(ForexApiContext);
  const [selectedPair, setSelectedPair] = useState();
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // setSelectedPair() só atualiza selectedPair quando o código é renderizado novamente. useEffect é chamado após a renderização.
    if (selectedPair !== undefined) {
      console.log("Updated selectedPair:", selectedPair);
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
    setSelectedPair(selected);
  };
  /**
   *
   * @param {*} e.target.value money amount.
   * @return void
   * @description when entering a money amount, set the moneyAmount state.
   */
  const handleMoneyUpdate = (e) => {
    const amount = e.target.value;
    setMoneyAmount(amount);
  };

  //TODO: criar um componente separado para o search bar com filtragem de moedas por nome ou sigla.
  /**
   *
   * @param {*} e money amount.
   * @return void
   * @description when submiting the form, make a get request to the api to get the exchange rate. Then calculate the converted value and show it in an alert.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPair && moneyAmount) {
      const response = await axios.get(
        `https://brapi.dev/api/v2/currency?currency=${selectedPair}&token=${process.env.REACT_APP_API_KEY}`
      );
      setResult(response.data.currency[0]); // para ser usado em outro momento futuro
      const res = response.data.currency[0];
      if (res) {
        const convertedValue = moneyAmount * res.askPrice;
        alert(
          `Convertendo de ${res.name.split("/")[0]} para ${res.name.split("/")[1]} com a quantia de ${moneyAmount} ${res.fromCurrency}.\nValor convertido: ${convertedValue.toFixed(2)} ${res.toCurrency}`
        );
      } else {
        alert("Par de moedas não encontrado ou valor invalido.");
      }
    } else {
      alert("Por favor, selecione um par de moedas e insira um valor.");
    }
  }

  return (
    <Container className="text-center">
      <Form>
        <Form.Group>
          <Form.Label>Selecione as moedas</Form.Label>
          <Row className="md-6">
            <Col>
              {
                <Form.Control as="select" onChange={handlePairSelect}>
                  <option value="">Escolha um par de moedas</option>
                  {forexData && Array.isArray(forexData) ? (
                    forexData
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name.split("/")[0]} {item.name.split("/")[1]} -{" "}
                          {item.currency}
                        </option>
                      ))
                  ) : (
                    <option value="" disabled>
                      Sem dados
                    </option>
                  )}
                </Form.Control>
              }
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Text></InputGroup.Text>
                <Form.Control onChange={handleMoneyUpdate}
                  type="number"
                  min="0  "
                  placeholder="insira a quantia em dinheiro"
                  aria-label="insira a quantia em dinheiro"
                />
              </InputGroup>
            </Col>
          </Row>
        </Form.Group>
      </Form>
      <Button variant="primary" size="lg" className="mt-3" onClick={handleSubmit}>
        Calcular
      </Button>
    </Container>
  );
}

export default CurrencyPairs;
