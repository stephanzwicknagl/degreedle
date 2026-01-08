# AGENTS.md

## Commands

- **Build**: `npm run prebuild` (Expo prebuild)
- **Lint**: `npm run lint` (ESLint + Prettier check)
- **Format**: `npm run format` (ESLint fix + Prettier write)
- **Start**: `npm start` (Expo dev server)
- **Test**: No test framework configured

## Code Style Guidelines

### Imports & Structure

- Use absolute imports without `@/` prefix for local modules
- Group imports: React Native → third-party → local components → interfaces → constants
- Use named exports for components, interfaces for types

### TypeScript

- Strict mode enabled
- Interface definitions in `interfaces/` directory
- Type props explicitly with interfaces
- Use generic types for API responses

### Styling

- NativeWind (Tailwind CSS) for styling
- Use `className` prop for styles
- Theme utilities in `components/theme.tsx`
- Prettier with Tailwind plugin for class sorting

### Component Patterns

- Functional components with React hooks
- Use `Container.tsx` for SafeArea wrapper
- Destructure props in function signature
- Handle async operations with try/catch or error boundaries

### Naming

- PascalCase for components
- camelCase for variables and functions
- Descriptive names for API functions (`fetchWeatherForecast`, `fetchLocations`)

### Error Handling

- API calls return `null` on error
- Console.log errors for debugging
- Use optional chaining for API data access
