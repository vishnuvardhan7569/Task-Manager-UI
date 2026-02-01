# Task Manager UI

A React frontend for the Task Manager application with Ant Design components.

## Features
- User Authentication (Login, Signup)
- Project Management (Create, View, Delete)
- Task Management (Create, Edit, Delete, Status Updates)
- Session Management (Auto logout after 2 hours)
- Responsive Design

## Tech Stack
- **React:** 18.x with Vite
- **UI Library:** Ant Design v5
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **CSS:** Custom styles with CSS modules

## Pages

| Route | Description |
|-------|-------------|
| `/login` | User login |
| `/signup` | User registration |
| `/` | Home dashboard |
| `/projects` | Projects list |
| `/projects/:id/tasks` | Project tasks |
| `/settings` | Account settings |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  api/
    api.js           # Axios instance with interceptors
  components/
    Header.jsx       # Navigation header
    ProjectCard.jsx  # Project display card
    ProtectedRoute.jsx # Route protection wrapper
    ScrollToTop.jsx  # Scroll restoration
  context/
    AuthContext.jsx  # Authentication state & logic
  pages/
    Home.jsx         # Dashboard
    Login.jsx        # Login page
    Signup.jsx       # Registration page
    Projects.jsx     # Projects list
    Tasks.jsx        # Tasks within project
    Settings.jsx     # User settings
  styles/
    *.css            # Page-specific styles
  App.jsx            # Main app component
  main.jsx           # Entry point
```

## Authentication Flow

1. User logs in → receives JWT token
2. Token stored in localStorage
3. Session expires after 2 hours (server-enforced)
4. On 401 response → auto logout & redirect to login

## API Integration

API requests are made through `src/api/api.js` which:
- Adds `Authorization: Bearer <token>` header
- Handles response interceptors for 401 errors
- Manages global error messages

## Session Management

- JWT tokens expire after 2 hours
- Frontend checks session on mount and every minute
- Automatic logout when token expires
- User redirected to login with warning message

## Customization

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Wrap with `ProtectedRoute` if authenticated

### Styling
- Global styles in `src/index.css`
- Page-specific styles in `src/styles/*.css`
- Ant Design theme can be customized in components
