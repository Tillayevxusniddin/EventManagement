// controllers/authController.js
const { User, Profile, sequelize } = require('../models');
const bcrypt = require('bcrypt');

exports.showRegisterForm = (req, res) => {
    res.render('auth/register', {
        title: 'Ro\'yxatdan o\'tish',
        old_input: req.flash('old_input')[0] || {},
    });
};

exports.registerUser = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { username, email, password, firstName, lastName, address, phone } = req.body;
        const user = await User.create({ username, email, password, role: 'attendee' }, { transaction: t });

        await Profile.create({ userId: user.id, firstName, lastName, address, phone }, { transaction: t });
        
        await t.commit();

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        
        req.flash('success', `Xush kelibsiz, ${user.username}! Muvaffaqiyatli ro'yxatdan o'tdingiz.`);
        res.redirect('/profile');

    } catch (error) {
        await t.rollback();
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const messages = error.errors.map(e => e.message);
            req.flash('error', messages);
            req.flash('old_input', req.body);
            return res.redirect('/register');
        }
        next(error);
    }
};


exports.showLoginForm = (req, res) => {
    res.render('auth/login', {
        title: 'Tizimga kirish',
        old_input: req.flash('old_input')[0] || {},
    });
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.checkPassword(password))) {
            req.flash('error', 'Email yoki parol noto\'g\'ri kiritildi.');
            req.flash('old_input', req.body);
            return res.redirect('/login');
        }

        if (!user.isActive) {
            req.flash('error', 'Ushbu akkaunt faol holatda emas. Iltimos, administrator bilan bog\'laning.');
            return res.redirect('/login');
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        req.flash('success', `Xush kelibsiz, ${user.username}!`);
        res.redirect('/events');
    } catch (error) {
        next(error);
    }
};

exports.logoutUser = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};