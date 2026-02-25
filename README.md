<div align="center">

# AgriIntel 🌱

Modern soil analytics and farm intelligence for healthier yields.

<p>
	<a href="#-features">Features</a> •
	<a href="#-tech-stack">Tech Stack</a> •
	<a href="#-getting-started">Getting Started</a> •
	<a href="#-authentication">Authentication</a> •
	<a href="#-project-structure">Project Structure</a> •
	<a href="#-deployment">Deployment</a>
</p>

</div>

---

## ✨ Overview

SoilSense is a beautiful, responsive web experience built with Next.js and Tailwind CSS. It showcases product marketing pages and a custom Clerk Elements authentication flow with social providers (Apple, GitHub, Google) plus email/password sign-in.

---

## 🚀 Features

- **Custom Clerk Elements auth** for sign-in/sign-up (social + email).
- **Modern UI** with dark mode support and smooth transitions.
- **Responsive layouts** optimized for mobile-first experiences.
- **Reusable layouts/components** for fast iteration.

---

## 🧱 Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS**
- **Clerk** for authentication
- **PNPM** for package management

---

## 🔧 Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) (Optional) Configure environment variables

Create a local env file at `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_FASTAPI_URL=http://127.0.0.1:8000
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your keys from:
> - Clerk Dashboard: https://dashboard.clerk.com
> - Google Gemini API: https://makersuite.google.com/app/apikey (free tier available)

### 3) Start the FastAPI backend (soil + crop + weather/rainfall)

From the repo root:

```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Health check:

- `http://127.0.0.1:8000/health`

### 4) Run the Next.js development server

```bash
pnpm dev
```

Open http://localhost:3000

---

## 🔐 Authentication

Custom Clerk Elements auth flows are implemented in:

- **Sign in**: `app/(auth)/sign-in/[[...sign-in]]`
- **Sign up**: `app/(auth)/sign-up/[[...sign-up]]`

Providers enabled in the UI:

- Apple
- GitHub
- Google
- Email (code + password)

> Ensure these providers are enabled in your Clerk instance.

---

## 🧭 Pages

Marketing pages live in `pages/`:

- `HeroPage`
- `FeaturePage`
- `PlansPage`
- `AboutPage`

---

## 🧩 Project Structure

```
app/
	(auth)/
		sign-in/[[...sign-in]]/
		sign-up/[[...sign-up]]/
	layout.tsx
	page.tsx

components/
	ui/
	theme-toggle.tsx

layout/
	HeaderLayout.tsx
	FooterLayout.tsx
	PageLayout.tsx

pages/
	HeroPage.tsx
	FeaturePage.tsx
	PlansPage.tsx
	AboutPage.tsx

lib/
	utils.ts
```

---

## 🌍 Deployment

### Vercel

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set environment variables:
	 - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
	 - `CLERK_SECRET_KEY`
4. Deploy 🚀

---

## ✅ Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm start    # Run production server
```

---

## 🧪 Troubleshooting

**Clerk publishable key missing**

If the build fails with `Missing publishableKey`, make sure your environment variables are set in Vercel (and locally in `.env.local`).

---

## 📸 Screenshots

![alt text](./public/image.png)

---

## 📄 License

MIT
