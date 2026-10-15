const router = require('express').Router();
const ticketsController = require('../controllers/tickets');
const { isAuthenticated } = require('../middleware/auth');

// Reading is open to everyone. Changing data needs a login.
router.get('/', ticketsController.getAll);
router.get('/:id', ticketsController.getSingle);
router.post('/', isAuthenticated, ticketsController.createTicket);
router.put('/:id', isAuthenticated, ticketsController.updateTicket);
router.delete('/:id', isAuthenticated, ticketsController.deleteTicket);

module.exports = router;
