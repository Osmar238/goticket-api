const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/', require('./auth'));
router.use('/venues', require('./venues'));
router.use('/tickets', require('./tickets'));
router.use('/users', require('./users'));
router.use('/events', require('./events'));

router.get('/', (req, res) => {
  res.send('Welcome to GoTicket API');
});

module.exports = router;
