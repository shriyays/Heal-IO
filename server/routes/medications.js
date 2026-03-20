const express = require('express');
const {
  getMedications,
  addMedication,
  updateMedication,
  toggleActive,
  logAdherence,
  getAdherence,
} = require('../controllers/medications.controller');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getMedications);
router.post('/', addMedication);
router.put('/:id', updateMedication);
router.patch('/:id/toggle', toggleActive);

router.post('/adherence', logAdherence);
router.get('/adherence', getAdherence);

module.exports = router;
