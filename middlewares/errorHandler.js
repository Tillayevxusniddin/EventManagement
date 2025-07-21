// middleware/errorHandler.js

const notFoundHandler = (req, res, next) => {
  const error = new Error(`So'ralgan sahifa topilmadi: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error(`[XATOLIK] Status: ${statusCode} | Xabar: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.render('error', {
    title: `Xatolik: ${statusCode}`,
    message: statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Serverda kutilmagan ichki xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.'
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    layout: 'layouts/main'
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};