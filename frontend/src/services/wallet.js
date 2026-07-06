import freighterApi from "@stellar/freighter-api";

// Handle CJS/ESM interop properly
const freighter = freighterApi.default || freighterApi;

export async function connectFreighter() {
  const connected = freighter.isConnected ? await freighter.isConnected() : false;
  const isConn = typeof connected === 'object' ? connected.isConnected : connected;
  if (!isConn) {
    throw new Error("Freighter is not installed. Get it at https://freighter.app");
  }

  if (freighter.isAllowed) {
    const allowed = await freighter.isAllowed();
    const isAll = typeof allowed === 'object' ? allowed.isAllowed : allowed;
    if (!isAll && freighter.setAllowed) {
      await freighter.setAllowed();
    }
  }

  let accessObj;
  try {
    if (freighter.requestAccess) {
      accessObj = await freighter.requestAccess();
      if (accessObj && typeof accessObj === 'object' && accessObj.error) {
        throw new Error(accessObj.error);
      }
    }
  } catch (e) {
    throw new Error(e);
  }

  let addressObj;
  let publicKey = '';
  try {
    if (typeof freighter.getAddress === 'function') {
      addressObj = await freighter.getAddress();
      if (addressObj && typeof addressObj === 'object' && addressObj.error) {
        throw new Error(addressObj.error);
      }
      publicKey = typeof addressObj === 'object' ? addressObj.address : addressObj;
    } else if (typeof freighter.getPublicKey === 'function') {
      const pubKey = await freighter.getPublicKey();
      publicKey = typeof pubKey === 'object' ? pubKey.publicKey : pubKey;
    } else {
      // In older versions, requestAccess returned the public key directly
      publicKey = typeof accessObj === 'object' ? accessObj.address : accessObj;
    }
  } catch (e) {
    throw new Error(e);
  }

  let networkObj;
  let network = 'TESTNET';
  try {
    if (freighter.getNetwork) {
      networkObj = await freighter.getNetwork();
      network = typeof networkObj === 'object' ? networkObj.network : networkObj;
    }
  } catch (e) {
    console.error(e);
  }
  
  const networkPassphrase = typeof networkObj === 'object' ? networkObj.networkPassphrase : (network === 'TESTNET' ? 'Test SDF Network ; September 2015' : 'Public Global Stellar Network ; September 2015');

  return {
    publicKey,
    network,
    networkPassphrase,
  };
}

export async function signXDR(xdr, networkPassphrase) {
  let result;
  try {
    if (freighter.signTransaction) {
      result = await freighter.signTransaction(xdr, { networkPassphrase });
      if (result && typeof result === 'object' && result.error) {
        throw new Error(result.error);
      }
    } else {
      throw new Error("signTransaction is not available in freighter API");
    }
  } catch(e) {
    throw new Error(e);
  }
  
  const signedXdr = typeof result === 'object' ? result.signedTxXdr : result;
  return signedXdr;
}
