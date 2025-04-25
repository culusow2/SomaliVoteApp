import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebaseConfig } from "./config.js";

// Init
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Vote Counting
const voteRef = ref(db, "votes");

onValue(voteRef, (snapshot) => {
  const data = snapshot.val();
  const counts = {};

  if (data) {
    Object.values(data).forEach(vote => {
      const name = vote.candidate;
      counts[name] = (counts[name] || 0) + 1;
    });
  }

  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "";

  for (let name in counts) {
    resultDiv.innerHTML += `<p><strong>${name}</strong>: ${counts[name]} cod</p>`;
  }
});

