const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get dashboard stats
// @route   GET /api/v1/stats/dashboard
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fix 1: using correct fields for Client (userId) and Invoice (user)
  const totalClients = await Client.countDocuments({ userId });
  const totalInvoices = await Invoice.countDocuments({ user: userId });
  
  // Real aggregation for revenue
  const revenueStats = await Invoice.aggregate([
    { $match: { user: userId } },
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

  const recentClients = await Client.find({ userId })
    .sort('-createdAt')
    .limit(5)
    .lean();

  const recentInvoices = await Invoice.find({ user: userId })
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
      recentActivity: recentInvoices, // Prefer recent invoices for activity
    }, "Dashboard stats fetched successfully")
  );
});
