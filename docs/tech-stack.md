# Tech Stack

## Core Framework

### React 18+
- **Version**: 18.3.1
- **Purpose**: UI framework with automatic JSX runtime
- **Key Features**:
  - No global React imports needed
  - Concurrent rendering
  - Automatic batching
  - Server Components ready

### TypeScript
- **Version**: Latest
- **Purpose**: Type-safe development
- **Configuration**:
  - Strict mode enabled
  - Path aliases: `@/` → `src/`
  - Target: ES2020+

## Build Tools

### Vite
- **Version**: 6.0.7
- **Purpose**: Fast build tool and dev server
- **Plugins**:
  - `@vitejs/plugin-react` - React support with automatic JSX runtime
  - `@tailwindcss/vite` - Tailwind CSS v4 integration

## UI & Styling

### Tailwind CSS v4
- **Version**: 4.1.18
- **Purpose**: Utility-first CSS framework
- **Configuration**: CSS-based via `@theme inline` in `src/index.css`
- **Custom Utilities**:
  - Typography: `h1-topic`, `h2-topic`, `h3-topic`, `normal`, `normal-b`, `caption`
  - Colors: Brand palette, semantic colors (success, error, warning, info)
  - Container: Responsive max-width container

### shadcn/ui
- **Purpose**: Radix UI-based component library
- **Components Used**:
  - Form controls: Button, Input, Select, Checkbox, Calendar
  - Layout: Card, Dialog, Sheet, Tabs, Accordion
  - Feedback: Badge, Toast (Sonner), Skeleton
  - Navigation: Sidebar, Breadcrumb, Dropdown Menu
  - Data: Table, Pagination
- **Customization**: All components in `src/components/ui/`

### Radix UI
- **Purpose**: Unstyled, accessible UI primitives
- **Key Packages**:
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-select`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-checkbox`

## Data Management

### TanStack Query v5
- **Version**: 5.62.14
- **Purpose**: Server state management
- **Usage**:
  - Data fetching with caching
  - Optimistic updates
  - Automatic refetching
  - Query invalidation
- **Example Hooks**: `useProjects`, `useProjectDetail`, `useUsers`

### TanStack Table v8
- **Version**: 8.20.6
- **Purpose**: Headless table library
- **Features**:
  - Sorting with Thai locale support
  - Pagination
  - Column visibility
  - Custom cell renderers
- **Implementation**: `src/components/project-tables/`

## Routing

### React Router DOM
- **Version**: 7.1.1
- **Purpose**: Client-side routing
- **Configuration**:
  - Public routes: `/login`, `/vendor-form`
  - Private routes: `/app/*`
  - Protected routes with `<ProtectedRoute>`
  - Role-based access with `<ProjectAccessGuard>`

## HTTP Client

### Axios
- **Version**: 1.7.9
- **Purpose**: HTTP requests
- **Configuration**: `src/lib/axios.ts`
- **Features**:
  - Base URL configuration
  - Request/response interceptors
  - Automatic error handling

## Forms & Validation

### React Hook Form
- **Version**: 7.54.2
- **Purpose**: Form state management
- **Features**:
  - Performance optimized
  - Minimal re-renders
  - Built-in validation

### Zod
- **Version**: 3.24.1
- **Purpose**: Schema validation
- **Usage**:
  - Type definitions: `ProjectSchema`, `UserSchema`
  - Runtime validation
  - Type inference for TypeScript

## Date Handling

### date-fns
- **Version**: 4.1.0
- **Purpose**: Date manipulation and formatting
- **Features**:
  - Thai locale support (`th` locale)
  - Buddhist Era conversion
  - Custom formatters: `formatDateThai()`, `formatDateThaiShort()`

### react-day-picker
- **Version**: 9.4.4
- **Purpose**: Date picker component
- **Integration**: Used in `DatePicker` and `Calendar` components

## Icons

### Lucide React
- **Version**: 0.469.0
- **Purpose**: Icon library
- **Features**:
  - Tree-shakeable
  - Consistent design
  - Customizable size and color
- **Common Icons**: `Inbox`, `AlertTriangle`, `Check`, `Search`, `Filter`, `MoreVertical`

## Utilities

### clsx + tailwind-merge
- **Purpose**: Conditional class composition
- **Usage**: `cn()` utility in `src/lib/utils.ts`
- **Example**:
  ```tsx
  <div className={cn('base-class', isActive && 'active-class')} />
  ```

### class-variance-authority (CVA)
- **Version**: 0.7.1
- **Purpose**: Variant-based component styling
- **Usage**: Badge, Button variants

## Development Tools

### ESLint
- **Purpose**: Code linting
- **Configuration**: `eslint.config.js`

### TypeScript ESLint
- **Purpose**: TypeScript-specific linting rules

## Fonts

### Noto Sans Thai
- **Purpose**: Primary font family
- **Weights**: 300, 400, 500, 600, 700
- **Usage**: All text elements by default

## Design Tokens

### Color System
- **Primary**: `oklch(0.216 0.006 56.043)` - Dark blue
- **Brand**: Pink shades (`--brand-3` to `--brand-12`)
- **Semantic**:
  - Success: Teal (`#14b8a6`)
  - Error: Red (`#dc2626`)
  - Warning: Yellow (`#fbbf24`)
  - Info: Blue (`#3b82f6`)

### Typography Scale
- **h1-topic**: 24px / 700
- **h2-topic**: 20px / 600
- **h3-topic**: 18px / 600
- **normal**: 16px / 400
- **normal-b**: 16px / 600
- **caption**: 14px / 400

### Spacing
- **Radius**: Base `0.625rem` (10px)
- **Container padding**: `1rem`
- **Container max-width**: `1280px`

## Browser Support

- **Target**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **ES Version**: ES2020+
- **Module System**: ESM
