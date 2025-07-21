// controllers/commentController.js
const { Comment, Event } = require('../models');

exports.createComment = async (req, res, next) => {
    try {
        const { eventId, content, parentId } = req.body;
        const userId = req.session.userId;

        const eventExists = await Event.findByPk(eventId);
        if (!eventExists) {
            req.flash('error', 'Izoh qoldirish uchun tadbir topilmadi.');
            return res.redirect('back');
        }

        await Comment.create({
            eventId,
            userId,
            content,
            parentId: parentId || null
        });

        req.flash('success', 'Izohingiz muvaffaqiyatli qo\'shildi.');
        res.redirect(`/events/${eventId}`);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            req.flash('error', error.errors.map(e => e.message));
            // xatolik bo'lsa, o'sha tadbir sahifasiga qaytaramiz
            return res.redirect(`/events/${req.body.eventId}`);
        }
        next(error);
    }
};

exports.updateComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) return next();

        if (comment.userId !== req.session.userId) {
            req.flash('error', 'Sizda bu izohni tahrirlash uchun ruxsat yo\'q.');
            return res.status(403).redirect('back');
        }

        await comment.update({ content: req.body.content });

        req.flash('success', 'Izoh muvaffaqiyatli tahrirlandi.');
        res.redirect(`/events/${comment.eventId}`);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            req.flash('error', error.errors.map(e => e.message));
            const comment = await Comment.findByPk(req.params.id);
            return res.redirect(`/events/${comment.eventId}`);
        }
        next(error);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            include: { model: Event, as: 'event' }
        });
        if (!comment) return next();

        const isAuthor = comment.userId === req.session.userId;
        const isOrganizer = comment.event.organizerId === req.session.userId;
        const isAdmin = req.session.role === 'admin';
        if (!isAuthor && !isOrganizer && !isAdmin) {
            req.flash('error', 'Sizda bu izohni o\'chirish uchun ruxsat yo\'q.');
            return res.status(403).redirect('back');
        }

        const eventId = comment.eventId;
        await comment.destroy();

        req.flash('success', 'Izoh muvaffaqiyatli o\'chirildi.');
        res.redirect(`/events/${eventId}`);
    } catch (error) {
        next(error);
    }
};