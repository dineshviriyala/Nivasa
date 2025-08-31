
# Nivasa - Apartment Administration System

A modern, responsive web application for managing apartment administration, built with React, TypeScript, and Tailwind CSS.

## 🏠 Overview

Nivasa is a comprehensive apartment management platform that streamlines maintenance requests, tenant communication, and property administration. It features role-based dashboards for both tenants and administrators.

## ✨ Features

### For Tenants
- **Ticket Management**: Create and track maintenance requests
- **Real-time Updates**: Monitor ticket status and progress
- **Category-based Reporting**: Organize issues by type (Plumbing, Electrical, HVAC, etc.)
- **Priority Levels**: Set urgency levels for faster response
- **Communication Tools**: Add comments and updates to tickets

### For Administrators
- **Dashboard Overview**: Comprehensive statistics and quick actions
- **Ticket Management**: Organize tickets by status (Unassigned, Assigned, Cleared)
- **Tenant Directory**: Manage tenant information and contact details
- **Technician Management**: Coordinate with maintenance staff and contractors
- **Status Tracking**: Real-time updates on all property maintenance activities

### General Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Role-based Access**: Different interfaces for tenants and administrators
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components
- **Real-time Notifications**: Toast notifications for important updates
- **Search & Filter**: Easy navigation and data management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fix-my-flat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Demo Accounts

For testing purposes, use these demo credentials:

**Admin Account:**
- Email: `admin@fixmyflat.com`
- Password: `admin123`

**Tenant Account:**
- Email: `tenant@fixmyflat.com`
- Password: `tenant123`

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Hooks + Local Storage (for demo)
- **Notifications**: Custom toast system

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/            # Dashboard layouts
│   │   ├── AdminDashboard.tsx
│   │   └── TenantDashboard.tsx
│   ├── tickets/              # Ticket management
│   │   ├── TicketManagement.tsx
│   │   ├── CreateTicketForm.tsx
│   │   └── TenantTicketList.tsx
│   ├── tenants/              # Tenant management
│   │   └── TenantManagement.tsx
│   ├── technicians/          # Technician management
│   │   └── TechnicianManagement.tsx
│   └── ui/                   # Reusable UI components
├── pages/                    # Main pages
│   ├── Index.tsx            # Landing page
│   ├── Dashboard.tsx        # Dashboard router
│   └── NotFound.tsx         # 404 page
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
└── main.tsx                 # Application entry point
```

## 🔧 Customization Guide

### Adding New Ticket Categories

1. **Update the categories array** in `CreateTicketForm.tsx`:
   ```typescript
   const categories = [
     'Plumbing',
     'Electrical',
     'HVAC',
     'Appliances',
     'Maintenance',
     'Security',
     'Your New Category',
     'Other'
   ];
   ```

### Modifying User Roles

1. **Add new role types** in the type definitions
2. **Update the signup form** to include new role options
3. **Create corresponding dashboard components**
4. **Update the routing logic** in `Dashboard.tsx`

### Customizing the Theme

1. **Update Tailwind configuration** in `tailwind.config.ts`
2. **Modify CSS variables** in `src/index.css`
3. **Adjust component styles** as needed

### Adding New Features

1. **Create component files** in the appropriate directory
2. **Add routing** if needed in `App.tsx`
3. **Update navigation** in dashboard components
4. **Add any required state management**

## 🧪 Development Tips

### Working with Components

Each component is designed to be:
- **Self-contained**: Minimal external dependencies
- **Reusable**: Can be easily imported and used elsewhere
- **TypeScript-ready**: Full type safety and IntelliSense support

### State Management

Currently using:
- **Local Storage**: For demo user authentication
- **Component State**: For form data and UI state
- **Props**: For component communication

For production, consider integrating:
- **React Query**: For server state management
- **Zustand/Redux**: For complex global state
- **Context API**: For shared application state

### API Integration

To connect to a real backend:

1. **Replace localStorage calls** with actual API calls
2. **Add error handling** for network requests
3. **Implement proper authentication** (JWT tokens, etc.)
4. **Add loading states** for better UX

Example API integration:
```typescript
// Replace this localStorage pattern:
const user = JSON.parse(localStorage.getItem('user') || '{}');

// With actual API calls:
const { data: user, isLoading, error } = useQuery({
  queryKey: ['user'],
  queryFn: fetchCurrentUser
});
```

## 🤖 Working with AI Assistants

When asking AI assistants (like ChatGPT) for help with this project:

### Be Specific
```
❌ "Fix the login"
✅ "The LoginForm component in src/components/auth/LoginForm.tsx is not validating email format properly. Can you add email validation?"
```

### Provide Context
```
"I'm working on the Nivasa apartment management app. I need to add a new feature to the AdminDashboard component that shows a monthly report chart. The project uses React with TypeScript, Tailwind CSS, and shadcn/ui components."
```

### Ask for Explanations
```
"Can you explain how the role-based routing works in the Dashboard.tsx component and suggest how to add a new 'manager' role?"
```

### Request Best Practices
```
"What's the best way to organize the ticket status updates in the TicketManagement component? Should I use a custom hook or keep the logic in the component?"
```

## 🔄 Future Enhancements

### Recommended Next Steps

1. **Backend Integration**
   - Connect to a real database (PostgreSQL, MongoDB)
   - Implement proper authentication (Auth0, Firebase Auth)
   - Add real-time updates with WebSockets

2. **Advanced Features**
   - File upload for ticket attachments
   - Email notifications
   - Mobile app with React Native
   - Advanced reporting and analytics

3. **Performance Optimizations**
   - Implement lazy loading
   - Add error boundaries
   - Optimize bundle size
   - Add PWA capabilities

4. **Testing**
   - Unit tests with Jest and React Testing Library
   - E2E tests with Playwright or Cypress
   - Visual regression testing

## 📝 Contributing

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types for new components
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm run preview
   ```

4. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the existing components** for similar patterns
2. **Review the shadcn/ui documentation** for UI components
3. **Consult the React and TypeScript documentation**
4. **Ask specific questions** with relevant code snippets

---

Built with ❤️ for better apartment management experiences.
