// middleware/auth.js

const { User } = require('../models'); 


const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Bu sahifaga kirish uchun avval tizimga kirishingiz kerak.');
  res.redirect('/login');
};


const isGuest = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return next();
  }
  res.redirect('/profile');
};

const isOrganizer = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (user && (user.role === 'organizer' || user.role === 'admin')) {
      return next();
    }
    req.flash('error', 'Sizda bu amalni bajarish uchun ruxsat yo\'q.');
    res.status(403).redirect('back'); // 403 - Forbidden (Taqiqlangan)
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (user && user.role === 'admin') {
      return next();
    }
    req.flash('error', 'Faqat administratorlar bu amalni bajara oladi.');
    res.status(403).redirect('back');
  } catch (error) {
    next(error);
  }
};


module.exports = {
  isAuthenticated,
  isGuest,
  isOrganizer,
  isAdmin
};