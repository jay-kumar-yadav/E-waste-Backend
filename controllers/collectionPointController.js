import CollectionPoint from '../models/CollectionPoint.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateCollectionPoint } from '../utils/validators.js';


export const createCollectionPoint = asyncHandler(async (req, res) => {
  const validation = validateCollectionPoint(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validation.errors
    });
  }

  const collectionPoint = await CollectionPoint.create({
    ...req.body,
    userId: req.user._id,
    userName: req.user.name
  });

  res.status(201).json({
    success: true,
    message: 'Collection point created successfully',
    data: collectionPoint
  });
});


export const getUserCollectionPoints = asyncHandler(async (req, res) => {
  const collectionPoints = await CollectionPoint.find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: collectionPoints.length,
    data: collectionPoints
  });
});


export const getCollectionPoint = asyncHandler(async (req, res) => {
  const collectionPoint = await CollectionPoint.findById(req.params.id);

  if (!collectionPoint) {
    return res.status(404).json({
      success: false,
      message: 'Collection point not found'
    });
  }

  // Check if user owns this collection point
  if (collectionPoint.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this collection point'
    });
  }

  res.status(200).json({
    success: true,
    data: collectionPoint
  });
});


export const updateCollectionPoint = asyncHandler(async (req, res) => {
  let collectionPoint = await CollectionPoint.findById(req.params.id);

  if (!collectionPoint) {
    return res.status(404).json({
      success: false,
      message: 'Collection point not found'
    });
  }

  // Check if user owns this collection point
  if (collectionPoint.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this collection point'
    });
  }

  // Don't allow status updates from user
  const { status, ...updateData } = req.body;

  collectionPoint = await CollectionPoint.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Collection point updated successfully',
    data: collectionPoint
  });
});


export const deleteCollectionPoint = asyncHandler(async (req, res) => {
  const collectionPoint = await CollectionPoint.findById(req.params.id);

  if (!collectionPoint) {
    return res.status(404).json({
      success: false,
      message: 'Collection point not found'
    });
  }

  // Check if user owns this collection point
  if (collectionPoint.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this collection point'
    });
  }

  await collectionPoint.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Collection point deleted successfully',
    data: {}
  });
});
