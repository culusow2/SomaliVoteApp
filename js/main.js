// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Firebase config
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
const database = getDatabase(app);

// User login
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const name = document.getElementById("name").value.trim();
      const gender = document.getElementById("gender").value;
      const region = document.getElementById("region").value.trim();
      const district = document.getElementById("district").value.trim();

      if (!name || !gender || !region || !district) {
        alert("Fadlan buuxi dhammaan meelaha loo baahan yahay.");
        return;
      }

      const user = { name, gender, region, district, hasVoted: false };
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "vote.html";
    });
  }

  // On vote.html
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user && document.getElementById("displayName")) {
    document.getElementById("displayName").textContent = user.name;
    document.getElementById("displayGender") && (document.getElementById("displayGender").textContent = user.gender);
    document.getElementById("displayRegion").textContent = user.region;
    document.getElementById("displayDistrict").textContent = user.district;
  }

  if (user && user.hasVoted && document.getElementById("confirmation")) {
    document.querySelector(".candidates-grid").style.display = "none";
    document.getElementById("confirmation").innerHTML = `<p>✅ You have already voted. Thank you!</p>`;
  }
});

let selectedCandidate = "";

window.selectCandidate = function (name) {
  selectedCandidate = name;
  document.getElementById("selectedCandidateName").textContent = name;
  document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = function () {
  selectedCandidate = "";
  document.getElementById("confirmation").classList.add("hidden");
};

window.submitVote = function () {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user || user.hasVoted) {
    alert("You already voted or user info is missing.");
    return;
  }

  const voteRef = ref(database, `votes/${selectedCandidate}`);
  const newUserRef = push(ref(database, "users"));

  update(ref(database, `votes`), {
    [selectedCandidate]: (firebaseVotes[selectedCandidate] || 0) + 1
  });

  set(newUserRef, {
    name: user.name,
    gender: user.gender,
    region: user.region,
    district: user.district,
    voted: selectedCandidate
  });

  user.hasVoted = true;
  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "results.html";
};

// Vote results display
const firebaseVotes = {};

if (window.location.pathname.includes("results.html")) {
  onValue(ref(database, "votes"), (snapshot) => {
    const data = snapshot.val() || {};
    const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];

    candidates.forEach((name) => {
      const count = data[name] || 0;
      firebaseVotes[name] = count;
      document.getElementById(`${name.toLowerCase()}Votes`).textContent = count;
      document.getElementById(`${name.toLowerCase()}Bar`).style.width = `${count * 20}px`;
    });
  });
}
