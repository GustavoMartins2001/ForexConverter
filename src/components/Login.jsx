import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // opcional: para estilos

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro desconhecido');

    localStorage.setItem('token', data.token); //salva token para guardar sessao
    navigate('/');
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="login-container">
      <h2>Fazer Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@exemplo.com"
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
