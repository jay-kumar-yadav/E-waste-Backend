import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { generateToken } from '../utils/generateToken.js';
import { asyncHandler } from '../middleware/errorHandler.js';


export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      googleLogin: false
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAuthenticated: true
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error; // Let asyncHandler catch it
  }
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAuthenticated: true
    }
  });
});


export const googleAuth = asyncHandler(async (req, res) => {
  const { name, email, googleId } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name and email'
    });
  }

  // Check if user exists
  let user = await User.findOne({ email });

  if (user) {
    // Update google login info if not set
    if (!user.googleLogin) {
      user.googleLogin = true;
      user.googleId = googleId;
      await user.save();
    }
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      googleLogin: true,
      googleId: googleId || email
    });
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Google authentication successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      googleLogin: user.googleLogin,
      isAuthenticated: true
    }
  });
});


export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  res.status(200).json({
    success: true,
    user
  });
});


export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, adminKey } = req.body;

  // Validation
  if (!name || !email || !password || !adminKey) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Check admin secret key
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Invalid admin secret key'
    });
  }

  // Check if admin exists
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    return res.status(400).json({
      success: false,
      message: 'Admin already exists'
    });
  }

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
    isAdmin: true
  });

  if (admin) {
    const token = generateToken(admin._id);
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true,
        isAuthenticated: true
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid admin data'
    });
  }
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Check for admin
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const token = generateToken(admin._id);

  res.status(200).json({
    success: true,
    message: 'Admin login successful',
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      isAdmin: true,
      isAuthenticated: true
    }
  });
});

export const getAdminMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select('-password');

  res.status(200).json({
    success: true,
    admin
  });
});
