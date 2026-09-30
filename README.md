# 🏥 Medisoil — Hospital Management System

Medisoil is a modern **Hospital Management System** designed to simplify hospital operations and provide separate dashboards for **Patients, Doctors, and Administrators**.

The application provides role-based access, authentication, appointment and healthcare-related services, and a structured interface for managing hospital activities.

---

## 🚀 Live Project

🔗 **Live Demo:** Add your deployed frontend URL here

🔗 **Backend API:** Add your deployed backend URL here

---

## 📌 About the Project

Medisoil is a full-stack web application developed to provide a centralized platform for managing hospital-related activities.

The system supports different types of users and provides role-specific access to features and dashboards.

### 👥 User Roles

* 👨‍⚕️ **Doctor**
* 👨‍💼 **Administrator**
* 🧑‍💻 **Patient**

Each role has access to different sections according to their responsibilities.

---

## ✨ Features

### 🔐 Authentication & Authorization

* User authentication
* Secure login and signup
* JWT-based authentication
* Clerk authentication integration
* Role-based access control
* Protected routes
* Separate dashboards for different user roles

### 👨‍⚕️ Doctor Panel

Doctors can access their dedicated dashboard and manage relevant healthcare activities.

Features include:

* Doctor dashboard
* Patient-related information
* Healthcare service information
* Role-based access

### 👨‍💼 Admin Panel

Administrators have access to management-related functionality.

Features include:

* Admin dashboard
* Hospital management
* User management
* Role-based access
* Protected administrative routes

### 🧑‍💻 Patient Panel

Patients can access their personal dashboard and available healthcare services.

Features include:

* Patient dashboard
* Healthcare services
* Medical information
* Role-based navigation

---

## 🏥 Healthcare Services

The application includes multiple healthcare services, including:

* 🩸 Blood Pressure
* 🍬 Blood Sugar
* 🧪 Full Blood Count
* 🩻 X-Ray

The project also includes **NABH certification information from C1 to C7**.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* React Router
* Tailwind CSS
* Vite
* Lucide React
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* MongoDB Atlas
* REST APIs

### Authentication

* Clerk
* JWT

### Architecture

* MVC Architecture
* RESTful API Architecture
* Role-Based Access Control

### Tools

* Git
* GitHub
* VS Code
* Postman

---

## 📂 Project Structure

```text
medisoil/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── index.js
│   └── package.json
│
└── README.md
```

> Folder names may vary depending on the current project implementation.

---

## 🔑 Role-Based Routing

One of the important parts of this project is implementing **role-based routing**.

The application separates routes based on the user's role:

```text
User
 │
 ├── Patient
 │     └── Patient Dashboard
 │
 ├── Doctor
 │     └── Doctor Dashboard
 │
 └── Admin
       └── Admin Dashboard
```

Protected and nested routes are used to prevent unauthorized users from accessing restricted sections.

---

## 🔒 Authentication Flow

The application uses authentication and authorization mechanisms to protect user data and application routes.

Basic flow:

```text
User
  ↓
Login / Signup
  ↓
Authentication
  ↓
User Role Verification
  ↓
Protected Route
  ↓
Role-Specific Dashboard
```

---

## 🗄️ Database

The project uses **MongoDB** as the primary database.

For production/development environments, the project can be connected to **MongoDB Atlas**.

Example environment variable:

```env
MONGO_URI=your_mongodb_connection_string
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

If Clerk is being used, add the required Clerk environment variables according to your Clerk configuration.

```env
CLERK_SECRET_KEY=your_clerk_secret_key
```

> Never commit your `.env` file or secret keys to GitHub.

---

## 💻 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medisoil.git
```

### 2. Navigate to the Project

```bash
cd medisoil
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Start Frontend

```bash
npm run dev
```

The frontend will run on the Vite development server.

---

### 5. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 6. Configure Environment Variables

Create a `.env` file and add your MongoDB, JWT, and authentication credentials.

### 7. Start Backend

```bash
node index.js
```

The backend server runs on:

```text
http://localhost:4000
```

---

## 🔗 API

The backend exposes REST APIs that are consumed by the frontend application.

Example local API base URL:

```text
http://localhost:4000
```

You can test the APIs using tools such as **Postman**.

---

## 📱 Responsive Design

The application is designed with responsive UI principles so that the interface can adapt to different screen sizes.

The frontend uses **Tailwind CSS** for responsive styling and component design.

---

## 🧠 Key Challenges & Learnings

### 1. Role-Based Routing

One of the challenging parts of the project was implementing different routes for **Admin, Doctor, and Patient** users.

I worked with parent routes and nested routes to organize role-specific pages and protect restricted sections.

### 2. Authentication & Authorization

Managing authentication and ensuring users could only access the appropriate dashboard required implementing protected routes and role-based authorization.

### 3. Frontend–Backend Integration

The project helped me understand how a React frontend communicates with a Node.js/Express backend through REST APIs.

### 4. Database Integration

Working with MongoDB and MongoDB Atlas provided practical experience with storing and retrieving application data.

---

## 🎯 Project Goals

The main goals of Medisoil are:

* Simplify hospital management
* Provide role-specific dashboards
* Secure user access
* Organize healthcare services
* Connect frontend and backend through REST APIs
* Provide a scalable application structure

---

## 🔮 Future Improvements

Some features that can be added in future versions:

* Online appointment booking
* Doctor availability management
* Prescription management
* Online payment integration
* Medical report uploads
* Email/SMS notifications
* Advanced admin analytics
* Patient medical history
* Appointment reminders

---

## 📸 Screenshots

### Home Page

*Add screenshot here*

### Patient Dashboard

*Add screenshot here*

### Doctor Dashboard

*Add screenshot here*

### Admin Dashboard

*Add screenshot here*

---

## 🤝 Contributing

Contributions are welcome.

If you want to contribute:

```bash
# Fork the repository

# Create a new branch
git checkout -b feature/new-feature

# Commit your changes
git commit -m "Add new feature"

# Push the branch
git push origin feature/new-feature
```

Then create a Pull Request.

---

## 📄 License

This project is created for **learning and portfolio purposes**.

---

## 👨‍💻 Developer

**Aditya**

Frontend / MERN Stack Developer

Skills:

`React.js` · `JavaScript` · `Node.js` · `Express.js` · `MongoDB` · `Tailwind CSS` · `Git` · `REST API`

---

⭐ If you found this project useful, consider giving the repository a **star**.
