# Real-Time Messenger Platform

This is a full-stack real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a robust foundation for building modern chat experiences, featuring real-time communication through WebSockets, secure authentication, and a responsive user interface.

## Key Features

- **Real-Time Communication**: Seamless messaging powered by Socket.io, including one-on-one and group chats.
- **Presence Tracking**: Real-time online and offline status indicators for users.
- **Secure Authentication**: User registration and login with secure cookie-based session management.
- **Messaging Enhancements**: Support for replying to specific messages and real-time updates for the latest message in chat lists.
- **Media Support**: Integrated file upload capabilities for media sharing.
- **Modern UI/UX**: A fully responsive interface designed with Tailwind CSS and Shadcn/UI, featuring both light and dark modes.
- **AI Integration**: Built-in support for context-aware AI conversations.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI
- Zustand (State Management)
- React Router Dom

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.io
- Passport.js (Authentication)
- Cloudinary (Media Management)
- Google Generative AI (Gemini SDK)

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A MongoDB database.
- Cloudinary account for media storage.
- Google Gemini API key for AI features.

### Installation

1. Clone the repository to your local machine.
2. Install dependencies for both the backend and client:

```bash
# Install backend dependencies
cd backend
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Configuration

Create a `.env` file in the `backend` directory and add the following variables:

```env
NODE_ENV=development
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_ORIGIN=http://127.0.0.1:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
FRONTEND_ORIGIN=http://127.0.0.1:5173
```

### Running the Application

Start the backend server:
```bash
cd backend
npm run dev
```

Start the client development server:
```bash
cd client
npm run dev
```

The application will be available at `http://127.0.0.1:5173`.
