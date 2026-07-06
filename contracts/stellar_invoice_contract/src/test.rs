#![cfg(test)]
use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{Env, String};

#[test]
fn test_create_and_get_invoice() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, StellarInvoiceContract);
    let client = StellarInvoiceContractClient::new(&env, &contract_id);

    let freelancer = Address::generate(&env);
    let invoice_id = String::from_str(&env, "INV-001");

    client.create_invoice(&invoice_id, &freelancer, &1000, &1893456000);

    let invoice = client.get_invoice(&invoice_id);
    assert_eq!(invoice.amount, 1000);
    assert_eq!(invoice.status, InvoiceStatus::Created);
}

#[test]
fn test_pay_invoice_flow() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, StellarInvoiceContract);
    let client = StellarInvoiceContractClient::new(&env, &contract_id);

    let freelancer = Address::generate(&env);
    let payer = Address::generate(&env);
    let invoice_id = String::from_str(&env, "INV-002");

    client.create_invoice(&invoice_id, &freelancer, &500, &1893456000);
    client.pay_invoice(&invoice_id, &payer);

    let invoice = client.get_invoice(&invoice_id);
    assert_eq!(invoice.status, InvoiceStatus::Paid);
    assert_eq!(invoice.payer, Some(payer));
}

#[test]
fn test_cannot_double_pay() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, StellarInvoiceContract);
    let client = StellarInvoiceContractClient::new(&env, &contract_id);

    let freelancer = Address::generate(&env);
    let payer = Address::generate(&env);
    let invoice_id = String::from_str(&env, "INV-003");

    client.create_invoice(&invoice_id, &freelancer, &500, &1893456000);
    client.pay_invoice(&invoice_id, &payer);

    let result = client.try_pay_invoice(&invoice_id, &payer);
    assert!(result.is_err());
}

#[test]
fn test_cancel_invoice() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, StellarInvoiceContract);
    let client = StellarInvoiceContractClient::new(&env, &contract_id);

    let freelancer = Address::generate(&env);
    let invoice_id = String::from_str(&env, "INV-004");

    client.create_invoice(&invoice_id, &freelancer, &500, &1893456000);
    client.cancel_invoice(&invoice_id);

    let invoice = client.get_invoice(&invoice_id);
    assert_eq!(invoice.status, InvoiceStatus::Cancelled);
}

#[test]
fn test_duplicate_invoice_id_fails() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, StellarInvoiceContract);
    let client = StellarInvoiceContractClient::new(&env, &contract_id);

    let freelancer = Address::generate(&env);
    let invoice_id = String::from_str(&env, "INV-005");

    client.create_invoice(&invoice_id, &freelancer, &500, &1893456000);
    let result = client.try_create_invoice(&invoice_id, &freelancer, &500, &1893456000);
    assert!(result.is_err());
}
