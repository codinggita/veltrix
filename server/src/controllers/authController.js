const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, businessName } = req.body;

  // Fix 20: Input validation
  if (!name || !email || !password || !businessName) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Basic email format check
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    businessName,
  });

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    createdAt: user.createdAt,
  };

  return res.status(201).json(
    new ApiResponse(201, { user: userData, token: generateToken(user._id) }, "User registered successfully")
  );
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Fix 20: Input validation
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password"); // Better not to reveal if email exists
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    businessName: user.businessName,
    createdAt: user.createdAt,
  };

  return res.status(200).json(
    new ApiResponse(200, { user: userData, token: generateToken(user._id) }, "User logged in successfully")
  );
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  // Fix 5: using req.user._id
  const user = await User.findById(req.user._id).select('-password');
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User data fetched successfully")
  );
});
