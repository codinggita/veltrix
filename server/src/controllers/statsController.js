const mongoose = require('mongoose');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get dashboard stats
// @route   GET /api/v1/stats/dashboard
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // Aggregate needs explicit ObjectId casting if userId is a string
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const clientQuery = { userId: userObjectId };
  const userQuery = { user: userObjectId };

  const totalClients = await Client.countDocuments(clientQuery);
  const totalInvoices = await Invoice.countDocuments(userQuery);
  
  // Real aggregation for revenue
  const revenueStats = await Invoice.aggregate([
    { $match: userQuery },
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

  // Trend Data for Cash Flow Analytics (Last 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // Go back 6 full months

  const revenueTrend = await Invoice.aggregate([
    { 
      $match: { 
        ...userQuery,
        status: 'paid',
        issueDate: { $gte: sixMonthsAgo } 
      } 
    },
    {
      $group: {
        _id: { 
          month: { $month: '$issueDate' }, 
          year: { $year: '$issueDate' } 
        },
        income: { $sum: { $ifNull: ['$total', 0] } }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const expenseTrend = await Expense.aggregate([
    { 
      $match: { 
        ...userQuery,
        date: { $gte: sixMonthsAgo } 
      } 
    },
    {
      $group: {
        _id: { 
          month: { $month: '$date' }, 
          year: { $year: '$date' } 
        },
        expenses: { $sum: { $ifNull: ['$amount', 0] } }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const recentClients = await Client.find(clientQuery)
    .sort('-createdAt')
    .limit(5)
    .lean();

  const recentInvoices = await Invoice.find(userQuery)
    .populate('client', 'name')
    .sort('-createdAt')
    .limit(20)
    .lean();

  const pipelineCounts = await Invoice.aggregate([
    { $match: { ...userQuery } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const pipeline = { pending: 0, overdue: 0, paid: 0 };
  pipelineCounts.forEach(p => {
    if (p._id === 'sent') pipeline.pending = p.count;
    if (p._id === 'overdue') pipeline.overdue = p.count;
    if (p._id === 'paid') pipeline.paid = p.count;
  });

  return res.status(200).json(
    new ApiResponse(200, {
      totalClients,
      totalInvoices,
      totalRevenue,
      pendingAmount,
      recentClients,
      recentInvoices,
      recentActivity: recentInvoices,
      pipeline,
      cashFlowData: {
        revenue: revenueTrend,
        expenses: expenseTrend
      }
    }, "Dashboard stats fetched successfully")
  );
});
