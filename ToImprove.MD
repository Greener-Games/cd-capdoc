# Project Audit & Improvements

This document tracks identified areas for improvement and technical debt. Use the checkboxes to track progress.

## 🏗️ Architecture & Patterns
- [ ] **Idiomatic Stores:** Refactor Pinia stores (e.g., `src/store/data.ts`) from Options API to **Setup API** for better composition and consistency with the rest of the project.
- [ ] **Dependency Injection:** Refactor `ProjectRepository` from a singleton export to an injectable pattern or move its logic into Pinia actions to improve testability.
- [ ] **View Management:** Centralize view-state transition logic. Currently, `App.vue` handles a lot of conditional logic that could be abstracted into a dedicated layout orchestrator.

## 🧹 Code Quality & Type Safety
- [ ] **Eliminate `any` types:** Replace `any` in `src/services/hygraph.ts` and mapping functions with strict TypeScript interfaces representing the Hygraph schema.
- [ ] **Runtime Validation:** Implement **Zod** or a similar library to validate CMS data at the edge (data fetching layer) to prevent runtime crashes from unexpected schema changes.
- [ ] **Strict Block Mapping:** Refine the `ContentBlock` mapping logic to be more exhaustive and type-safe, ensuring all modular components from Hygraph are handled correctly.
- [ ] **Naming Conventions:** Ensure consistent naming between Hygraph fields and frontend types (e.g., `imageUrl` vs `image`, `accentColor` vs `color`).

## ⚡ Performance Optimization
- [ ] **3D Background Throttling:** Automatically pause or reduce the clock speed of the TresJS loop in `Canvas3D.vue` when the background is hidden (e.g., in `DetailView`).
- [ ] **Dynamic Geometry Detail:** Adjust the `TresPlaneGeometry` segments in `SceneContent.vue` based on the user's device tier or screen resolution to save GPU cycles on mobile.
- [ ] **Asset Lazy Loading:** Add `loading="lazy"` and `decoding="async"` to images in `ImageBlock.vue` and `ProjectCard.vue`.
- [ ] **Bundle Analysis:** Audit the build size. Chunks over 500kB were detected; investigate splitting `three` or `vidstack` into separate chunks.

## 🔒 Security
- [ ] **Tighten CSP:** Investigate removing `'unsafe-inline'` and `'unsafe-eval'` from `csp-config.ts`. 
    - Check if Vite's CSS injection can be handled via hashes or nonces.
    - Confirm if `@tresjs/core` or `vidstack` actually require `unsafe-eval`.
- [ ] **Environment Variable Audit:** Ensure no sensitive keys are prefixed with `VITE_` unless absolutely necessary for the client-side.

## 🎨 User Experience & Accessibility
- [ ] **A11y Audit:** Add proper ARIA labels and roles to `ProjectCard`, `SelectionCard`, and `RoundedButton`. Ensure the 3D navigation is keyboard accessible.
- [ ] **Smooth State Transitions:** Enhance the `fade` transitions in `App.vue` with specialized layout transitions (e.g., hero image persistence using View Transitions API).
- [ ] **Error UI:** Implement a user-friendly error state/fallback if Hygraph data fails to fetch or the `VITE_HYGRAPH_ENDPOINT` is missing.

## 🛠️ Tooling & DX
- [ ] **Linting & Formatting:** Add **ESLint** and **Prettier** with Vue 3 / TypeScript configurations to enforce code style.
- [ ] **Unit Testing:** Set up **Vitest** and add unit tests for critical path logic (e.g., repository mapping, scroll math, store actions).
- [ ] **Component Documentation:** Add a storybook or similar tool to document and test UI components (`Cards`, `Common`, `Blocks`) in isolation.
