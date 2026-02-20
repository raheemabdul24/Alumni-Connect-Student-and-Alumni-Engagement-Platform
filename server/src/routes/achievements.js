const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { achievementSchema } = require('../validators/achievementValidator');
const { listAchievements, addAchievement, editAchievement, deleteAchievement } = require('../controllers/achievementController');

router.get('/', requireAuth, listAchievements);
router.post('/', requireAuth, validate(achievementSchema), addAchievement);
router.put('/:id', requireAuth, validate(achievementSchema), editAchievement);
router.delete('/:id', requireAuth, deleteAchievement);

module.exports = router;
