# Create4Me Backend API

Express.js backend for Create4Me SaaS platform with MongoDB and Prisma ORM.

## Features

- 🔐 JWT Authentication (signup, login, logout)
- 👤 User management with role-based access
- 📁 Project management (CRUD operations)
- 📄 Landing page builder with JSON structure storage
- 🤖 AI integration placeholders (content generation, suggestions)
- 🛡️ Security middleware (helmet, cors, error handling)
- ��️ MongoDB database with Prisma ORM

## Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT with bcryptjs
- **Security**: Helmet, CORS
- **Development**: Nodemon, TypeScript

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone and navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Push database schema to MongoDB:
```bash
npx prisma db push
```

6. Start development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Projects
- `POST /projects` - Create project
- `GET /projects` - List all user's projects
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Pages
- `POST /projects/:id/pages` - Add page to project
- `GET /projects/:id/pages` - List pages for project
- `GET /pages/:id` - Get page details
- `PUT /pages/:id` - Update page structure/content
- `DELETE /pages/:id` - Delete page
- `POST /pages/:id/publish` - Publish page

### AI Integration
- `POST /ai/generate` - Generate content from prompt
- `POST /ai/suggest` - Get page improvement suggestions
- `POST /ai/optimize` - Optimize content for better conversion

## Database Schema

### Users
- id (ObjectId)
- email (unique)
- passwordHash
- role (user/admin)
- createdAt, updatedAt

### Projects
- id (ObjectId)
- userId (ObjectId, ref: User)
- title
- description
- createdAt, updatedAt

### Pages
- id (ObjectId)
- projectId (ObjectId, ref: Project)
- name
- structureJson (JSON)
- createdAt, updatedAt

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

### Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet security headers
- Input validation
- Role-based access control
- Error handling middleware

## Deployment

1. Set production environment variables
2. Build the application: `npm run build`
3. Start production server: `npm start`

For MongoDB Atlas deployment, update `DATABASE_URL` in your production environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
