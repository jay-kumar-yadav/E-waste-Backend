import mongoose from 'mongoose';

const collectionPointSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  latitude: {
    type: String,
    required: [true, 'Latitude is required']
  },
  longitude: {
    type: String,
    required: [true, 'Longitude is required']
  },
  wasteType: {
    type: String,
    required: [true, 'Waste type is required'],
    enum: ['computers', 'smartphones', 'televisions', 'printers', 'gaming', 'batteries', 'appliances', 'other']
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['excellent', 'good', 'fair', 'poor', 'broken']
  },
  yearsOfUse: {
    type: Number,
    required: [true, 'Years of use is required'],
    min: 0,
    max: 50
  },
  optional: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const CollectionPoint = mongoose.model('CollectionPoint', collectionPointSchema);

export default CollectionPoint;
