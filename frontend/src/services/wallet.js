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
  const isConn = typeof connected === 'object' ? connected.isConnected : connected;
  if (!isConn) {
    throw new Error("Freighter is not installed. Get it at https://freighter.app");
  }

  const allowed = await isAllowed();
  const isAll = typeof allowed === 'object' ? allowed.isAllowed : allowed;
  if (!isAll) {
    await setAllowed();
  }

  let accessObj;
  try {
    accessObj = await requestAccess();
    if (accessObj && typeof accessObj === 'object' && accessObj.error) {
      throw new Error(accessObj.error);
    }
  } catch (e) {
    throw new Error(e);
  }

  let addressObj;
  try {
    addressObj = await getAddress();
    if (addressObj && typeof addressObj === 'object' && addressObj.error) {
      throw new Error(addressObj.error);
    }
  } catch (e) {
    throw new Error(e);
  }
  const publicKey = typeof addressObj === 'object' ? addressObj.address : addressObj;

  let networkObj;
  try {
    networkObj = await getNetwork();
  } catch (e) {
    console.error(e);
  }
  const network = typeof networkObj === 'object' ? networkObj.network : networkObj;
  const networkPassphrase = typeof networkObj === 'object' ? networkObj.networkPassphrase : (network === 'TESTNET' ? 'Test SDF Network ; September 2015' : 'Public Global Stellar Network ; September 2015');

  return {
    publicKey,
    network,
    networkPassphrase,
  };
}

export async function signXDR(xdr, networkPassphrase) {
  const result = await signTransaction(xdr, { networkPassphrase });
  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}
