

<div align="center">
  <h1>📅 Event Management System</h1>
  <p>A full-stack event management platform built with Node.js and Express.js, allowing users to create, register for, and discuss events.</p>

  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![EJS](https://img.shields.io/badge/EJS-FFD500?style=for-the-badge&logo=ejs&logoColor=black)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Sequelize](https://img.shields.io/badge/Sequelize-03AFEF?style=for-the-badge&logo=sequelize&logoColor=white)
  ![Multer](https://img.shields.io/badge/Multer-FF9900?style=for-the-badge)
  ![Session](https://img.shields.io/badge/Session-3E8EDE?style=for-the-badge)
  ![MVC](https://img.shields.io/badge/MVC-ModelViewController-blue?style=for-the-badge)
</div>


</div>

## ✨ Key Features
✅ Role-Based Access Control: Separate permissions for Admin, Organizer, and Attendee roles.

✅ Full Event Management (CRUD): Organizers can create, read, update, and delete events.

✅ User Authentication & Profiles: User registration, login, and personal profile management.

✅ Registration System: Users can easily register for events and cancel their registrations.

✅ Discussion Forum: A threaded comment system for each event, allowing for replies.

✅ File Uploads: Upload event images directly from a device instead of using URLs (powered by multer).

✅ Session-Based Authentication: Secure session management using express-session and connect-pg-simple.

✅ Server-Side Rendering (SSR): Dynamic page generation with the EJS template engine.

✅ Secure Configuration: Sensitive credentials are kept separate from the codebase in a .env file.

✅ Robust Architecture: The project is built on the MVC (Model-View-Controller) architectural pattern.

## 🚀 Getting Started
Follow the steps below to set up and run the project in your local environment.

🔧 Prerequisites
Node.js (v16 or higher)

npm (usually installed with Node.js)

PostgreSQL database

Git

## 📦 Clone the Repository
```bash
git clone https://github.com/Tillayevxusniddin/EventManagement.git
cd EventManagement
```


## 🛠️ Environment Setup
Create a copy of the .env.example file and name it .env.

```bash
cp .env.example .env
```

Open the newly created .env file and fill it with your PostgreSQL database credentials. The most important variables are DB_PASSWORD and SESSION_SECRET.

```bash
DB_NAME=event_management
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
SESSION_SECRET=a_very_secret_key_here
```

## 📦 Install Dependencies
Install all the required project dependencies:
```bash
npm install
```

## ▶️ Run the Project
The project runs in development mode using nodemon, which automatically restarts the server after every file change.

```bash
npm run dev
```

Once the server is running, you can open http://localhost:3000 in your browser.

On the first run, sequelize.sync() will automatically create all the necessary tables in your database.

## 👤 Role Management (Admin/Organizer)
Newly registered users are assigned the attendee role by default. To grant organizer or admin privileges:

Open the users table using a database tool like pgAdmin.

Find the desired user and change the value in their role column to 'organizer' or 'admin'.

Log out and log back into the application to see the changes.

## 📂 Project Structure
The codebase is organized into the following directories for clarity and scalability:

config/: Database and environment variable configurations.

controllers/: Contains the core business logic (the "C" in MVC).

middleware/: Handles authentication, validation, error handling, etc.

models/: Defines the database schema using Sequelize models (the "M" in MVC).

public/: Stores static assets like CSS, JavaScript, and images.

routes/: Manages the application's URL endpoints.

views/: Contains the EJS templates for the user interface (the "V" in MVC).

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

<div align="center"> <p>Project Author: <b>Xusniddin Tillayev</b></p> </div>