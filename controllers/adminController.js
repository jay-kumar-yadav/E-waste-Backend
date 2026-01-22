import CollectionPoint from '../models/CollectionPoint.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getAllCollectionPoints = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  
  // Build query
  const query = {};
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
      { wasteType: { $regex: search, $options: 'i' } }
    ];
  }

  const collectionPoints = await CollectionPoint.find(query)
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  // Statistics
  const stats = {
    total: await CollectionPoint.countDocuments(),
    pending: await CollectionPoint.countDocuments({ status: 'pending' }),
    approved: await CollectionPoint.countDocuments({ status: 'approved' }),
    rejected: await CollectionPoint.countDocuments({ status: 'rejected' })
  };

  res.status(200).json({
    success: true,
    count: collectionPoints.length,
    stats,
    data: collectionPoints
  });
});

export const getCollectionPointAdmin = asyncHandler(async (req, res) => {
  const collectionPoint = await CollectionPoint.findById(req.params.id)
    .populate('userId', 'name email');

  if (!collectionPoint) {
    return res.status(404).json({
      success: false,
      message: 'Collection point not found'
    });
  }

  res.status(200).json({
    success: true,
    data: collectionPoint
  });
});


export const updateCollectionPointStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be pending, approved, or rejected'
    });
  }

  const collectionPoint = await CollectionPoint.findById(req.params.id);

  if (!collectionPoint) {
    return res.status(404).json({
      success: false,
      message: 'Collection point not found'
    });
  }

  collectionPoint.status = status;
  await collectionPoint.save();

  res.status(200).json({
    success: true,
    message: `Collection point ${status} successfully`,
    data: collectionPoint
  });
});


export const deleteCollectionPointAdmin = asyncHandler(async (req, res) => {
  const collectionPoint = await CollectionPoint.findById(req.params.id);

  if (!collectionPoint) {
    return res.status(404).json({
      success: false,
      message: 'Collection point not found'
    });
  }

  await collectionPoint.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Collection point deleted successfully',
    data: {}
  });
});


export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCollectionPoints,
    pendingPoints,
    approvedPoints,
    rejectedPoints,
    collectionPointsByType,
    collectionPointsByCondition
  ] = await Promise.all([
    User.countDocuments(),
    CollectionPoint.countDocuments(),
    CollectionPoint.countDocuments({ status: 'pending' }),
    CollectionPoint.countDocuments({ status: 'approved' }),
    CollectionPoint.countDocuments({ status: 'rejected' }),
    CollectionPoint.aggregate([
      {
        $group: {
          _id: '$wasteType',
          count: { $sum: 1 }
        }
      }
    ]),
    CollectionPoint.aggregate([
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalCollectionPoints,
      pendingPoints,
      approvedPoints,
      rejectedPoints,
      collectionPointsByType,
      collectionPointsByCondition
    }
  });
});


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});
