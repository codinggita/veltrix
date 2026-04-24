const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

exports.getFinancialInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 1. Revenue vs Expenses Trend (Last 6 Months)
    const revenueTrend = await Invoice.aggregate([
      { $match: { user: userId, status: 'paid', issueDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$issueDate' }, year: { $year: '$issueDate' } },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const expenseTrend = await Expense.aggregate([
      { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
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
      { $match: { user: userId, status: 'paid' } },
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
    const sixtyDaysAgo = new Date(today); sixtyDaysAgo.setDate(today.getDate() - 60);

    const arAging = await Invoice.aggregate([
      { $match: { user: userId, status: { $in: ['sent', 'overdue'] } } },
      {
        $project: {
          total: 1,
          ageGroup: {
            $cond: [
              { $gte: ['$issueDate', thirtyDaysAgo] }, 'Current',
              { $cond: [{ $gte: ['$issueDate', sixtyDaysAgo] }, '1-30 Days', '> 60 Days'] }
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

    res.status(200).json({
      success: true,
      data: {
        revenueTrend,
        expenseTrend,
        clientConcentration,
        arAging
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGrowthVelocity = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthRevenue = await Invoice.aggregate([
      { $match: { user: userId, status: 'paid', issueDate: { $gte: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const lastMonthRevenue = await Invoice.aggregate([
      { $match: { user: userId, status: 'paid', issueDate: { $gte: startOfLastMonth, $lt: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const currentTotal = currentMonthRevenue[0]?.total || 0;
    const lastTotal = lastMonthRevenue[0]?.total || 0;
    
    // Growth %
    const growth = lastTotal === 0 ? (currentTotal > 0 ? 100 : 0) : ((currentTotal - lastTotal) / lastTotal) * 100;

    res.status(200).json({
      success: true,
      data: {
        currentMonthMRR: currentTotal,
        lastMonthMRR: lastTotal,
        growthPercentage: growth.toFixed(1)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
