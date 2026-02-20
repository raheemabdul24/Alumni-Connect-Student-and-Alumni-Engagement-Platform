const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { sendConnectionSchema, respondSchema } = require('../validators/connectionValidator');
const { sendRequest, respondRequest, cancelRequest, listConnections } = require('../controllers/connectionController');

router.post('/', requireAuth, validate(sendConnectionSchema), sendRequest);
router.post('/:id/respond', requireAuth, validate(respondSchema), respondRequest);
router.delete('/:id', requireAuth, cancelRequest);
router.get('/', requireAuth, listConnections);

module.exports = router;
