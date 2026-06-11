# 🏨 CampusCare — Enterprise Hostel Complaint Management System

CampusCare is a **production-grade MERN stack Hostel Complaint Management System** built to simplify and digitize hostel complaint management through **secure authentication, role-based access control, realtime updates, and cloud-based media handling**.

Designed with an **enterprise-style architecture**, CampusCare provides separate dashboards and functionality for **Students, Wardens, and Admins**, making hostel management efficient, transparent, and scalable.

---

## 🚀 Live Demo

🌐 **Frontend (Live App)**
https://campus-care-chi.vercel.app

⚙️ **Backend API**
https://campuscare-api.onrender.com

---

## ✨ Features

### 🔐 Authentication & Security

* JWT Authentication
* Protected Routes
* Secure Login & Signup
* Persistent User Sessions
* Role-Based Authorization

---

### 👥 Multi-Role Access System

#### 👨‍🎓 Student Features

* Student Signup/Login
* Create Hostel Complaints
* Upload Complaint Images
* Track Complaint Status
* Realtime Complaint Updates
* Chat with Warden
* Profile Management

#### 🧑‍💼 Warden Features

* Warden Login
* View Assigned Complaints
* Manage Complaint Status
* Realtime Complaint Updates
* Student Communication System

#### 👨‍💻 Admin Features

* Admin Dashboard
* User Management
* Complaint Monitoring
* Role-Based Administrative Control

---

## ⚡ Realtime Features

* Realtime Complaint Updates using **Socket.IO**
* Live Chat System
* Instant Complaint Status Updates
* Unread Message Indicators

---

## 🖼️ Media Handling

* Complaint Image Upload
* Profile Picture Upload
* Cloudinary Cloud Storage
* Persistent Media Rendering

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JWT (JSON Web Token)

### Realtime Communication

* Socket.IO

### Cloud Storage

* Cloudinary

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas


## 🔥 Key Highlights

✅ Production-Grade MERN Application
✅ Enterprise-Style Architecture
✅ JWT-Based Authentication
✅ Role-Based Access Control
✅ Socket.IO Realtime Features
✅ MongoDB Atlas Cloud Database
✅ Cloudinary Media Uploads
✅ Fully Deployed in Production
✅ Responsive UI Design

---

## 🛠️ Local Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone YOUR_GITHUB_REPO_URL
cd CampusCare
```

---

### 2️⃣ Backend Setup

Go to backend folder:

```bash
cd api
npm install
```

Create `.env` file inside `api/`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run backend server:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

Go to frontend folder:

```bash
cd client
npm install
```

Create `.env` file inside `client/`

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

---

## 🌍 Deployment

### Frontend

Deployed using **Vercel**

### Backend

Deployed using **Render**

### Database

Hosted on **MongoDB Atlas**

### Media Storage

Managed through **Cloudinary**

---

## 📸 Screenshots

### 🔐 Login Page


### 👨‍🎓 Student Dashboard


### 🧑‍💼 Warden Dashboard



### 👨‍💻 Admin Dashboard



### 📝 Complaint Management



---



## 👨‍💻 Author

**Akula Abhyas**





⭐ If you liked this project, consider giving it a star on GitHub!

