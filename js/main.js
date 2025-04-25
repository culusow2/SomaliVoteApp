import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { firebaseConfig } from "./config.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Candidate list
const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];

function updateResults() {
  const resultsRef = ref(db, "votes/");
  onValue(resultsRef, (snapshot) => {
    const votes = snapshot.val() || {};

    let totalVotes = 0;
    candidates.forEach(candidate => {
      totalVotes += votes[candidate] || 0;
    });

    candidates.forEach(candidate => {
      const count = votes[candidate] || 0;
      const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;

      document.getElementById(`${candidate}Count`).textContent = count;
      document.getElementById(`${candidate}Bar`).style.width = `${percent}%`;
    });
  });
}

updateResults();
