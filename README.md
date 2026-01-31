# ระบบจัดการโครงการจัดซื้อจัดจ้าง (Procurement Management System)

ระบบบริหารจัดการโครงการจัดซื้อจัดจ้างแบบครบวงจร สำหรับติดตามและบริหารจัดการโครงการตั้งแต่ขั้นตอนการรับเรื่อง การมอบหมายงาน ไปจนถึงการปิดโครงการ

## 🚀 Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **TanStack Query (React Query)** - Server State Management
- **TanStack Table** - Data Table Component
- **React Router** - Client-side Routing
- **Recharts** - Data Visualization
- **shadcn/ui** - UI Component Library
- **Tailwind CSS** - Styling
- **Zod** - Schema Validation
- **Axios** - HTTP Client
- **Sonner** - Toast Notifications
- **date-fns** - Date Utilities

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

## 🏗️ Project Structure

```
src/
├── api/              # API functions and mock data
├── assets/           # Static assets
├── components/       # Reusable UI components
│   ├── guards/       # Route guards
│   ├── project-dialog/  # Project-related dialogs
│   ├── project-tables/  # Project table components
│   ├── sidebar/      # Sidebar navigation
│   └── ui/           # Base UI components (shadcn/ui)
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
├── lib/              # Utility functions
├── pages/            # Page components
├── routes/           # Route configuration
└── types/            # TypeScript type definitions
```

## 🎯 Key Features

### Project Management

- **งานที่ยังไม่ได้มอบหมาย** - View and assign unassigned projects
- **งานที่ถูกมอบหมายแล้ว** - Track assigned projects with status filtering
- **ภาระงานของเจ้าหน้าที่** - Workload visualization with stacked bar charts

### Actions

- ✅ มอบหมายงาน (Assign Projects) - Batch assignment support
- ✅ รับทราบโครงการ (Accept Projects) - Single and batch acceptance
- ✅ เลือกงาน (Claim Project) - Self-assignment
- ✅ ยกเลิก/ขอยกเลิก (Cancel Project) - Role-based cancellation
- ✅ เปลี่ยนผู้รับผิดชอบ (Change Assignee) - Reassign projects

### Role-Based Access Control

- **ManageUnitRoles** - Full unit management permissions
- **SupervisorRoles** - Supervisory permissions
- **ManageSelfRoles** - Self-management permissions

### Data Features

- Real-time filtering and sorting
- Date range selection
- Status-based filtering
- Urgent project highlighting
- Workload distribution charts

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📊 API Integration

The application uses a mock data layer (`src/api/mock-data.ts`) for development. To connect to a real backend:

1. Update API functions in `src/api/` files
2. Uncomment axios calls and remove mock returns
3. Configure `VITE_API_BASE_URL` in `.env`

## 🎨 Styling

This project uses **Tailwind CSS v4** with custom design tokens:

- Custom color palette (brand colors, semantic colors)
- Thai font support (Noto Sans Thai)
- Dark mode ready (commented out)
- Custom radius utilities
- Typography utilities (h1-h4 variants)

## 🧪 Development Guidelines

### Adding New Components

```bash
# Add shadcn/ui components
npx shadcn@latest add [component-name]
```

### Date Handling

Use `formatDateThai()` from `src/lib/date-utils.ts` for consistent Thai Buddhist Era date formatting.

### State Management

- Use **TanStack Query** for server state
- Use **React Context** for global UI state
- Use **useState/useReducer** for local component state

### Type Safety

- All API responses validated with Zod schemas
- Strict TypeScript configuration
- No `any` types in production code

## 📝 Available Scripts

| Script            | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Start development server (default: http://localhost:5173) |
| `npm run build`   | Build for production                                      |
| `npm run preview` | Preview production build locally                          |
| `npm run lint`    | Run ESLint                                                |
| `npm run format`  | Format code with Prettier                                 |

## 🔐 Authentication

Authentication context available via `useAuth()` hook:

```tsx
const { user, login, logout } = useAuth();

// Access user role
if (ManageUnitRoles.includes(user.role)) {
  // Show admin actions
}
```

## 📈 Charts

Workload charts use Recharts with custom theming:

- Stacked bar charts for workload visualization
- Responsive design with proper margins
- Brand color integration
- Interactive tooltips and legends

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

[Add your license here]

## 👥 Team

[Add your team information here]
