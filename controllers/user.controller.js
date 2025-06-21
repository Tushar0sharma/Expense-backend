import User from '../models/user.models.js'

// controllers/user.controller.js
export const updateuser = async (req, res) => {
  try {
    const { name,userid } = req.body;
    const image = req.file?.path; 
    
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name;
    if (image) user.profilepic = image;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error('updateuser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
