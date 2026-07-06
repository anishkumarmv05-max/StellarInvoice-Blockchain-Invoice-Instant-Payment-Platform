import { useEffect, useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";

export default function LiveBalance({ walletAddress }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

    const fetchBalance = async () => {
      try {
        const account = await server.loadAccount(walletAddress);
        const nativeBalance = account.balances.find((b) => b.asset_type === "native");
        if (nativeBalance) {
          // Format to 2 decimal places for cleaner UI
          setBalance(parseFloat(nativeBalance.balance).toFixed(2));
        } else {
          setBalance("0.00");
        }
      } catch (err) {
        console.error("Failed to load account balance", err);
        setBalance("0.00");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchBalance();

    // Listen to all payments for this account to update balance in real time
    const stream = server.payments().forAccount(walletAddress).stream({
      onmessage: () => {
        // Fetch fresh balance from ledger to avoid manual math with fees
        fetchBalance();
      },
      onerror: (err) => {
        console.error("Stream error", err);
      },
    });

    return () => {
      // Close stream on component unmount
      if (stream) stream();
    };
  }, [walletAddress]);

  if (!walletAddress || loading) return null;

  return (
    <div className="flex items-center gap-2 bg-stellar-purple/10 text-stellar-purple px-3 py-1 rounded-full font-medium text-sm border border-stellar-purple/20">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>{balance} XLM</span>
    </div>
  );
}
