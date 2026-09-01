# Shared Equipment Booking System — Frontend

The frontend user interface for the Shared Equipment Booking System, built to provide seamless equipment browsing, reservation requests, and administrative control panels.

## Features

- **Role-Based Workflows** — Tailored user interfaces and dashboards for Employees and Administrators
- **Equipment Management** — Dynamic catalog browsing, filtering, and admin controls for inventory states
- **Reservation Lifecycle** — Intuitive booking management, status tracking, and request approvals
- **Interactive Feedback** — Real-time notifications and modals for user actions

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v18+ recommended)
- A running instance of the backend API server

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/fazle-rabbi-cmd/shared-equipment-booking-frontend.git
cd shared-equipment-booking-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and point it to your backend API base URL:

```env
# Local development
VITE_API_BASE_URL=http://localhost:5000/api

# Production
# VITE_API_BASE_URL=https://your-live-domain.com/api
```

> **Note:** For local development, point `VITE_API_BASE_URL` to your local backend instance. For a live deployment, set this via your hosting platform's environment variable settings (e.g., Vercel, Netlify) instead of hardcoding it in `.env` — keeps local and production configs separate and avoids code changes if the backend URL ever changes.

### 4. Run the application

**Development mode:**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
```
