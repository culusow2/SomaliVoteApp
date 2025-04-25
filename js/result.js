import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { firebaseConfig } from "./config.js";

// Init
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// List of all candidates
const allCandidates = ["Farmaajo", "Hassan Sheikh", "Roble", "Kheyre"];

// Vote Counting
const voteRef = ref(db, "votes");

onValue(voteRef, (snapshot) => {
  const data = snapshot.val();
  const counts = {};

  // Initialize all candidates with 0
  allCandidates.forEach(candidate => {
    counts[candidate] = 0;
  });

  // If votes exist, count them
  if (data) {
    Object.values(data).forEach(vote => {
      const name = vote.candidate;
      if (counts.hasOwnProperty(name)) {
        counts[name]++;
      }
    });
  }

  // Display results
  const resultDiv = document.getElementById("results");
  resultDiv.innerHTML = "";

  for (let name of allCandidates) {
    resultDiv.innerHTML += `<p><strong>${name}</strong>: ${counts[name]} cod</p>`;
  }
});
