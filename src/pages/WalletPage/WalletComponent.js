import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Zap,
  Wallet as WalletIcon,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useWallet } from '../../reactContext/WalletContext';
import { useTelegram } from '../../reactContext/TelegramContext';


export default function WalletComponent() {
  // Get wallet state and methods from context
  const {user} = useTelegram()

const userId = user.id
  const {
    isConnected,
    walletAddress,
    tonBalance,
    usdEquivalent,
    transactions,
    connectWallet,
    disconnectWallet,
    isLoading
  } = useWallet();

  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  // Renders a single transaction item.
  const renderTransaction = (tx) => {
    let transactionType = 'Unknown';
    if (
      tx.in_msg &&
      tx.in_msg.destination &&
      tx.in_msg.destination.toLowerCase() === walletAddress.toLowerCase()
    ) {
      transactionType = 'Received';
    } else if (tx.out_msgs && tx.out_msgs.length > 0) {
      if (
        tx.out_msgs.some(
          (msg) =>
            msg.source &&
            msg.source.toLowerCase() === walletAddress.toLowerCase()
        )
      ) {
        transactionType = 'Sent';
      } else {
        transactionType = 'Sent';
      }
    } else {
      transactionType =
        tx.in_msg && Number(tx.in_msg.value) > 0 ? 'Received' : 'Sent';
    }

    const icon =
      transactionType === 'Sent'
        ? '✅'
        : transactionType === 'Received'
        ? '📥'
        : '';
    const date = tx.utime
      ? new Date(tx.utime * 1000).toLocaleString()
      : 'Unknown date';
    const value = tx.in_msg && tx.in_msg.value ? Number(tx.in_msg.value) : 0;
    const fee = tx.fee ? Number(tx.fee) : 0;

    return (
      <li
        key={tx.utime || Math.random()}
        className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow text-white"
      >
        <div className="flex flex-col gap-1">
          <div>
            <strong>Type:</strong> {transactionType} {icon}
          </div>
          <div>
            <strong>Date:</strong> {date}
          </div>
          <div>
            <strong>Fee:</strong> {fee.toFixed(4)} TON
          </div>
          <div>
            <strong>Value:</strong> {value.toFixed(4)} TON
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Circles */}
        <div className="absolute top-[10%] left-[15%] w-32 h-32 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
        <div
          className="absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-purple-500/10 blur-xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-[20%] left-[25%] w-36 h-36 rounded-full bg-pink-500/10 blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        {/* SVG Grid Lines */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#smallGrid)" />
                <path
                  d="M 80 0 L 0 0 0 80"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.8"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div> 
      

      {/* Top Navbar */}
      <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-md p-4 border-b border-white/20 flex items-center justify-between">
        {/* Left: Back Arrow + Title */}
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-full text-white hover:bg-white/10 p-1">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-white">Wallet</h1>
        </div>

      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 z-10 flex flex-col items-center justify-center">
        {/* Not connected: Show Connect Wallet Card */}
        {!isConnected && (
          <div className="max-w-sm w-full text-white text-center">
            <WalletIcon className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2 text-white">Connect Your Wallet</h2>
            <p className="text-sm text-white/70 mb-6">
              Connect your TON wallet to view your balance and transactions
            </p>
            
            {/* Custom Connect Button */}
            <button
              onClick={()=>connectWallet(userId)}
              disabled={isLoading}
              className="max-w-xs mx-auto py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <WalletIcon className="h-4 w-4" />
                  Connect TON Wallet
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Connected: Show Wallet Info and Transactions */}
        {isConnected && (
          <div className="w-full space-y-6">
            {/* Wallet Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow text-white">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">Wallet Information</h2>
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-white/70" />}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                <div className="text-3xl font-bold">{tonBalance}</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">TON</span>
                  <span className="text-sm">
                    ≈ $<span>{usdEquivalent}</span>
                  </span>
                </div>
              </div>
              
              <div className="mt-3 text-sm text-white/70 break-all">
                <div className="flex items-center justify-between">
                  <span><strong>Address:</strong> {formatAddress(walletAddress)}</span>
                  <a 
                    href={`https://tonscan.org/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
            {/* Disconnect button */}
            <div className="flex justify-center">
              <button
                onClick={disconnectWallet}
                disabled={isLoading}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Disconnect Wallet'
                )}
              </button>
            </div>
            {/* Transactions */}
            <div className="backdrop-blur-md rounded-lg p-6 shadow text-white">
              <h2 className="text-xl font-bold mb-4 text-white">Recent Activity</h2>
              <ul className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map(tx => renderTransaction(tx))
                ) : (
                  <li className="text-white/70 text-center py-4">
                    {isLoading ? 'Loading transactions...' : 'No transactions found.'}
                  </li>
                )}
              </ul>
            </div>
            
            
          </div>
        )}
      </main>
    </div>
  );
}

