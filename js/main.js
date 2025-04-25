import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Capture form and store user in localStorage
const loginButton = document.getElementById("loginBtn");
if (loginButton) {
  loginButton.addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const gender = document.getElementById("gender").value;
    const region = document.getElementById("region").value.trim();
    const district = document.getElementById("district").value.trim();

    if (!name || !gender || !region || !district) {
      alert("Please fill all fields.");
      return;
    }

    const user = { name, gender, region, district, hasVoted: false };
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "vote.html";
  });
}

// Show user info on vote.html
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser && document.getElementById("displayName")) {
  document.getElementById("displayName").textContent = currentUser.name;
  document.getElementById("displayGender").textContent = currentUser.gender;
  document.getElementById("displayRegion").textContent = currentUser.region;
  document.getElementById("displayDistrict").textContent = currentUser.district;
}

let selectedCandidate = "";

window.selectCandidate = (candidate) => {
  selectedCandidate = candidate;
  document.getElementById("selectedCandidateName").textContent = getCandidateFullName(candidate);
  document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = () => {
  document.getElementById("confirmation").classList.add("hidden");
};

window.submitVote = () => {
  if (!selectedCandidate || !currentUser) return;

  const userKey = currentUser.name.replace(/\s+/g, "_").toLowerCase();

  // Save user vote
  set(ref(db, "voters/" + userKey), {
    ...currentUser,
    hasVoted: true,
    votedFor: selectedCandidate
  });

  // Update vote count
  const voteRef = ref(db, "votes/" + selectedCandidate);
  get(voteRef).then((snapshot) => {
    let currentCount = snapshot.exists() ? snapshot.val() : 0;
    update(ref(db), {
      ["votes/" + selectedCandidate]: currentCount + 1
    }).then(() => {
      currentUser.hasVoted = true;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      window.location.href = "results.html";
    });
  });
};

function getCandidateFullName(key) {
  const names = {
    Farmaajo: "Mohamed Abdullahi Farmaajo",
    Hassan: "Hassan Sheikh Mohamud",
    Khaire: "Hassan Ali Khaire",
    Roble: "Mohamed Hussein Roble",
    Sharif: "Sharif Sheikh Ahmed",
    Shirdon: "Abdi Farah Shirdon"
  };
  return names[key] || key;
}

// Load results
if (window.location.pathname.includes("results.html")) {
  const results = {
    Farmaajo: 0,
    Hassan: 0,
    Khaire: 0,
    Roble: 0,
    Sharif: 0,
    Shirdon: 0
  };

  const resultsRef = ref(db, "votes");
  get(resultsRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(results).forEach((key) => {
        results[key] = data[key] || 0;
        document.getElementById(`${key}Count`).textContent = results[key];
        const percentage = Math.min((results[key] / Math.max(1, getTotalVotes(data))) * 100, 100);
        document.getElementById(`${key}Bar`).style.width = `${percentage}%`;
      });
    }
  });

  function getTotalVotes(voteData) {
    return Object.values(voteData).reduce((a, b) => a + b, 0);
  }
}
