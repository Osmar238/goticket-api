const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggerUi.serve);
// withCredentials makes Try it out send the login cookie,
// otherwise protected routes would say 401 even after logging in
router.get('/api-docs', swaggerUi.setup(swaggerDocument, { swaggerOptions: { withCredentials: true } }));

module.exports = router;
