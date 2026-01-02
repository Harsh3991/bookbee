# 📖 BookBee

[![Node.js Version](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-green.svg)](https://www.mongodb.com/)

![BookBee Banner](https://via.placeholder.com/800x200/FFD700/000000?text=BookBee+-+Where+Stories+Come+Alive) <!-- Replace with actual banner image -->

> **BookBee** 🐝: A buzzing hub for storytellers! Create, share, and dive into captivating tales, one chapter at a time. Just like bees build hives, writers craft stories collaboratively in our vibrant community.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure signup, login, and JWT-based sessions. |
| ✍️ **Story Creation** | Rich text editor with chapter management and Cloudinary image uploads. |
| 📖 **Immersive Reading** | Track progress, bookmark chapters, and enjoy smooth navigation. |
| ⭐ **Reviews & Ratings** | Rate stories and leave feedback to guide fellow readers. |
| 🔍 **Smart Search** | Discover stories by title, author, genre, or keywords. |
| 📱 **Responsive UI** | Mobile-first design with Tailwind CSS, DaisyUI components, and Framer Motion animations for a delightful experience. |
| 🛡️ **Security & Admin** | Rate limiting, CORS, Helmet protection, and automated cron jobs. |
| 📧 **Email Notifications** | Stay updated with verification and story alerts via Nodemailer. |

### 🎥 Demo Screenshots

| Home Page | Story Editor | Reading View |
|-----------|--------------|--------------|
| ![Home](https://via.placeholder.com/300x200/87CEEB/FFFFFF?text=Home+Page) | ![Editor](https://via.placeholder.com/300x200/98FB98/FFFFFF?text=Story+Editor) | ![Read](https://via.placeholder.com/300x200/FFA07A/FFFFFF?text=Reading+View) |

*Replace placeholders with actual screenshots or GIFs for a more engaging README.*

## 🛠️ Tech Stack

### Backend 🖥️
- **Node.js** & **Express.js** - Robust server framework
- **MongoDB** & **Mongoose** - NoSQL database with ODM
- **JWT** - Secure token-based auth
- **Cloudinary** - Image upload & management
- **Nodemailer** - Email service
- **Cron** - Scheduled tasks
- **Helmet** & **Express Rate Limit** - Security middleware

### Frontend 🌐
- **React** & **Vite** - Fast, modern web app
- **Tailwind CSS** & **DaisyUI** - Utility-first styling with components.
- **Framer Motion** - Smooth animations & transitions
- **React Router** - Client-side routing

## 🚀 Installation

### Prerequisites
- 🟢 Node.js (v14+)
- 🗄️ MongoDB (local or Atlas)
- 📦 npm or yarn

### Backend Setup
```bash
cd backend
npm install
# Copy backend.env to .env and fill in your secrets
npm start  # or nodemon server.js for dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Starts Vite dev server
npm run build  # For production
```

## 📋 Usage

1. **Sign Up/Login** 🔑: Join the hive!
2. **Write Stories** ✍️: Unleash your creativity in the editor.
3. **Read & Explore** 📖: Discover new worlds with progress tracking.
4. **Interact** 💬: Review, bookmark, and connect with authors.

### API Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register user |
| `/api/auth/login` | POST | Login user |
| `/api/stories` | GET/POST | Get/Create stories |
| `/api/chapters` | GET/POST/PUT/DELETE | Manage chapters |
| `/api/reviews` | GET/POST | Handle reviews |
| `/api/search` | GET | Search stories |

*Full docs in backend code or via Postman.*

## 🤝 Contributing

We'd love your buzz! 🐝

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a PR

## 📞 Contact

Got questions? Open an issue or reach out!

---

*Crafted with ❤️ for storytellers everywhere. Happy writing! 📚*
