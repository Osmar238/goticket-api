const router = require('express').Router();
const venuesController = require('../controllers/venues');

router.get('/', venuesController.getAll);
router.get('/:id', venuesController.getSingle);
router.post('/', venuesController.createVenue);
router.put('/:id', venuesController.updateVenue);
router.delete('/:id', venuesController.deleteVenue);

module.exports = router;
