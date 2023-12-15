import { isValidTimestamp } from "@firebase/util";
import { Firestore, Timestamp } from "firebase/firestore";

export const getFirestoreTimestamp = (date) => {
  if(date === ""){
    return "";
  }
  const dateParts = date.split("-"); 
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed, so subtract 1

  const day = parseInt(dateParts[2]);
  const jsDate = new Date(year, month, day);
  
  const firestoreTimestamp = Timestamp.fromDate(jsDate);

  return firestoreTimestamp;
}

export const getDateFromTimestamp = (timestamp) => {
  if(!timestamp){
    return "";
  }
  const fTimestamp = timestamp;
  const seconds = fTimestamp.seconds;
  const nanoseconds = fTimestamp.nanoseconds;

  const jsDate = new Date(seconds * 1000 + nanoseconds / 1000000);

  const simpleDate = jsDate.toLocaleDateString();

  return simpleDate
}

