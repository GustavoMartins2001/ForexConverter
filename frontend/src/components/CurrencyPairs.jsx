import React, { useContext, useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
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
import "./Styles.css";

function CurrencyPairs() {
  // organiza em ordem alfabética
  var forexData = useContext(ForexApiContext);
  const [selectedPair, setSelectedPair] = useState();
  const [moneyAmount, setMoneyAmount] = useState(0);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado, se não estiver, redireciona para a página de login.
  useEffect(() => {
    console.log(localStorage.getItem("token"))
    if (localStorage.getItem("token") === null) {
        console.error("Usuario não autenticado. redirecionando para tela de login.");
        navigate("/login");
      }
    if (forexData) {
      console.log("Dados carregados:", forexData);
    } else {
      console.error("Dados dos pares não estão disponiveis.");
    }
  }, [])

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

      const response = await axios.get(
        `http://localhost:3000/api/currencies/${selectedPair}`, // retorna o par de moedas selecionado
        {headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem("token") || ''
              }}
      );

      const res = response;
      if (res) {
        const convertedValue = parseFloat(moneyAmount) * parseFloat(res.data.askPrice);
        setResult({convertedValue: convertedValue,  data:res.data});
        setShowModal(true);

      } else {
        console.log("Par de moedas não encontrado ou valor invalido.");
      }
    } else {
      console.log("Por favor, selecione um par de moedas e insira um valor.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container className="text-center d-flex flex-column align-items-center justify-content-center full">
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
                    min="0"
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
    </div>
  );
}

export default CurrencyPairs;
