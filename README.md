# StellarInvoice — Instant Blockchain Invoicing for Freelancers

Freelancers create invoices, clients pay in XLM on the Stellar network, and both
sides can verify payment status via an on-chain transaction hash — no banks,
no delayed cross-border transfers, no disputes about "did you pay yet?"

## Problem Statement

Freelancers and small businesses lose time and money to delayed international
payments, high transaction fees, and disputes over whether an invoice was
actually paid. Traditional invoicing tools are disconnected from the payment
rail itself, so "paid" status is just a manual checkbox someone can forget
to tick — or lie about.

## Why Stellar

Stellar settles payments in ~5 seconds for a fraction of a cent, natively
supports asset transfers without needing a custom token, and — via Soroban —
lets us record invoice and payment state in a smart contract so status is
independently verifiable by both freelancer and client, not just trusted from
a centralized database.

## Features

- Freelancer & client accounts with role-based dashboards
- Freighter wallet connection (browser extension signing, no private keys touch our servers)
- Invoice creation with line items, due dates, auto-calculated totals
- Public shareable invoice links (clients don't need an account to view/pay)
- Real XLM payment on Stellar testnet, signed client-side via Freighter
- Server-side verification of transactions against Horizon before marking an invoice paid (prevents spoofed tx hashes)
- Downloadable PDF invoices and receipts with embedded transaction hash
- Admin analytics dashboard (users, invoices, payment volume, feedback)
- Feedback collection form
- Soroban smart contract mirroring invoice lifecycle on-chain (Created → Paid/Cancelled)

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Wallet | Freighter |
| Blockchain | Stellar Testnet + Soroban |
| PDF | jsPDF |
| Deployment | Vercel (frontend) + Render (backend) |

## Architecture

```
Client (React) ──HTTP──▶ Express API ──▶ MongoDB (users, invoices, payments, feedback)
      │                                          │
      └── Freighter (sign tx) ──▶ Stellar Horizon (submit payment) ──▶ verified by backend
```

The backend never signs or holds private keys. All signing happens in the
user's browser via Freighter. The backend's only trust-sensitive job is
verifying a submitted `txHash` actually exists and succeeded on Horizon
before flipping an invoice's status to `paid` — this stops a client from
just POSTing a fake hash.

## Smart Contract Flow

```
Freelancer creates invoice (on-chain + DB)
        ↓
Client opens public invoice link
        ↓
Client connects Freighter wallet
        ↓
Client signs & submits XLM payment on Stellar testnet
        ↓
Backend verifies tx on Horizon → records Payment → Invoice.status = "paid"
        ↓
Receipt (with tx hash) available for download
```

Contract functions: `create_invoice`, `pay_invoice`, `mark_paid`,
`cancel_invoice`, `get_invoice`. See `contracts/stellar_invoice_contract/src/lib.rs`.

## Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Rust + `stellar-cli` (for the contract) — https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup
- Freighter browser extension — https://freighter.app

### Backend

```bash
cd backend
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Visit `http://localhost:5173`.

### Smart Contract

```bash
cd contracts/stellar_invoice_contract
cargo test
stellar contract build
stellar contract deploy \
  --wasm target/wasm32v1-none/release/stellar_invoice_contract.wasm \
  --source alice \
  --network testnet
```

Copy the resulting contract ID into `backend/.env` as `CONTRACT_ID`.

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
CONTRACT_ID=
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

## API Routes

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
PATCH  /api/users/wallet

POST   /api/invoices
GET    /api/invoices
GET    /api/invoices/:id
PATCH  /api/invoices/:id
DELETE /api/invoices/:id

POST   /api/payments
GET    /api/payments/:invoiceId

POST   /api/feedback
GET    /api/feedback         (admin only)
GET    /api/admin/stats      (admin only)
```

## Contract Address

`(fill in after deployment)`
Network: Stellar Testnet
Deployment tx: `(fill in)`

## Demo Video

`(add your link)`

## Screenshots

`(add: desktop UI, mobile responsive view, admin analytics, monitoring dashboard)`

## User Feedback Summary

`(fill in after onboarding your 10 real users — average rating, common themes)`

## Future Roadmap

- Multi-currency support beyond native XLM (USDC via Soroban token contracts)
- Recurring/subscription invoices
- Escrow-style milestone payments using Soroban
- Email notifications on invoice sent/paid/overdue
- Team accounts for agencies
