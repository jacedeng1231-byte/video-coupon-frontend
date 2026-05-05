# Video Coupon Frontend - AI Documentation Spec

## 1. Project Overview
A Vue 3 (Vite) application designed to run within the LINE LIFF environment. It allows users to watch YouTube videos and claim coupons once specific viewing criteria are met. It also includes an administrative dashboard for content management.

## 2. Tech Stack
- **Framework**: Vue 3 (SFC)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Styling**: Bootstrap 5 + Vanilla CSS (Design Tokens)
- **External SDKs**: LINE LIFF SDK, YouTube IFrame API

## 3. Core Logic & Implementation

### A. Authentication & User Sync (`src/liff/liffInit.js`)
- **Initialization**: Calls `liff.init()` with a specific `liffId`.
- **User Sync**: Upon successful login/profile fetch, it sends the profile data to the backend `POST /users/login` and stores the resulting DB `userId` in `localStorage`.
- **Dev Mode**: If `import.meta.env.DEV` is true, it uses a mock profile to allow local development without a real LINE environment.

### B. Video Tracking & YouTube API (`src/views/VideoView.vue`)
- **API Loading**: Dynamically injects the `https://www.youtube.com/iframe_api` script.
- **Player Management**: Initializes `YT.Player` instances for each video.
- **Progress Tracking**: 
    - Uses `setInterval` while player state is `PLAYING`.
    - Checks `player.getCurrentTime()` every 1000ms.
    - If time exceeds `requiredWatchSeconds` (default: 5s), it triggers `markWatched()` which calls the backend API.
- **Clean Up**: Destroys player instances in `loadVideos` to prevent memory leaks and container conflicts.

### C. Coupon Interaction (`src/views/CouponView.vue`)
- **Display**: Fetches claimed coupons from `GET /api/coupons/my/:userId`.
- **Status Handling**: Logic to display "Used", "Expired", or "Use Coupon" based on `isUsed` flag and `expireDate`.

## 4. Component Structure
- `src/components/RetroTV.vue`: A specialized card component that wraps the YouTube player and a conditional "Claim" button.
- `src/components/PageTitle.vue`: Reusable header component for all views.

## 5. Routes (`src/router/index.js`)
- `/`: Main Video Center (`VideoView`).
- `/member`: Member Center (`HomeView`).
- `/coupons`: User's claimed coupons (`CouponView`).
- `/dashboard`: Admin dashboard layout.
    - `/dashboard/videos`: Manage video list.
    - `/dashboard/coupons`: Manage coupon templates.
    - `/dashboard/users`: Manage user data.

## 6. Environment Variables (`.env`)
- `VITE_APP_TITLE`: Application title.
- Backend URL is hardcoded in `src/api/api.js` to switch between `localhost:3000` (DEV) and `onrender.com` (PROD).

## 7. Deployment
- Configured for **GitHub Pages** using `npm run deploy` (via `gh-pages` package).
- Production build targets the `dist/` directory.
