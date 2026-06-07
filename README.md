# PolyOdin

Professional prediction market auto-trading platform built on Next.js 14, connecting to Polymarket for real-time market data and trade execution.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, shadcn/ui
- **Web3**: wagmi, viem, SIWE authentication
- **Backend**: Prisma ORM, PostgreSQL, Redis/KV cache
- **Payments**: Stripe (Apple Pay), SendGrid (emails)
- **Monitoring**: Sentry, Vercel Analytics
- **Testing**: Jest, Playwright
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- MetaMask browser extension

### Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in your values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run database migrations:
   ```bash
   npm run db:migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

See `.env.example` for all required environment variables.

## API Documentation

All 31 API endpoints are documented in the `app/api/` directory. Each route uses consistent response shapes via `lib/api-response.ts`.

## Deployment

The project is configured for Vercel deployment. Connect your GitHub repository to Vercel and configure environment variables.

## Security

- MetaMask + SIWE authentication
- JWT sessions with 15-minute expiration
- Rate limiting (100 req/min per user)
- CORS, CSP, and security headers
- Audit logging for all sensitive operations
