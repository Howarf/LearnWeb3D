# Project Overview
- This is a Web 3D game/interactive project based on React and JavaScript.
- Tech Stack: JavaScript, React, React Three Fiber (@react-three/fiber), Rapier (@react-three/rapier), Zustand, Supabase.

# Directory Structure
- `/src/component`: Contains UI components and Scenes using 3D objects.
- `/src/stores`: Manages Zustand stores shared globally or within specific domains (e.g., game progress state, dice results).
  - File naming convention: `use[Name]Store.js`.
- `/src/css`: Contains styles for HTML tags.
  - File naming convention: `[Name].module.css`.
  - Note: `App.css` and `index.css` are used globally; DO NOT add new code to these files.
- `/src/assets`: Static assets (images, SVGs, 3D model files, etc.).

# Commands
- Package Manager: `npm`
- Run Development Server: `npm run dev`

# Code Style & Rules (NON-NEGOTIABLE)
- Syntax: Actively use modern ES6+ syntax and React Hooks. Use CSS Modules for styling.
- Optimization: Prevent unnecessary re-renders to maintain 3D rendering performance. Use `useMemo` and `useCallback` appropriately.
- Physics Engine (Rapier): Pay close attention to Collider and RigidBody property settings to avoid physics errors.
- State Scoping: Use `useState` for local component state. Only use `/src/stores` for the 'Source of Truth' that needs to be shared across multiple components.
- Selectors: You MUST use individual selectors when calling a store to optimize performance (e.g., `const score = useGameStore(s => s.score)`).
- Actions: Define state modification logic (Actions) inside the store file to encapsulate them whenever possible.
- Routing for New Pages: When creating a new page, add it to `menu.jsx` using `Link` and `li` tags, then connect the routing in `App.jsx` using the `Route` tag.
- useFrame Performance: Inside `useFrame`, read store values via `useXxxStore.getState().value` (non-reactive direct read) instead of selectors to avoid per-frame re-renders.
- Material Mutation: To change 3D object color/properties at runtime without triggering re-renders, mutate `ref.material` directly (e.g., `matRef.color.set(...)`). Do NOT use state for this.

# Physics Engine Notes (Rapier @react-three/rapier ^2.2.0)
- `filterPredicate` (8th argument of `castRay`) is NOT supported in this version — do not use it.
- For grounded detection, use a `useRef(0)` contact counter incremented in `onCollisionEnter` and decremented in `onCollisionExit`. Do NOT use raycasts for this purpose.
- Move `kinematicPosition` RigidBodies only via `setNextKinematicTranslation` / `setNextKinematicRotation` inside `useFrame`.

# Output Language Rules (NON-NEGOTIABLE)
- MUST respond strictly in Korean.
- All code comments and explanations MUST be written in Korean.
- Even if the user prompt or context is in English, the final response MUST be translated and output in Korean.