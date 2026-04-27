const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

exports.getFinancialInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const { period } = req.query;

  let startDate = new Date(0); // Default to All Time
  let endDate = new Date();

  const now = new Date();
  if (period === 'YTD') {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else if (!period || period === 'All Time') {
    // Default 6 months for trend if All Time is too large for UI, 
    // but here we follow All Time logic.
    startDate = new Date(0);
  } else {
    // Default fallback to 6 months trailing
    startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
  }

  const userQuery = { $or: [{ user: userObjectId }, { userId: userObjectId }] };

  // 1. Revenue vs Expenses Trend
  const revenueTrend = await Invoice.aggregate([
    { 
      $match: { 
        ...userQuery, 
        status: 'paid', 
        issueDate: { $gte: startDate, $lte: endDate } 
      } 
    },
    {
      $group: {
        _id: { month: { $month: '$issueDate' }, year: { $year: '$issueDate' } },
        revenue: { $sum: '$total' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const expenseTrend = await Expense.aggregate([
    { 
      $match: { 
        ...userQuery, 
        date: { $gte: startDate, $lte: endDate } 
      } 
    },
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
  
  // Get 6 months of MRR trend
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
  }

  const mrrTrend = await Promise.all(months.map(async (monthStart) => {
    const nextMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    const revenue = await Invoice.aggregate([
      { 
        $match: { 
          user: userObjectId,
          // Removed status: 'paid' to track total momentum/billed amount
          issueDate: { $gte: monthStart, $lt: nextMonth } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    return {
      month: monthStart.toLocaleString('default', { month: 'short' }),
      amount: revenue[0]?.total || 0
    };
  }));

  console.log('Backend MRR Trend:', mrrTrend);

  const currentTotal = mrrTrend[5].amount;
  const lastTotal = mrrTrend[4].amount;
  
  const growth = lastTotal === 0 ? (currentTotal > 0 ? 100 : 0) : ((currentTotal - lastTotal) / lastTotal) * 100;

  return res.status(200).json(
    new ApiResponse(200, {
      currentMonthMRR: currentTotal,
      lastMonthMRR: lastTotal,
      growthPercentage: growth.toFixed(1),
      trend: mrrTrend
    }, "Growth velocity fetched successfully")
  );
});
