import React, { useContext, useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
// import { createPortal } from 'react-dom';
import { ForexApiContext } from "../contexts/ForexApiContext";
import { ResultModal } from "./ResultModal"
import "bootstrap/dist/css/bootstrap.css";

function CurrencyPairs() {
  // organiza em ordem alfabética
  var forexData = useContext(ForexApiContext);
  const [selectedPair, setSelectedPair] = useState();
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    // setSelectedPair() só atualiza selectedPair quando o código é renderizado novamente. useEffect é chamado após a renderização.
    if (selectedPair !== undefined) {
      console.log("Updated selectedPair:", selectedPair);
    }
  }, [selectedPair]);

  useEffect(() => {
    if (showModal) {
      console.log("Modal foi exibido!");
    }
  }, [showModal]);

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

  const handleSubmit = async (e) => {
    setShowModal(false);
    e.preventDefault();
    if (selectedPair && moneyAmount) {

      //TODO: passar essa logica para o backend, e então retornar o valor em JSON e dar parse para usar no setresult;
      // Tentar pegar do banco de dados primeiro antes de acessar a API.
      const response = await axios.get(
        `https://brapi.dev/api/v2/currency?currency=${selectedPair}&token=${process.env.REACT_APP_API_KEY}`
      );

      const res = response.data.currency[0];
      if (res) {
        const convertedValue = moneyAmount * res.askPrice;


        setResult({convertedValue: convertedValue,  data:response.data.currency[0]}); // para ser usado em outro momento futuro
        setShowModal(true);
        console.log(showModal)

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
                //TODO: adicionar função de busca por nome ou sigla de moeda
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
      {showModal && createPortal(<ResultModal showModal = {showModal} setShowModal = {setShowModal} result = {result}/>, document.getElementById('modal-root'))}
      <div id="modal-root"></div>
    </Container>
  );
}

export default CurrencyPairs;
