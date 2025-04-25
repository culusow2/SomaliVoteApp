// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, get, update, increment } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global user object
let currentUser = {};

// Handle login
document.querySelector("button").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const region = document.getElementById("region").value.trim();
  const district = document.getElementById("district").value.trim();

  if (!name || !gender || !region || !district) {
    alert("Fadlan buuxi dhammaan meelaha banaan.");
    return;
  }

  currentUser = {
    name,
    gender,
    region,
    district,
    hasVoted: false
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.location.href = "vote.html";
});

// Display user info on vote page
if (window.location.pathname.includes("vote.html")) {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) window.location.href = "index.html";

  currentUser = user;
  document.getElementById("displayName").textContent = user.name;
  document.getElementById("displayRegion").textContent = user.region;
  document.getElementById("displayDistrict").textContent = user.district;
}

// Voting logic
let selectedCandidate = "";

window.selectCandidate = function (candidate) {
  selectedCandidate = candidate;
  document.getElementById("selectedCandidateName").textContent = candidate.replace("_", " ");
  document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = function () {
  document.getElementById("confirmation").classList.add("hidden");
  selectedCandidate = "";
};

window.submitVote = async function () {
  if (!selectedCandidate) return;

  const voteRef = ref(db, 'votes/' + selectedCandidate);
  const snapshot = await get(voteRef);

  let newCount = 1;
  if (snapshot.exists()) {
    newCount = snapshot.val() + 1;
  }

  await set(voteRef, newCount);

  // Save that the user has voted
  currentUser.hasVoted = true;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // Optional: Save full user under /voters
  const voterId = Date.now();
  await set(ref(db, 'voters/' + voterId), currentUser);

  alert("Codkaagii waad dhiibatay. Mahadsanid!");
  window.location.href = "results.html";
};

// Results logic
if (window.location.pathname.includes("results.html")) {
  const candidates = ["Farmaajo", "Hassan", "Khaire", "Roble", "Sharif", "Shirdon"];

  candidates.forEach(async (name) => {
    const voteRef = ref(db, 'votes/' + name);
    const snapshot = await get(voteRef);
    const count = snapshot.exists() ? snapshot.val() : 0;

    document.getElementById(name + "Count").textContent = count;
    document.getElementById(name + "Bar").style.width = (count * 20) + "%";
  });
}
