
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(err => err.msg));
    req.flash('old_input', req.body);
    return res.status(422).redirect('back');
  }
  next();
};

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('Foydalanuvchi nomi 3 dan 50 gacha belgi bo\'lishi kerak.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Foydalanuvchi nomi faqat harflar, raqamlar va pastki chiziqdan iborat bo\'lishi mumkin.'),

  body('email')
    .isEmail().withMessage('Iltimos, yaroqli elektron pochta manzilini kiriting.')
    .normalizeEmail(), 
  body('password')
    .isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgidan iborat bo\'lishi kerak.'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Parollar bir-biriga mos kelmadi. Iltimos, qayta urinib ko\'ring.');
      }
      return true;
    }),
  handleValidationErrors
];

const validateEvent = [
  body('name')
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Tadbir nomi 5 dan 200 gacha belgi bo\'lishi kerak.'),

  body('date')
    .isISO8601().withMessage('Iltimos, yaroqli sana va vaqtni kiriting.').toDate(),

  body('location')
    .trim()
    .isLength({ min: 5, max: 500 }).withMessage('Joylashuv 5 dan 500 gacha belgi bo\'lishi kerak.'),

  body('maxAttendees')
    .optional({ values: 'falsy' }) 
    .isInt({ min: 1 }).withMessage('Ishtirokchilar soni musbat butun son bo\'lishi kerak.'),

  body('price')
    .optional({ values: 'falsy' })
    .isDecimal({ decimal_digits: '0,2' }).withMessage('Narx yaroqli formatda bo\'lishi kerak (masalan, 50000.00).')
    .toFloat(),

  handleValidationErrors
];

const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Izoh matni bo\'sh bo\'lishi mumkin emas.')
    .isLength({ max: 2000 }).withMessage('Izoh 2000 belgidan oshmasligi kerak.'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateEvent,
  validateComment,
};