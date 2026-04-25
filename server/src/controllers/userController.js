const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.businessName = req.body.businessName || user.businessName;
      user.registrationNumber = req.body.registrationNumber || user.registrationNumber;
      user.taxId = req.body.taxId || user.taxId;
      user.logoUrl = req.body.logoUrl || user.logoUrl;
      
      if (req.body.address) {
        user.address = {
          ...(user.address || {}),
          ...req.body.address
        };
      }

      if (req.body.notifications) {
        user.notifications = {
          ...(user.notifications || {}),
          ...req.body.notifications
        };
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          businessName: updatedUser.businessName,
          registrationNumber: updatedUser.registrationNumber,
          taxId: updatedUser.taxId,
          logoUrl: updatedUser.logoUrl,
          address: updatedUser.address,
          notifications: updatedUser.notifications,
          createdAt: updatedUser.createdAt,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid current password' });
    }

    // Hash and set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
