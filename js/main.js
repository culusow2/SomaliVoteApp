// main.js
import { database } from './config.js';
import { ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// --- Handle Login Page (index.html)
const submitButton = document.getElementById("submitBtn");
if (submitButton) {
  submitButton.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const gender = document.getElementById("gender").value;
    const region = document.getElementById("region").value.trim();
    const district = document.getElementById("district").value.trim();

    if (!name || !gender || !region || !district) {
      alert("Fadlan buuxi dhammaan meelaha!");
      return;
    }

    const user = {
      name,
      gender,
      region,
      district,
      hasVoted: false
    };

    localStorage.setItem("currentUser", JSON.stringify(user));

    set(ref(database, "voters/" + name.replace(/\s+/g, "_")), user)
      .then(() => {
        window.location.href = "vote.html";
      })
      .catch((error) => {
        console.error("Error writing to database:", error);
        alert("Error saving info.");
      });
  });
}

// --- Handle Voting Page (vote.html)
let selectedCandidate = null;

window.selectCandidate = (candidate) => {
  selectedCandidate = candidate;
  document.getElementById("selectedCandidateName").textContent = getCandidateFullName(candidate);
  document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = () => {
  selectedCandidate = null;
  document.getElementById("confirmation").classList.add("hidden");
};

function getCandidateFullName(shortName) {
  const map = {
    "Farmaajo": "Mohamed Abdullahi Farmaajo",
    "Hassan": "Hassan Sheikh Mohamud",
    "Khaire": "Hassan Ali Khaire",
    "Roble": "Mohamed Hussein Roble",
    "Sharif": "Sharif Sheikh Ahmed",
    "Shirdon": "Abdi Farah Shirdon"
  };
  return map[shortName] || shortName;
}

window.submitVote = async () => {
  if (!selectedCandidate) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user.hasVoted) {
    alert("You have already voted!");
    return;
  }

  const candidateRef = ref(database, "votes/" + selectedCandidate);
  const snapshot = await get(candidateRef);
  const currentVotes = snapshot.exists() ? snapshot.val() : 0;

  await set(candidateRef, currentVotes + 1);

  // Update the user hasVoted = true
  const userRef = ref(database, "voters/" + user.name.replace(/\s+/g, "_"));
  await update(userRef, { hasVoted: true });

  user.hasVoted = true;
  localStorage.setItem("currentUser", JSON.stringify(user));

  window.location.href = "results.html"; // Redirect after voting
};

// --- Load User Info on Vote Page
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    const nameEl = document.getElementById("displayName");
    const districtEl = document.getElementById("displayDistrict");
    const regionEl = document.getElementById("displayRegion");

    if (nameEl) nameEl.textContent = user.name;
    if (districtEl) districtEl.textContent = user.district;
    if (regionEl) regionEl.textContent = user.region;
  }
});
