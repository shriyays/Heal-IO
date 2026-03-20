const express = require('express');
const {
  createLog,
  getLogs,
  getLogByDate,
  deleteLog,
} = require('../controllers/dailylogs.controller');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(isAuthenticated);

router.post('/', createLog);
router.get('/', getLogs);
router.get('/:date', getLogByDate);
router.delete('/:id', deleteLog);

module.exports = router;
