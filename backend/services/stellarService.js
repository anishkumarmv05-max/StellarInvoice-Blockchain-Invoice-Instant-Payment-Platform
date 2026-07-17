const { Contract, rpc } = require("@stellar/stellar-sdk");

const rpcUrl = process.env.SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
const contractId = process.env.CONTRACT_ID || "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM";

const server = new rpc.Server(rpcUrl, { allowHttp: true });

class StellarService {
  constructor() {
    this.contract = new Contract(contractId);
  }

  async create_invoice(invoiceId, freelancer, amount, dueDate) {
    console.log(`[StellarService] create_invoice called for ${invoiceId}`);
    // Here you would use server.prepareTransaction() and submit
    return { success: true };
  }

  async pay_invoice(invoiceId, client) {
    console.log(`[StellarService] pay_invoice called for ${invoiceId} by ${client}`);
    return { success: true };
  }

  async mark_paid(invoiceId) {
    console.log(`[StellarService] mark_paid called for ${invoiceId}`);
    return { success: true };
  }

  async cancel_invoice(invoiceId) {
    console.log(`[StellarService] cancel_invoice called for ${invoiceId}`);
    return { success: true };
  }

  async get_invoice(invoiceId) {
    console.log(`[StellarService] get_invoice called for ${invoiceId}`);
    // Simulate getting invoice data from Soroban
    return { invoice_id: invoiceId, status: "Created" };
  }
}

module.exports = new StellarService();
