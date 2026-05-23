# TaskFlow Pro

A comprehensive full-stack project and task management application built with modern web technologies. TaskFlow Pro enables teams to collaborate seamlessly, manage projects efficiently, track tasks, and achieve their goals together.

**🌐 Live Demo:** [https://taskflow-pro-yx5z.onrender.com](https://taskflow-pro-yx5z.onrender.com)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/React-19.2.6-blue)](https://reactjs.org)
[![Express Version](https://img.shields.io/badge/Express-5.2.1-green)](https://expressjs.com)

## 🚀 Features

### Core Functionality
- **Authentication & Authorization**
  - Google OAuth 2.0 integration for seamless login
  - JWT-based session management
  - Role-based access control (Admin/Member)

- **Project Management**
  - Create, update, and manage projects
  - Track project status (Active/Completed)
  - Add team members to projects
  - File management and uploads
  - Project updates and activity feed

- **Task Management**
  - Create and assign tasks to team members
  - Task status tracking (Todo/In Progress/Done)
  - Task descriptions and metadata
  - Real-time task updates

- **Team Collaboration**
  - Team member management
  - User invitations and management
  - Admin dashboard for user administration
  - Team progress tracking and analytics

- **Analytics & Reporting**
  - Statistics dashboard
  - Team progress visualization
  - Project and task metrics

## 📋 Tech Stack

### Frontend
- **React 19.2.6** - Modern UI library with latest features
- **React Router DOM 7.15.1** - Client-side routing
- **Vite 8.0.12** - Lightning-fast build tool
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Query 5.100.11** - Powerful data fetching and caching
- **Axios 1.16.1** - HTTP client for API requests
- **Framer Motion 12.40.0** - Animation library
- **React Icons 5.6.0** - Icon library
- **React Hot Toast 2.6.0** - Toast notifications
- **Moment.js 2.30.1** - Date/time utilities
- **JWT Decode 4.0.0** - JWT token parsing

### Backend
- **Express 5.2.1** - Web application framework
- **MongoDB 7.2.0** - NoSQL database
- **Mongoose 9.6.2** - MongoDB object modeling
- **Passport.js 0.7.0** - Authentication middleware
- **Passport Google OAuth 2.0 2.0.0** - Google authentication strategy
- **JWT (jsonwebtoken 9.0.3)** - Token-based authentication
- **Bcryptjs 3.0.3** - Password hashing
- **CORS 2.8.6** - Cross-origin request handling
- **Multer 2.1.1** - File upload handling
- **Morgan 1.10.1** - HTTP request logging
- **Cookie Session 2.1.1** - Session management
- **UUID 14.0.0** - Unique ID generation

## 📁 Project Structure

```
taskflow-pro/
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # Authentication components
│   │   │   ├── common/             # Shared components
│   │   │   ├── dashboard/          # Dashboard components
│   │   │   └── layout/             # Layout components (Navbar, Sidebar, Layout)
│   │   ├── pages/                  # Page components
│   │   │   ├── Login.jsx           # Login page with Google OAuth
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Projects.jsx        # Projects listing
│   │   │   ├── ProjectDetails.jsx  # Project detail view
│   │   │   ├── Tasks.jsx           # Tasks management
│   │   │   ├── Team.jsx            # Team management
│   │   │   ├── Admin.jsx           # Admin panel
│   │   │   └── NotFound.jsx        # 404 page
│   │   ├── routes/                 # Route components
│   │   │   └── ProtectedRoute.jsx  # Protected route wrapper
│   │   ├── api/                    # API integration
│   │   ├── services/               # Business logic services
│   │   ├── context/                # React context for state management
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── assets/                 # Static assets
│   │   ├── App.jsx                 # Root app component
│   │   ├── main.jsx                # Application entry point
│   │   ├── App.css                 # Global styles
│   │   └── index.css               # Base styles
│   ├── public/                     # Public static files
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── eslint.config.js            # ESLint configuration
│
├── server/                         # Express Backend Application
│   ├── config/
│   │   ├── db.js                  # MongoDB connection configuration
│   │   └── passport.js            # Passport authentication strategies
│   ├── controllers/               # Route controllers
│   │   ├── authController.js      # Authentication logic
│   │   ├── projectController.js   # Project management logic
│   │   ├── taskController.js      # Task management logic
│   │   ├── userController.js      # User management logic
│   │   └── inviteController.js    # Invitation logic
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js               # User model
│   │   ├── Project.js            # Project model
│   │   ├── Task.js               # Task model
│   │   └── Invite.js             # Invitation model
│   ├── routes/                    # Express routes
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── projectRoutes.js      # Project endpoints
│   │   ├── taskRoutes.js         # Task endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── inviteRoutes.js       # Invitation endpoints
│   │   ├── statsRoutes.js        # Statistics endpoints
│   │   └── teamProgressRoutes.js # Team progress endpoints
│   ├── middleware/               # Custom middleware
│   │   ├── authMiddleware.js     # Authentication verification
│   │   ├── adminMiddleware.js    # Admin authorization
│   │   └── errorMiddleware.js    # Error handling
│   ├── services/                 # Business logic services
│   ├── utils/                    # Utility functions
│   ├── uploads/                  # File uploads directory
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Server entry point
│
├── package.json                  # Root package configuration
└── .gitignore                    # Git ignore rules
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google OAuth credentials (for authentication)

### Environment Variables

Create a `.env` file in the `server` directory:

```bash
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/taskflow-pro

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL
CLIENT_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/naahe25/taskflow-pro.git
   cd taskflow-pro
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   npm run install-server
   ```

4. **Install client dependencies**
   ```bash
   npm run install-client
   ```

## 🚀 Running the Application

### Development Mode (Concurrent)
Run both frontend and backend simultaneously:
```bash
npm run dev
```

This command uses `concurrently` to run:
- Frontend: `npm run dev --prefix client` (Vite dev server on port 5173)
- Backend: `npm run dev --prefix server` (Express server on port 5000)

### Production Build
Build the client for production:
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Individual Development

**Start Backend Only:**
```bash
npm run dev --prefix server
```

**Start Frontend Only:**
```bash
npm run dev --prefix client
```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /user` - Get current user
- `GET /google` - Google OAuth login
- `GET /google/callback` - Google OAuth callback

### Project Routes (`/api/projects`)
- `GET /` - Get all projects
- `POST /` - Create new project
- `GET /:id` - Get project details
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `POST /:id/members` - Add team member
- `POST /:id/upload` - Upload file

### Task Routes (`/api/tasks`)
- `GET /` - Get all tasks
- `POST /` - Create new task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task

### User Routes (`/api/users`)
- `GET /` - Get all users
- `GET /:id` - Get user details
- `PUT /:id` - Update user profile

### Invite Routes (`/api/invites`)
- `GET /` - Get user invitations
- `POST /` - Create invitation
- `POST /:id/accept` - Accept invitation
- `DELETE /:id` - Decline invitation

### Statistics Routes (`/api/stats`)
- `GET /` - Get project statistics
- `GET /tasks` - Get task statistics

### Team Progress Routes (`/api/team-progress`)
- `GET /` - Get team progress data

## 🔐 Authentication Flow

1. User lands on Login page
2. User clicks "Login with Google"
3. Google OAuth popup opens
4. User authenticates with Google
5. Passport strategy handles callback
6. JWT token is issued and stored
7. User is redirected to Dashboard

## 🎨 Key Components

### Frontend Components
- **Layout** - Main layout wrapper with Navbar and Sidebar
- **Navbar** - Navigation bar with user profile dropdown
- **Sidebar** - Navigation sidebar with menu items
- **ProtectedRoute** - Route wrapper for authenticated pages

### Pages
- **Login** - Authentication page with Google OAuth
- **Dashboard** - Main dashboard with overview and statistics
- **Projects** - Project listing and management
- **ProjectDetails** - Detailed project view with tasks and team
- **Tasks** - Task management and tracking
- **Team** - Team member management
- **Admin** - Admin panel for user administration

## 📊 Data Models

### User Schema
- `googleId` - Google account identifier
- `name` - User full name
- `email` - User email (unique)
- `avatar` - Profile picture URL
- `role` - User role (Admin/Member)
- `projects` - Array of project references
- `timestamps` - Created/Updated dates

### Project Schema
- `title` - Project name
- `description` - Project description
- `status` - Project status (active/completed)
- `createdBy` - Project creator reference
- `teamMembers` - Array of team member references
- `files` - Array of uploaded files with metadata
- `updates` - Activity feed/updates
- `timestamps` - Created/Updated dates

### Task Schema
- `title` - Task name
- `description` - Task description
- `status` - Task status (todo/inprogress/done)
- `assignedTo` - Assigned user reference
- `project` - Parent project reference
- `timestamps` - Created/Updated dates

### Invite Schema
- `email` - Recipient email
- `role` - Invited role
- `project` - Project reference (if applicable)
- `status` - Invitation status (pending/accepted/declined)

## 🛡️ Security Features

- **Password Hashing** - Bcrypt for secure password storage
- **JWT Tokens** - Secure token-based authentication
- **OAuth 2.0** - Google authentication integration
- **Role-Based Access Control** - Admin and Member roles
- **CORS Protection** - Cross-origin request validation
- **HTTP Logging** - Morgan middleware for request tracking

## 🧪 Development Features

- **Hot Module Replacement** - Vite HMR for instant frontend updates
- **Nodemon** - Automatic backend restart on file changes
- **ESLint** - Code quality and style enforcement
- **Tailwind CSS** - Rapid UI development

## 📦 Build & Deployment

### Frontend Build Output
The client builds to the `client/dist/` directory. In production, the Express server serves the static files from this location.

### Production Configuration
When `NODE_ENV=production`:
- Express serves static files from `client/dist/`
- All non-API routes serve `index.html` for SPA routing
- CORS is configured for the production client URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙋 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## 🔮 Future Enhancements

- Real-time notifications
- Advanced analytics and reporting
- Task dependencies and critical path
- Time tracking and estimation
- Customizable workflows
- Integration with external tools (Slack, Jira, etc.)
- Mobile application
- Dark mode theme
- Advanced search and filtering
- Calendar view for tasks and projects

---

**Built with ❤️ by TaskFlow Pro Team**
