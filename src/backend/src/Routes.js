import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    // caso o usuario não esteja logado, redireciona para a página de login
    //TODO: implementar session handler
    res.send('Welcome to the Forex Converter API! Please log in to access the dashboard.');
    // if(localStorage.getItem('user') === null) {
    //     return router.route('/login').get((req, res) => {
    //         res.send('Please log in to access the Forex Converter API');
    //     })
    // }
    // else {
    //     res.send('dashboardPageInfo');
    // }
});

// Example route: Convert currency
router.get('/convert', (req, res) => {
    // Example: /convert?from=USD&to=EUR&amount=100
    const { from, to, amount } = req.query;
    // Placeholder logic
    res.json({
        from,
        to,
        amount,
        result: 'Conversion logic not implemented yet'
    });
});


export default router;