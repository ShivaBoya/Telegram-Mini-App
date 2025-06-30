import {  ref, push, set } from 'firebase/database';
import { database } from './FirebaseConfig';



export const addHistoryLog = async (userId, { action, points, type }) => {

  const historyRef = ref(database, `history/${userId}`); 
  console.log(action,points,type)

  // Generate a new history log reference (Firebase generates a unique key)
  const newHistoryRef = push(historyRef);

  const historyId = newHistoryRef.key; // <-- This is the unique ID

  const logData = {
    id: historyId,
    action,
    points,
    type, 
    timestamp: Date.now(),
  };

  await set(newHistoryRef, logData);
};
