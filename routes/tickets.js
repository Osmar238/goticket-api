const router = require('express').Router();
const ticketsController = require('../controllers/tickets');

router.get('/', ticketsController.getAll);
router.get('/:id', ticketsController.getSingle);
router.post('/', ticketsController.createTicket);
router.put('/:id', ticketsController.updateTicket);
router.delete('/:id', ticketsController.deleteTicket);

module.exports = router;
