const HeritageSite = require('../models/HeritageSite');
const User = require('../models/User');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalSites,
      activeSites,
      pendingSites,
      rejectedSites,
      totalUsers,
      totalContributors,
    ] = await Promise.all([
      HeritageSite.countDocuments(),
      HeritageSite.countDocuments({ status: 'active' }),
      HeritageSite.countDocuments({ status: 'pending' }),
      HeritageSite.countDocuments({ status: 'rejected' }),
      User.countDocuments(),
      HeritageSite.distinct('contributedBy').then(ids => ids.length),
    ]);

    // Recent sites
    const recentSites = await HeritageSite.find()
      .populate('contributedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Category breakdown
    const categoryBreakdown = await HeritageSite.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalSites,
        activeSites,
        pendingSites,
        rejectedSites,
        totalUsers,
        totalContributors,
        recentSites,
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'contributor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk approve heritage sites
// @route   POST /api/admin/sites/bulk-approve
// @access  Private/Admin
exports.bulkApproveSites = async (req, res, next) => {
  try {
    const { siteIds } = req.body;

    if (!Array.isArray(siteIds) || siteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid site IDs'
      });
    }

    const result = await HeritageSite.updateMany(
      { _id: { $in: siteIds } },
      {
        status: 'active',
        verified: true,
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} sites approved successfully`,
      data: { modified: result.modifiedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk reject heritage sites
// @route   POST /api/admin/sites/bulk-reject
// @access  Private/Admin
exports.bulkRejectSites = async (req, res, next) => {
  try {
    const { siteIds } = req.body;

    if (!Array.isArray(siteIds) || siteIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid site IDs'
      });
    }

    const result = await HeritageSite.updateMany(
      { _id: { $in: siteIds } },
      {
        status: 'rejected',
        verified: false
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} sites rejected`,
      data: { modified: result.modifiedCount }
    });
  } catch (error) {
    next(error);
  }
};
