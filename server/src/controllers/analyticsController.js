const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

exports.getFinancialInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const userQuery = { $or: [{ user: userObjectId }, { userId: userObjectId }] };

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  // 1. Revenue vs Expenses Trend (Last 6 Months)
  const revenueTrend = await Invoice.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }], status: 'paid', issueDate: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$issueDate' }, year: { $year: '$issueDate' } },
        revenue: { $sum: '$total' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const expenseTrend = await Expense.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }], date: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: '$date' }, year: { $year: '$date' } },
        expenses: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // 2. Client Concentration (Top 5)
  const clientConcentration = await Invoice.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }], status: 'paid' } },
    {
      $group: {
        _id: '$client',
        totalRevenue: { $sum: '$total' }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'clients',
        localField: '_id',
        foreignField: '_id',
        as: 'clientDetails'
      }
    },
    { $unwind: '$clientDetails' },
    {
      $project: {
        name: '$clientDetails.name',
        totalRevenue: 1
      }
    }
  ]);

  // 3. A/R Aging (Unpaid Invoices)
  const today = new Date();
  const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(today.getDate() - 30);

  const arAging = await Invoice.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }], status: { $in: ['sent', 'overdue'] } } },
    {
      $project: {
        total: 1,
        ageGroup: {
          $cond: [
            { $gte: ['$dueDate', today] }, 'Current',
            { $cond: [{ $gte: ['$dueDate', thirtyDaysAgo] }, '1-30 Days', '> 30 Days'] }
          ]
        }
      }
    },
    {
      $group: {
        _id: '$ageGroup',
        amount: { $sum: '$total' }
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      revenueTrend,
      expenseTrend,
      clientConcentration,
      arAging
    }, "Financial insights fetched successfully")
  );
});

exports.getGrowthVelocity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthRevenue = await Invoice.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }], status: 'paid', issueDate: { $gte: startOfCurrentMonth } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  const lastMonthRevenue = await Invoice.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }], status: 'paid', issueDate: { $gte: startOfLastMonth, $lt: startOfCurrentMonth } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  const currentTotal = currentMonthRevenue[0]?.total || 0;
  const lastTotal = lastMonthRevenue[0]?.total || 0;
  
  const growth = lastTotal === 0 ? (currentTotal > 0 ? 100 : 0) : ((currentTotal - lastTotal) / lastTotal) * 100;

  return res.status(200).json(
    new ApiResponse(200, {
      currentMonthMRR: currentTotal,
      lastMonthMRR: lastTotal,
      growthPercentage: growth.toFixed(1)
    }, "Growth velocity fetched successfully")
  );
});
