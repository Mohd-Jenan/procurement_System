const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const userValidation=require("../validations/userValidation")


const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};


exports.createUser = async (req, res) => {
  try {
    const {error}= userValidation.validate(req.body)
    if(error){
      return res.status(400).json({message:error.message})
    }
    const { name, email, mobile, password, role, assignedTo } = req.body;

    const creator = req.user;
    if (!creator) return res.status(403).json({ message: 'Unauthorized' });

    if (creator.role === 'admin') {
      if (!['procurement_manager', 'inspection_manager', 'client'].includes(role))
        return res.status(400).json({ message: 'Admin can create only procurement_manager, inspection_manager, or client' });
    }
    else if (creator.role === 'procurement_manager') {
      if (!['inspection_manager', 'client'].includes(role))
        return res.status(400).json({ message: 'Procurement manager can create only inspection_manager or client' });
    }
    else {
      return res.status(403).json({ message: 'Only admin or procurement manager can register users' });
    }

    let existingUser = null;
    if (email) {
      existingUser = await User.findOne({ email });
      if(existingUser){
         return res.status(400).json({message:"Email already exist"})
      }
    }
    if (!existingUser && mobile) {
      existingUser = await User.findOne({ mobile });
      if(existingUser){
      return res.status(400).json({message:"mobile number is already used"})
      }
    }
    
    let assignedToFinal = null;

    if (role === 'inspection_manager') {
      if (creator.role === 'procurement_manager') {
        assignedToFinal = creator.id;
      } else {
        assignedToFinal = assignedTo || null;
      }
    }
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;
    const user = new User({
      id: newId,
      name,
      email,
      mobile,
      password,
      role,
      createdBy: creator.id,
      assignedTo: assignedToFinal
    });

    await user.save();

    res.status(201).json({
      message: `${role} created successfully`,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        createdBy: user.createdBy,
        assignedTo: user.assignedTo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    if (!email && !mobile) {
      return res.status(400).json({ message: 'Email or mobile is required' });
    }
   
    let user;
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email address' });
      }
    } else if (mobile) {
      user = await User.findOne({ mobile });
      if (!user) {
        return res.status(400).json({ message: 'Invalid mobile number' });
      }
    }
    if (['admin', 'client', 'procurement_manager'].includes(user.role) && !email) {
      return res.status(400).json({ message: 'This role requires email login' });
    }
    if (user.role === 'inspection_manager' && !mobile) {
      return res.status(400).json({ message: 'Inspection Manager must login using mobile number' });
    }

    if (user.password !== password)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getInspectionManagers = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === 'admin') {
      const all = await User.find({ role: 'inspection_manager' });
      return res.json(all);
    }

    if (user.role === 'procurement_manager') {
      const ims = await User.find({
        role: 'inspection_manager',
        assignedTo: user.id
      });
      return res.json(ims);
    }

    return res.status(403).json({ message: 'Unauthorized access' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};





