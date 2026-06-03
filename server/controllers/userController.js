import User from '../models/User.js'

//getProfile
export const getProfile = async (req, res, next) => {
  try {
    res.json(req.user)
  } catch (error) {
    next(error)
  }
}

//updateProfile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      }
    )

    res.json(user)
  } catch (error) {
    next(error)
  }
}

//changePassword
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id).select('+password')

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({
        message: 'Current password is wrong',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'new password must be 6 character',
      })
    }

    user.password = newPassword
    await user.save()

    res.json({ message: 'Password changed' })
  } catch (error) {
    next(error)
  }
}

//getAllUsers (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt')

    res.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    next(error)
  }
}

// updateUserRole (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        message: 'Role could only be user or admin',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User Not Found ' })
    }

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

//deleteUser (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        message: 'You cant delete yourself',
      })
    }

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User deleted' })
  } catch (error) {
    next(error)
  }
}

//