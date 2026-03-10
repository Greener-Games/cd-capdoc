# Project Audit & Areas for Improvement

This document outlines architectural, stylistic, and technical improvements identified during the project audit on March 9, 2026.

## 1. Clean Code & Refactoring

### 1.1 Logic in Getters [DONE]
- **Current State:** `useDataStore` getters (like `currentProjects`) contained complex logic involving route parsing and fallbacks.
- **Improvement:** Moved logic into `useProjectContext.ts` composable. Getters in the store are now simpler.

### 1.2 Component Logic Extraction [DONE]
- **DetailView.vue:** Moved scrolling logic and progress calculation into `useScrollProgress.ts`.
- **CuratorPage.vue:** Search/filtering logic moved into `useProjectSearch.ts`.

### 1.3 TypeScript Strictness
- **Any Types:** There are still several `(block as any)` and `any[]` usages, especially in `hygraph.ts`.
- **Improvement:** Define strict interfaces for all `ContentBlock` types and use discriminated unions to avoid type casting.

## 2. Consistency

### 2.1 Component Naming & Structure [DONE]
- **Improvement:** Moved `BaseLayout.vue` to `src/components/Layouts/BaseLayout.vue`. Standardized folder structure.

### 2.2 Prop naming [DONE]
- **Improvement:** Renamed `imageUrl` to `image` across `Project` interface, constants, components, and services.

## 3. Future Proofing

### 3.1 Data Origin Abstraction [DONE]
- **Improvement:** Created `projectRepository.ts` to handle the data fetching strategy (cache -> remote -> local fallback) internally. The store now just calls the repository.

### 3.2 Content Block Extensibility [DONE]
- **Improvement:** Created a dynamic `BlockRenderer.vue` and individual block components (`ImageBlock`, `TextBlock`, `VideoBlock`).

## 4. Performance

### 4.1 3D / TresJS Optimization
- **Shader Complexity:** Simplex noise in the vertex shader is calculated per frame.
- **Improvement:** Consider pre-calculating noise into a texture or reducing shader complexity for mobile.

### 4.2 Asset Loading [DONE]
- **Improvement:** Enhanced `resolveAssetUrl` in `hygraph.ts` to support width/quality parameters for responsive images.

### 4.3 Bundle Splitting [DONE]
- **Improvement:** Updated `router/index.ts` to use lazy loading for all main view components.

## 5. Security

### 5.1 Environment Variables
- **Improvement:** Add validation for environment variables on app startup.

### 5.2 Content Security Policy (CSP)
- Ensure the app has a robust CSP.

## 6. User Experience (UX)

### 6.1 Loading States
- Add skeleton screens or a high-quality global loader when `isFetchingData` is true.

### 6.2 Error Boundaries
- Implement Vue Error Boundaries.
