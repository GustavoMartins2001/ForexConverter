const router = express.Router();

// Middleware para verificar se o usuario está logado antes de realizar uma ação sensivel
handlesSession = (req, res, next) => {
    if(localStorage.getItem('session')) {
        const session = JSON.parse(localStorage.getItem('session'));
        if (session && session.userId) {
            req.session = session;
            next();
        }
    } 
    //Retorna um erro 401 se não houver sessão ativa daque usuário
    else {
        res.status(401).send('Unauthorized: No session found for this user');
        return;
    }
}