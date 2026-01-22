import express from 'express';
import {
  getAllCollectionPoints,
  getCollectionPointAdmin,
  updateCollectionPointStatus,
  deleteCollectionPointAdmin,
  getDashboardStats,
  getAllUsers
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protectAdmin);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);

router.route('/collection-points')
  .get(getAllCollectionPoints);

router.route('/collection-points/:id')
  .get(getCollectionPointAdmin)
  .delete(deleteCollectionPointAdmin);

router.put('/collection-points/:id/status', updateCollectionPointStatus);

export default router;
