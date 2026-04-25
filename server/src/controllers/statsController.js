const mongoose = require('mongoose');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get dashboard stats
// @route   GET /api/v1/stats/dashboard
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // Aggregate needs explicit ObjectId casting if userId is a string
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Fix: Supporting both user and userId fields for backward compatibility
  const userQuery = { $or: [{ user: userObjectId }, { userId: userObjectId }] };
  const clientQuery = { $or: [{ user: userObjectId }, { userId: userObjectId }] };

  const totalClients = await Client.countDocuments(clientQuery);
  const totalInvoices = await Invoice.countDocuments(userQuery);
  
  // Real aggregation for revenue
  const revenueStats = await Invoice.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }] } },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$total", 0] }
        },
        pendingAmount: {
          $sum: { $cond: [{ $in: ["$status", ["sent", "overdue"]] }, "$total", 0] }
        }
      }
    }
  ]);

  const totalRevenue = revenueStats[0]?.totalRevenue || 0;
  const pendingAmount = revenueStats[0]?.pendingAmount || 0;

  const recentClients = await Client.find(clientQuery)
    .sort('-createdAt')
    .limit(5)
    .lean();

  const recentInvoices = await Invoice.find(userQuery)
    .populate('client', 'name')
    .sort('-createdAt')
    .limit(5)
    .lean();

  return res.status(200).json(
    new ApiResponse(200, {
      totalClients,
      totalInvoices,
      totalRevenue,
      pendingAmount,
      recentClients,
      recentInvoices,
      recentActivity: recentInvoices,
    }, "Dashboard stats fetched successfully")
  );
});
