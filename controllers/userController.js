// controllers/userController.js
const { User, Profile, Event } = require('../models');

exports.showCurrentUserProfile = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const user = await User.findByPk(userId, {
            include: [
                { model: Profile, as: 'profile' },
                { model: Event, as: 'organizedEvents' },
                { model: Event, as: 'registeredEvents' } 
            ]
        });

        if (!user) {
            req.flash('error', 'Foydalanuvchi topilmadi.');
            return res.redirect('/events');
        }

        res.render('profile/show', {
            title: `${user.username} Profili`,
            userProfile: user, 
            isOwnProfile: true 
        });

    } catch (error) {
        next(error);
    }
};

exports.showUserProfile = async (req, res, next) => {
    try {
        if (req.session.userId === req.params.id) {
            return res.redirect('/profile');
        }

        const user = await User.findByPk(req.params.id, {
            include: [
                { model: Profile, as: 'profile' },
                { model: Event, as: 'organizedEvents', where: { status: 'published' }, required: false }
            ]
        });

        if (!user) {
            return next();
        }

        const isOwnProfile = req.session.userId === req.params.id;

        res.render('profile/show', {
            title: `${user.username} Profili`,
            userProfile: user,
            isOwnProfile: isOwnProfile
        });

    } catch (error) {
        next(error);
    }
};

exports.showEditProfileForm = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.session.userId, {
            include: { model: Profile, as: 'profile' }
        });

        if (!user || !user.profile) {
            req.flash('error', 'Tahrirlash uchun profil topilmadi.');
            return res.redirect('/profile');
        }

        res.render('profile/edit', {
            title: 'Profilni Tahrirlash',
            profile: user.profile,
            old_input: req.flash('old_input')[0] || {},
        });

    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, address, phone, bio } = req.body;

        const profile = await Profile.findOne({ where: { userId: req.session.userId } });

        if (!profile) {
            req.flash('error', 'Profil topilmadi.');
            return res.redirect('/profile/edit');
        }

        await profile.update({ firstName, lastName, address, phone, bio });
        
        req.flash('success', 'Profilingiz muvaffaqiyatli yangilandi.');
        res.redirect('/profile');

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            req.flash('error', messages);
            req.flash('old_input', req.body);
            return res.redirect('/profile/edit');
        }
        next(error);
    }
};