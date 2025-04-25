import { getDatabase, ref, set, push, get, child, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { app } from './config.js';

const db = getDatabase(app);

// Retrieve current user from localStorage
const user = JSON.parse(localStorage.getItem("currentUser"));
if (user) {
  document.getElementById("displayName").textContent = user.name;
  document.getElementById("displayRegion").textContent = user.region;
  document.getElementById("displayDistrict").textContent = user.district;
}

// Candidate Selection
let selectedCandidate = "";
function selectCandidate(name) {
  selectedCandidate = name;
  document.getElementById("selectedCandidateName").textContent = getCandidateFullName(name);
  document.getElementById("confirmation").classList.remove("hidden");
}

window.selectCandidate = selectCandidate;

function cancelVote() {
  selectedCandidate = "";
  document.getElementById("confirmation").classList.add("hidden");
}

window.cancelVote = cancelVote;

function submitVote() {
  if (!user || !selectedCandidate) return;

  const userRef = ref(db, "voters/" + user.name.replace(/\s+/g, "_"));

  update(userRef, {
    hasVoted: true,
    vote: selectedCandidate
  });

  const voteCountRef = ref(db, "votes/" + selectedCandidate);
  get(voteCountRef).then((snapshot) => {
    const currentVotes = snapshot.exists() ? snapshot.val() : 0;
    set(voteCountRef, currentVotes + 1);
    alert("✅ Your vote for " + getCandidateFullName(selectedCandidate) + " has been submitted!");
    document.getElementById("confirmation").classList.add("hidden");
  });
}

window.submitVote = submitVote;

function getCandidateFullName(short) {
  switch (short) {
    case "Farmaajo": return "Mohamed Abdullahi Farmaajo";
    case "Hassan": return "Hassan Sheikh Mohamud";
    case "Khaire": return "Hassan Ali Khaire";
    case "Roble": return "Mohamed Hussein Roble";
    case "Sharif": return "Sharif Sheikh Ahmed";
    case "Shirdon": return "Abdi Farah Shirdon";
    default: return short;
  }
}
