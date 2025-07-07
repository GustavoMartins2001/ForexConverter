import React, { useState,useEffect } from 'react';
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import "./Styles.css";

function AddCurrencyForm() {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado, se não estiver, redireciona para a página de login.
    useEffect(() => {
      if (localStorage.getItem("token") === null) {
          console.error("Usuario não autenticado. redirecionando para tela de login.");
          navigate("/login");
        }
    }, [])

  const handleAddCurrency = async () => {
    if (!name || !currency) {
      setMessage('Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/currencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           name,
           currency 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Moeda adicionada com sucesso!');
        setName('');
        setCurrency('');
      } else {
        setMessage(data.error || 'Erro ao adicionar moeda.');
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setMessage('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h3>Adicionar Nova Moeda</h3>
      <input
        type="text"
        placeholder="Sigla do Par de Moedas (ex: USD-BRL)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />
      <input
        type="text"
        placeholder="Descrição do par (ex: Dólar/Real Brasileiro)"
        value={currency}
        onChange={(e) => setCurrency(e.target.value.toUpperCase())}
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleAddCurrency} variant="primary" size="lg" className="mt-3">
        Adicionar
      </button>
      {message && <p>{message}</p>}
    </div>



);
}

export default AddCurrencyForm;
