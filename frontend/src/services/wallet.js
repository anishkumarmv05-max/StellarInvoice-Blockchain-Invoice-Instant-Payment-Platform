import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";

export async function connectFreighter() {
  const connected = await isConnected();
  if (!connected.isConnected) {
    throw new Error("Freighter is not installed. Get it at https://freighter.app");
  }

  const allowed = await isAllowed();
  if (!allowed.isAllowed) {
    await setAllowed();
  }

  const accessObj = await requestAccess();
  if (accessObj.error) throw new Error(accessObj.error);

  const addressObj = await getAddress();
  if (addressObj.error) throw new Error(addressObj.error);

  const networkObj = await getNetwork();

  return {
    publicKey: addressObj.address,
    network: networkObj.network,
    networkPassphrase: networkObj.networkPassphrase,
  };
}

export async function signXDR(xdr, networkPassphrase) {
  const result = await signTransaction(xdr, { networkPassphrase });
  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}
