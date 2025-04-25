import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAouJWrr6MA60Lfp_3jZaLfRgsWFpunddo",
  authDomain: "somalielection2026-2086f.firebaseapp.com",
  databaseURL: "https://somalielection2026-2086f-default-rtdb.firebaseio.com",
  projectId: "somalielection2026-2086f",
  storageBucket: "somalielection2026-2086f.appspot.com",
  messagingSenderId: "118367125204",
  appId: "1:118367125204:web:683ff14c39fb1d18488541",
  measurementId: "G-LXDNTMSVP1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Display user info if exists
const user = JSON.parse(localStorage.getItem("currentUser"));
if (user) {
  if (document.getElementById("displayName")) document.getElementById("displayName").textContent = user.name;
  if (document.getElementById("displayRegion")) document.getElementById("displayRegion").textContent = user.region;
  if (document.getElementById("displayDistrict")) document.getElementById("displayDistrict").textContent = user.district;
}

// Voting Variables
let selectedCandidate = "";

window.selectCandidate = (candidate) => {
  selectedCandidate = candidate;
  document.getElementById("selectedCandidateName").textContent = getCandidateFullName(candidate);
  document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = () => {
  selectedCandidate = "";
  document.getElementById("confirmation").classList.add("hidden");
};

window.submitVote = async () => {
  if (!user || !selectedCandidate) {
    alert("Error: No user or no candidate selected.");
    return;
  }

  // Update user has voted
  const userRef = ref(db, "voters/" + user.name.replace(/\s+/g, "_"));
  await update(userRef, {
    ...user,
    hasVoted: true,
    votedFor: selectedCandidate
  });

  // Update vote count
  const candidateRef = ref(db, "votes/" + selectedCandidate);
  const snapshot = await get(candidateRef);
  const currentVotes = snapshot.exists() ? snapshot.val() : 0;
  await set(candidateRef, currentVotes + 1);

  // Local update
  user.hasVoted = true;
  localStorage.setItem("currentUser", JSON.stringify(user));

  alert(`✅ You voted for ${getCandidateFullName(selectedCandidate)} successfully!`);
  window.location.href = "results.html";
};

function getCandidateFullName(shortName) {
  const names = {
    "Farmaajo": "Mohamed Abdullahi Farmaajo",
    "Hassan": "Hassan Sheikh Mohamud",
    "Khaire": "Hassan Ali Khaire",
    "Roble": "Mohamed Hussein Roble",
    "Sharif": "Sharif Sheikh Ahmed",
    "Shirdon": "Abdi Farah Shirdon"
  };
  return names[shortName] || shortName;
}
