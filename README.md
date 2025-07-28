# FreeShipFast - SaaS Boilerplate

A modern SaaS boilerplate built with Next.js 15, featuring Prisma + Better Auth for a robust development experience.

## 🚀 Features

- **Authentication**: Better Auth with social login (Google) and magic links
- **Database**: PostgreSQL with Prisma ORM for type safety and migrations
- **Payments**: Stripe and LemonSqueezy integration
- **UI Components**: Radix UI with Tailwind CSS
- **Email**: Resend, Nodemailer, or SendGrid support
- **Analytics**: Umami and PostHog integration
- **Rate Limiting**: Upstash Redis for API protection
- **SEO Optimized**: Built-in metadata and OpenGraph support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS + Radix UI
- **Email**: Resend (configurable)
- **Payments**: LemonSqueezy (configurable to Stripe)
- **Deployment**: Vercel ready

## 📋 Prerequisites

- Node.js 18+ and bun/npm
- PostgreSQL database
- Google OAuth credentials (for social login)

## 🚀 Quick Start

1. **Clone and install**

```bash
git clone <repo-url>
cd free-ship-fast
bun install
```

2. **Environment setup**

```bash
cp .env.example .env.local
```

3. **Configure environment variables**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (choose one)
RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Payments (choose one)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

LEMONSQUEEZY_API_KEY=""
LEMONSQUEEZY_STORE_ID=""
LEMONSQUEEZY_WEBHOOK_SECRET=""

# Analytics (optional)
UMAMI_WEBSITE_ID=""
UMAMI_URL=""

POSTHOG_KEY=""
POSTHOG_HOST=""

# Rate Limiting (optional)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Database setup**

```bash
# Generate Prisma client and run migrations
bun db:generate
bun db:push
```

5. **Run development server**

```bash
bun dev
```

## 📁 Project Structure

```
free-ship-fast/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Protected dashboard pages
│   ├── api/             # API routes
│   └── globals.css      # Global styles
├── components/
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── landing/         # Landing page components
│   ├── ui/              # Reusable UI components
│   └── shared/          # Shared components
├── lib/
│   ├── auth.ts          # Better Auth configuration
│   ├── db/              # Database client
│   ├── stripe/          # Stripe utilities
│   ├── lemonSqueezy/    # LemonSqueezy utilities
│   ├── email/           # Email configuration
│   └── schemas/         # Zod validation schemas
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── prisma/              # Database schema and migrations
└── scripts/             # Setup and deployment scripts
```

## 🗄️ Database Schema

The boilerplate uses Prisma with PostgreSQL. Key models include:

- **User**: Authentication and profile data
- **Waitlist**: Email collection for landing pages
- **Session**: Better Auth session management

## 🔐 Authentication

Built with Better Auth featuring:

- **Social Login**: Google OAuth (easily extendable)
- **Magic Links**: Passwordless authentication
- **Session Management**: Secure cookie-based sessions
- **Type Safety**: Full TypeScript integration

## 💳 Payments

Supports both Stripe and LemonSqueezy:

- **Stripe**: Traditional payment processing
- **LemonSqueezy**: Modern payment platform with better international support
- **Webhooks**: Automatic subscription management
- **Customer Portal**: Self-service billing management

## 🎨 UI Components

- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Beautiful component library
- **Dark Mode**: Built-in theme switching
- **Responsive**: Mobile-first design

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform.

## 🔧 Configuration

### Switching Payment Providers

Update `config.ts`:

```js
services: {
  payment: 'stripe', // or 'lemonsqueezy'
}
```

### Email Configuration

Choose your email provider in `config.ts`:

```js
services: {
  email: 'resend', // or 'nodemailer' or 'sendgrid'
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- Create an issue for bug reports
- Join our Discord for community support
- Check the documentation for detailed guides

---

Built with ❤️ using modern web technologies.
