// app.js - YAKUNIY, DIAGNOSTIKALI VERSIYA

// 1. ASOSIY IMPORTLAR
const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const flash = require('express-flash');
const methodOverride = require('method-override');
const helmet = require('helmet');
const compression = require('compression');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { sequelize, initAssociations, syncDatabase } = require('./models');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const commentRoutes = require('./routes/comment');


const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await testConnection();
        initAssociations();
        await syncDatabase();

        app.use(expressLayouts);
        app.set('layout', 'layouts/main');
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, 'views'));

        app.use(helmet());
        app.use(compression());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
        app.use(methodOverride('_method'));
        if (process.env.NODE_ENV === 'development') {
            app.use(require('morgan')('dev'));
        }

        app.use(session({
            store: new pgSession({
                conObject: {
                    user: process.env.DB_USERNAME,
                    host: process.env.DB_HOST,
                    database: process.env.DB_NAME,
                    password: process.env.DB_PASSWORD,
                    port: process.env.DB_PORT,
                    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
                },
                tableName: 'user_sessions'
            }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true, 
            cookie: { 
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                secure: false, 
                sameSite: 'lax' 
            }
        }));
        
        app.use(flash());
        app.use((req, res, next) => {
            console.log('SESSION ID:', req.session.userId); 
            res.locals.currentUser = req.session.userId ? { id: req.session.userId, username: req.session.username, role: req.session.role } : null;
            console.log('currentUser o\'zgaruvchisi o\'rnatildi:', res.locals.currentUser);
            res.locals.success_msg = req.flash('success');
            res.locals.error_msg = req.flash('error');
            next();
        });

        app.get('/', (req, res) => res.redirect('/events'));
        app.use('/', authRoutes);
        app.use('/', userRoutes);
        app.use('/events', eventRoutes);
        app.use('/registrations', registrationRoutes);
        app.use('/comments', commentRoutes);

        app.use(notFoundHandler);
        app.use(globalErrorHandler);

        app.listen(PORT, () => {
            console.log(`🚀 Server http://localhost:${PORT} manzilida muvaffaqiyatli ishga tushdi.`);
        });

    } catch (error) {
        console.error("❌ Serverni ishga tushirishda jiddiy xatolik yuz berdi:", error);
        process.exit(1);
    }
}

startServer();