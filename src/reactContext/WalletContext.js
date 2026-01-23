import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { TonConnectUI } from '@tonconnect/ui';
import { addHistoryLog } from "../services/addHistory.js"


// Create context
const WalletContext = createContext({
  isConnected: false,
  walletAddress: '',
  tonBalance: null,
  usdEquivalent: null,
  transactions: [],
  connectWallet: () => { },
  disconnectWallet: () => { },
  isLoading: false
});


// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  // State
  const [isConnected, setIsConnected] = useState(() =>
    localStorage.getItem('wallet_connected') === 'true'
  );
  const [walletAddress, setWalletAddress] = useState(() =>
    localStorage.getItem('wallet_address') || ''
  );
  const [tonBalance, setTonBalance] = useState(() =>
    localStorage.getItem('ton_balance') || null
  );
  const [usdEquivalent, setUsdEquivalent] = useState(() =>
    localStorage.getItem('usd_equivalent') || null
  );
  const [transactions, setTransactions] = useState(() => {
    const savedTxs = localStorage.getItem('wallet_transactions');
    return savedTxs ? JSON.parse(savedTxs) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Ref to store TonConnectUI instance
  const tonConnectUIRef = useRef(null);

  // Clear wallet data
  const clearWalletData = React.useCallback(() => {
    setWalletAddress('');
    setIsConnected(false);
    setTonBalance(null);
    setUsdEquivalent(null);
    setTransactions([]);
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('ton_balance');
    localStorage.removeItem('usd_equivalent');
    localStorage.removeItem('wallet_transactions');
  }, []);

  // Update wallet data
  const updateWalletData = React.useCallback(async (address) => {
    setIsLoading(true);
    try {
      const balance = await fetchWalletBalance(address);
      if (balance !== null) {
        setTonBalance(balance);
        const rate = await fetchExchangeRate();
        setUsdEquivalent((balance * rate).toFixed(2));
      }

      const txs = await fetchTransactions(address);
      setTransactions(txs);
    } catch (error) {
      console.error("Error updating wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize TonConnect
  useEffect(() => {
    const initializeTonConnect = async () => {
      try {
        // Create TonConnectUI instance if it doesn't exist
        if (!tonConnectUIRef.current) {
          const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
          console.log("Initializing TonConnect with manifest:", manifestUrl);

          tonConnectUIRef.current = new TonConnectUI({
            manifestUrl: manifestUrl,
            walletsListConfiguration: {
              includeWallets: [],
              excludeWallets: ['okxTonWallet', 'okx-wallet', 'okx']
            }
          });

          // Set up status change listener
          tonConnectUIRef.current.onStatusChange(async (walletInfo) => {
            if (walletInfo && walletInfo.account) {
              const address = walletInfo.account.address.account_address || walletInfo.account.address;
              setWalletAddress(address);
              setIsConnected(true);

              // Update wallet data
              await updateWalletData(address);
            } else {
              // Wallet disconnected
              clearWalletData();
            }
          });
        }

        // Check if wallet is already connected
        const walletInfo = tonConnectUIRef.current.wallet;

        if (walletInfo && walletInfo.account) {
          // Wallet is connected
          const address = walletInfo.account.address.account_address || walletInfo.account.address;
          setWalletAddress(address);
          setIsConnected(true);

          // Update wallet data
          await updateWalletData(address);
        } else if (isConnected && walletAddress) {
          // We have stored connection info but TonConnect doesn't recognize it
          // Try to update wallet data anyway
          await updateWalletData(walletAddress);
        }
      } catch (error) {
        console.error("Error initializing TonConnect:", error);
      }
    };

    initializeTonConnect();
  }, [isConnected, updateWalletData, walletAddress, clearWalletData]);

  // Save state to localStorage
  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem('wallet_address', walletAddress);
    } else {
      localStorage.removeItem('wallet_address');
    }
  }, [walletAddress]);

  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('wallet_connected', 'true');
    } else {
      localStorage.removeItem('wallet_connected');
    }
  }, [isConnected]);

  useEffect(() => {
    if (tonBalance) {
      localStorage.setItem('ton_balance', tonBalance);
    } else {
      localStorage.removeItem('ton_balance');
    }
  }, [tonBalance]);

  useEffect(() => {
    if (usdEquivalent) {
      localStorage.setItem('usd_equivalent', usdEquivalent);
    } else {
      localStorage.removeItem('usd_equivalent');
    }
  }, [usdEquivalent]);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('wallet_transactions', JSON.stringify(transactions));
    } else {
      localStorage.removeItem('wallet_transactions');
    }
  }, [transactions]);

  // Fetch wallet balance
  async function fetchWalletBalance(address) {
    try {
      const response = await fetch(
        `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const rawBalance = Number(data.result);
      return rawBalance / 1e9; // nanoTON -> TON
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      return null;
    }
  }

  // Fetch exchange rate
  async function fetchExchangeRate() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=toncoin&vs_currencies=usd'
      );
      if (!response.ok) throw new Error(`Exchange rate API error: ${response.status}`);
      const data = await response.json();
      if (!data.toncoin || typeof data.toncoin.usd !== 'number') {
        throw new Error(`Unexpected data: ${JSON.stringify(data)}`);
      }
      return data.toncoin.usd;
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return 0;
    }
  }

  // Fetch transactions
  async function fetchTransactions(address) {
    try {
      const response = await fetch(
        `https://toncenter.com/api/v2/getTransactions?address=${address}&limit=10&archival=true`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      if (!data.result || !Array.isArray(data.result)) return [];

      return data.result.map(tx => ({
        ...tx,
        fee: tx.fee ? Number(tx.fee) / 1e9 : 0,
        storage_fee: tx.storage_fee ? Number(tx.storage_fee) / 1e9 : 0,
        other_fee: tx.other_fee ? Number(tx.other_fee) / 1e9 : 0,
        in_msg:
          tx.in_msg && tx.in_msg.value
            ? { ...tx.in_msg, value: Number(tx.in_msg.value) / 1e9 }
            : tx.in_msg,
        out_msgs: Array.isArray(tx.out_msgs)
          ? tx.out_msgs.map(msg =>
            msg.value
              ? { ...msg, value: Number(msg.value) / 1e9 }
              : msg
          )
          : []
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }



  // Connect wallet
  const connectWallet = async (userId) => {
    if (!tonConnectUIRef.current) return;

    try {
      setIsLoading(true);
      await tonConnectUIRef.current.openModal();
      const textData = {
        action: 'Wallet Successfully Connected',
        points: 10,
        type: 'wallet',
      }

      addHistoryLog(userId, textData)
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (!tonConnectUIRef.current) return;

    try {
      setIsLoading(true);
      await tonConnectUIRef.current.disconnect();
      clearWalletData();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose methods and state to components
  const value = {
    isConnected,
    walletAddress,
    tonBalance,
    usdEquivalent,
    transactions,
    connectWallet,
    disconnectWallet,
    isLoading
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
