import React, { useState } from 'react';
import { Button, Container, Modal, Alert, Row, Col } from 'react-bootstrap';
import { createPortal } from 'react-dom';
import "./ResultModal.css";

export const ResultModal = ({showModal, setShowModal, result}) => {
    console.log(showModal, result);
    const [error, setError] = useState(null);
    
    const handleClose = () => {
        setShowModal(false);
    };
    
    return (
        <>
        {showModal && document.body && createPortal(
            <Modal size="xlg" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Resultado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error ? (
                <Alert variant="danger">{error}</Alert>
                ) : (
                <Container>
                    <Row>
                        <Col className="md-12">
                        <label>Taxa de câmbio de {result.data.fromCurrency} -{'>'} {result.data.toCurrency}:</label>
                        <p className="wrapper">{Number(result.data.askPrice)}</p>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col className="md-6">
                        <label>Valor convertido:</label>
                        <p className="wrapper">{result.convertedValue.toFixed(2)}</p>
                        </Col>
                    </Row>
                </Container>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Fechar
                </Button>
            </Modal.Footer>
            </Modal>,
            document.getElementById('modal-root')
        )}
        </>
    );
}