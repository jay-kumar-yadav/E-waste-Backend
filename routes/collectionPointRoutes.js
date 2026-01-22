import express from 'express';
import {
  createCollectionPoint,
  getUserCollectionPoints,
  getCollectionPoint,
  updateCollectionPoint,
  deleteCollectionPoint
} from '../controllers/collectionPointController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getUserCollectionPoints)
  .post(createCollectionPoint);

router.route('/:id')
  .get(getCollectionPoint)
  .put(updateCollectionPoint)
  .delete(deleteCollectionPoint);

export default router;
