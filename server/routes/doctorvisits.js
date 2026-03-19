const express = require('express');
const { getVisits, addVisit, updateVisit, deleteVisit } = require('../controllers/doctorvisits.controller');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getVisits);
router.post('/', addVisit);
router.put('/:id', updateVisit);
router.delete('/:id', deleteVisit);

module.exports = router;
