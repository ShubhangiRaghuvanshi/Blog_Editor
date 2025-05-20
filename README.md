# Blog Editor

A modern, full-stack blog editor application built with React, Node.js, and MongoDB. This application allows users to create, edit, and manage their blog posts with a beautiful and intuitive interface.

## Features

-  User Authentication
-  Rich Text Blog Editor
-  Draft Management
- 🏷 Tag Support
-  Responsive Design
-  Real-time Auto-save
- Blog Status Tracking (Published/Draft)

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API requests
- React Toastify for notifications
- CSS Modules for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ShubhangiRaghuvanshi/Blog_Editor.git
cd Blog_Editor
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend-vite
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

### Development Mode

1. Start the backend server:
cd backend
npm run dev
```

2. Start the frontend development server:

cd frontend-vite
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode

1. Build the frontend:
```bash
cd frontend-vite
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs/save-draft` - Save blog draft
- `POST /api/blogs/publish` - Publish blog

## Project Structure

```
Blog_Editor/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend-vite/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Team for the amazing framework
- MongoDB for the database
