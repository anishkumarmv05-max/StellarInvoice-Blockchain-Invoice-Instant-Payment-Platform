import * as StellarSdk from "@stellar/stellar-sdk";
import { signXDR } from "./wallet";

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Builds a native XLM payment transaction, has Freighter sign it,
 * submits it to Stellar testnet, and returns the transaction hash.
 */
export async function payInvoiceWithXLM({ senderPublicKey, receiverPublicKey, amount, memo }) {
  const account = await server.loadAccount(senderPublicKey);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: receiverPublicKey,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      })
    )
    .addMemo(StellarSdk.Memo.text(memo?.slice(0, 28) || "StellarInvoice"))
    .setTimeout(120)
    .build();

  const signedXdr = await signXDR(transaction.toXDR(), NETWORK_PASSPHRASE);

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(signedTx);

  return result.hash;
}
