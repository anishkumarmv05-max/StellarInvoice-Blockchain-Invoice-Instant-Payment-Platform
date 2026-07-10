# StellarInvoice — Blockchain Invoice & Instant Payment Platform

> A production-ready Stellar dApp where freelancers send verifiable invoices, clients pay with native XLM, and both parties instantly receive verified on-chain proof of payment without middleman fees.

## 🚀 Quick Links
- **Live Platform**: [stellarinvoice.vercel.app](https://stellar-invoice-blockchain-invoice.vercel.app/)
- **Demo Video**: [Watch the Demo](https://drive.google.com/file/d/1sc4nMw1qyj9_GPjLATc5YPyY8doUhJWp/view?usp=sharing)
- **Contract Deployment Address**: `C_PLACEHOLDER_FOR_YOUR_CONTRACT_ADDRESS`
- **User Feedback Form**: [StellarInvoice Feedback Form](https://drive.google.com/file/d/1sc4nMw1qyj9_GPjLATc5YPyY8doUhJWp/view?usp=sharing)
- **User Feedback Responses**: [View Responses Sheet Link](https://docs.google.com/spreadsheets/d/1jD1VyQGsv4al_rQYlEKw4ukA4BQpTca1t7f7HveapWY/edit?usp=sharing)

---

## Why this exists

Freelancers and small agencies face significant hurdles when dealing with international clients: high wire transfer fees, terrible forex conversion rates, and the constant anxiety of "has the payment been sent yet?" Invoicing is often disconnected from the actual payment layer.

Clients, on the other hand, want a secure, straightforward way to pay for services without registering for complex, traditional payment gateways that demand heavy KYC and transaction fees just to send money.

StellarInvoice solves this by natively merging the invoice with the payment. By leveraging the Stellar network, freelancers create an invoice, clients connect their Freighter wallet, and funds move directly peer-to-peer. It's fast, virtually feeless, and immediately provides transparent on-chain proof for both parties.

## How money actually moves

```
   Client                                            Freelancer
      │  payInvoiceWithXLM()                            ▲
      ▼                                                 │  
┌──────────────────────┐                                │ 
│ Stellar Testnet      │  native XLM transfer          │
│ (Horizon API)        │                               │
└──────────────────────┘                                │
      │  transaction settles                             │
      └─────────────────────────────────────────────────┘
```

- **Client → network**: `payInvoiceWithXLM()` pulls XLM from the client's Freighter wallet, executing a native Stellar payment operation to the freelancer's wallet.
- **Network → freelancer**: The transaction is confirmed on the testnet within 5 seconds, and funds appear instantly in the freelancer's wallet.
- Every invoice payment produces a real `txHash` you can look up on [stellar.expert](https://stellar.expert/explorer/testnet).

## Architecture

```
frontend/   React + Vite + Tailwind CSS — responsive dual-role dashboards
backend/    Node.js + Express + MongoDB — auth, invoice generation, API
contracts/  Soroban (Rust) — smart contract (CI/CD integrated)
```

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Wallet | Freighter |
| Blockchain | Stellar Testnet |
| Smart Contract | Soroban (Rust) |
| Deployment | Vercel (frontend) + Render (backend) |

## Product Screenshots

### Product UI
- **Dashboard Overview**:
  *(Add your dashboard screenshot here)*
  
### Mobile Responsive Design
- **Mobile View**: Fully responsive across all devices.
  *(Add your mobile screenshot here)*

### Invoice Detail View
- **Payment View**:
  *(Add your invoice screenshot here)*

## Users Onboarded

Below is the list of users who actively tested the platform and provided feedback:

${table1}

## Feedback Implementation

Based on the feedback collected, the following core improvements were implemented directly into the product to enhance user experience:

${table2}

## Onchain Proof of Wallet Interactions

Below is the verified ledger of real testnet transactions, showing client payments against freelancer invoices, verified entirely on the Stellar Explorer:

${table3}
