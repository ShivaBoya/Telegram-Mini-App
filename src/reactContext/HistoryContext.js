// HistoryContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import {database} from "../services/FirebaseConfig"
import {  ref, onValue } from 'firebase/database';
import { useTelegram } from './TelegramContext';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const {user} = useTelegram()
  const userId = user.id
  
  useEffect(() => {
    if (!userId) return;

    const historyRef = ref(database, `history/${userId}`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      const formatted = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];
      setHistory(formatted.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <HistoryContext.Provider value={{ history }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  return useContext(HistoryContext);
};
