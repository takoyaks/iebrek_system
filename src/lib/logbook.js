import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";

export async function getLogbookEntries() {
  const q = query(collection(db, "catanduanes_logbook_entries"));
  const querySnapshot = await getDocs(q);
  // Sort by timestamp (ascending)
  const sortedData = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

  // Format date and time for each entry
  return sortedData.map(data => {
    const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : "N/A";
    const time = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString() : "N/A";
    return {
      ...data,
      date,
      time,
    };
  });
}
