#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env, String};

#[derive(Clone, Debug, Eq, PartialEq, PartialOrd, Ord, contracttype)]
pub enum InvoiceStatus {
    Created,
    Sent,
    Paid,
    Cancelled,
    Expired,
}

#[derive(Clone, contracttype)]
pub struct Invoice {
    pub invoice_id: String,
    pub freelancer: Address,
    pub amount: i128,
    pub due_date: u64,
    pub status: InvoiceStatus,
    pub payer: Option<Address>,
    pub paid_at: Option<u64>,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum ContractError {
    InvoiceAlreadyExists = 1,
    InvoiceNotFound = 2,
    InvoiceAlreadyPaid = 3,
    InvoiceCancelled = 4,
    Unauthorized = 5,
    InvalidAmount = 6,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Invoice(String),
}

#[contract]
pub struct StellarInvoiceContract;

#[contractimpl]
impl StellarInvoiceContract {
    /// Freelancer creates a new invoice on-chain. Must be authorized by the freelancer.
    pub fn create_invoice(
        env: Env,
        invoice_id: String,
        freelancer: Address,
        amount: i128,
        due_date: u64,
    ) -> Result<(), ContractError> {
        freelancer.require_auth();

        if amount <= 0 {
            return Err(ContractError::InvalidAmount);
        }

        let key = DataKey::Invoice(invoice_id.clone());
        if env.storage().persistent().has(&key) {
            return Err(ContractError::InvoiceAlreadyExists);
        }

        let invoice = Invoice {
            invoice_id,
            freelancer,
            amount,
            due_date,
            status: InvoiceStatus::Created,
            payer: None,
            paid_at: None,
        };

        env.storage().persistent().set(&key, &invoice);
        Ok(())
    }

    /// Client pays the invoice. Must be authorized by the paying client.
    /// Note: actual XLM transfer happens via a Stellar classic payment operation
    /// in the same transaction (built client-side); this call records payment state on-chain.
    pub fn pay_invoice(env: Env, invoice_id: String, client: Address) -> Result<(), ContractError> {
        client.require_auth();

        let key = DataKey::Invoice(invoice_id.clone());
        let mut invoice: Invoice = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::InvoiceNotFound)?;

        match invoice.status {
            InvoiceStatus::Paid => return Err(ContractError::InvoiceAlreadyPaid),
            InvoiceStatus::Cancelled => return Err(ContractError::InvoiceCancelled),
            _ => {}
        }

        invoice.status = InvoiceStatus::Paid;
        invoice.payer = Some(client);
        invoice.paid_at = Some(env.ledger().timestamp());

        env.storage().persistent().set(&key, &invoice);
        Ok(())
    }

    /// Freelancer manually marks invoice as paid (e.g. off-chain payment reconciliation).
    pub fn mark_paid(env: Env, invoice_id: String) -> Result<(), ContractError> {
        let key = DataKey::Invoice(invoice_id.clone());
        let mut invoice: Invoice = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::InvoiceNotFound)?;

        invoice.freelancer.require_auth();

        invoice.status = InvoiceStatus::Paid;
        invoice.paid_at = Some(env.ledger().timestamp());
        env.storage().persistent().set(&key, &invoice);
        Ok(())
    }

    /// Freelancer cancels an unpaid invoice.
    pub fn cancel_invoice(env: Env, invoice_id: String) -> Result<(), ContractError> {
        let key = DataKey::Invoice(invoice_id.clone());
        let mut invoice: Invoice = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::InvoiceNotFound)?;

        invoice.freelancer.require_auth();

        if invoice.status == InvoiceStatus::Paid {
            return Err(ContractError::InvoiceAlreadyPaid);
        }

        invoice.status = InvoiceStatus::Cancelled;
        env.storage().persistent().set(&key, &invoice);
        Ok(())
    }

    /// Anyone can read invoice state — this is what powers "verify payment status" for both sides.
    pub fn get_invoice(env: Env, invoice_id: String) -> Result<Invoice, ContractError> {
        let key = DataKey::Invoice(invoice_id);
        env.storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::InvoiceNotFound)
    }
}

mod test;
