# Free Ship Fast 🚀

> A blazing-fast, full-stack Next.js boilerplate to build and ship your SaaS for free. Get to market faster with zero upfront costs.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS v4
- **Authentication**: Better-Auth (Google OAuth + Magic Link)
- **Database**: MongoDB / PostgreSQL / Supabase (configurable)
- **Email**: Resend
- **Payments**: Stripe / LemonSqueezy (configurable)
- **Analytics**: Umami / PostHog (configurable)
- **Schema Validation**: Zod
- **Rate Limiting**: Upstash Redis
- **Deployment**: Vercel / Netlify

## ✨ Features

- 🔐 **Multi-provider authentication** with Google OAuth and magic links
- 💳 **Payment processing** with Stripe or LemonSqueezy
- 📊 **Analytics integration** with Umami or PostHog
- 🎨 **Pre-built landing page components** (Hero, Pricing, Testimonials, Features, CTA)
- 🛡️ **Rate limiting** with Upstash Redis
- 📧 **Email system** with Resend
- 🔄 **Database abstraction** layer for easy provider switching
- 📱 **Responsive design** with Tailwind CSS v4
- 🎯 **Type-safe** with TypeScript and Zod validation
- 💰 **Free-tier optimized** for zero-cost launches

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/MVP-LaunchPad-Labs/free-ship-fast.git
cd free-ship-fast

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run interactive setup
npm run setup

# Start development server
npm run dev
```

## 🔧 Environment Configuration

Create a `.env.local` file with your configuration:

```env
# Database (choose one)
DATABASE_URL_MONGODB="mongodb://localhost:27017/free-ship-fast"
DATABASE_URL_POSTGRESQL="postgresql://user:password@localhost:5432/free-ship-fast"
SUPABASE_URL=""
SUPABASE_ANON_KEY=""

# Authentication
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email
RESEND_API_KEY=""
RESEND_FROM_EMAIL="noreply@freeshipfast.com"

# Payments (choose one)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

LEMONSQUEEZY_API_KEY=""
LEMONSQUEEZY_STORE_ID=""
LEMONSQUEEZY_WEBHOOK_SECRET=""

# Analytics (choose one)
UMAMI_WEBSITE_ID=""
UMAMI_URL=""

POSTHOG_KEY=""
POSTHOG_HOST=""

# Rate Limiting
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DATABASE_TYPE="mongodb"
NEXT_PUBLIC_PAYMENT_PROVIDER="stripe"
NEXT_PUBLIC_ANALYTICS_PROVIDER="umami"
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
│   ├── auth/            # Authentication configuration
│   ├── db/              # Database adapters
│   ├── payments/        # Payment providers
│   ├── analytics/       # Analytics providers
│   ├── email/           # Email configuration
│   └── schemas/         # Zod validation schemas
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── scripts/             # Setup and deployment scripts
```

## 🔄 Database Setup

The boilerplate supports multiple database providers. Choose your preferred option:

```bash
# MongoDB setup
npm run db:setup -- --provider=mongodb

# PostgreSQL setup
npm run db:setup -- --provider=postgresql

# Supabase setup
npm run db:setup -- --provider=supabase
```

## 🎨 Landing Page Components

Pre-built, customizable components for your landing page:

- **Hero Section**: Multiple variants (centered, split, with video)
- **Features**: Icon grid, alternating sections, and cards
- **Pricing**: Simple, tiered, and comparison tables
- **Testimonials**: Grid, carousel, and featured layouts
- **CTA**: Inline, full-width, and popup variants

## 💳 Payment Integration

Switch between payment providers easily:

```typescript
// Stripe
NEXT_PUBLIC_PAYMENT_PROVIDER = 'stripe';

// LemonSqueezy
NEXT_PUBLIC_PAYMENT_PROVIDER = 'lemonsqueezy';
```

Both providers include:

- Subscription management
- One-time payments
- Webhook handling
- Customer portal

## 📊 Analytics

Track your SaaS metrics with:

```typescript
// Umami
NEXT_PUBLIC_ANALYTICS_PROVIDER = 'umami';

// PostHog
NEXT_PUBLIC_ANALYTICS_PROVIDER = 'posthog';
```

## 🚀 Deployment

Deploy to your preferred platform:

```bash
# Vercel
npm run deploy:vercel

# Netlify
npm run deploy:netlify

# Custom deployment
npm run build
npm start
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run setup        # Interactive configuration
npm run db:setup     # Database setup
npm run db:migrate   # Run database migrations
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔐 Authentication Features

- **Email/Password** with verification
- **Google OAuth** integration
- **Magic Link** authentication
- **Session management**
- **Protected routes**
- **Role-based access**

## 🛡️ Security Features

- **Rate limiting** with Upstash Redis
- **CSRF protection**
- **Input validation** with Zod schemas
- **Secure headers**
- **Environment variable validation**

## 💰 Free-Tier Strategy

Optimized for zero-cost launches:

- **Vercel**: Free hosting for hobby projects
- **Supabase**: Free tier with 500MB database
- **Upstash Redis**: Free tier with 10K requests/day
- **Resend**: Free tier with 3K emails/month
- **Umami**: Self-hosted analytics (free)

## 📖 Documentation

- [Authentication Setup](docs/auth.md)
- [Database Configuration](docs/database.md)
- [Payment Integration](docs/payments.md)
- [Deployment Guide](docs/deployment.md)
- [Customization Guide](docs/customization.md)
- [Free-Tier Guide](docs/free-tier.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Better-Auth](https://www.better-auth.com) for authentication
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Vercel](https://vercel.com) for hosting and deployment
- [MVP LaunchPad Labs](https://github.com/MVP-LaunchPad-Labs) for the vision

---

**Ready to ship fast for free?** 🚀 Launch your SaaS without breaking the bank.
