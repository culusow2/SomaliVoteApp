// result.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const voteRef = ref(db, "votes");

const candidates = {
  "Mohamed Abdullahi Farmaajo": 0,
  "Hassan Sheikh Mohamud": 0,
  "Hassan Ali Khaire": 0,
  "Sharif Sheikh Ahmed": 0,
  "Mohamed Hussein Roble": 0,
  "Abdi Farah Shirdon": 0
};

// DOM Elements
const candidateBars = {};
const candidateCounts = {};

Object.keys(candidates).forEach(name => {
  candidateBars[name] = document.getElementById(`${name}-bar`);
  candidateCounts[name] = document.getElementById(`${name}-count`);
});

onValue(voteRef, (snapshot) => {
  // Reset counts
  Object.keys(candidates).forEach(name => candidates[name] = 0);

  const data = snapshot.val();
  if (data) {
    Object.values(data).forEach(vote => {
      if (candidates.hasOwnProperty(vote.candidate)) {
        candidates[vote.candidate]++;
      }
    });
  }

  const totalVotes = Object.values(candidates).reduce((a, b) => a + b, 0);

  Object.entries(candidates).forEach(([name, count]) => {
    const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
    candidateCounts[name].textContent = count;
    candidateBars[name].style.width = `${percent}%`;
  });
});
