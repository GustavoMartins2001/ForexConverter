import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../util/auth';

//checa se o usuário está autenticado.
//se sim, renderiza os filhos (children), se não, redireciona para a página de login
export default function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}
