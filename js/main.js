import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  if (window.location.pathname.includes("vote.html")) loadUserInfo();
  if (window.location.pathname.includes("results.html")) showResults();
});

function handleLogin(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const region = document.getElementById("region").value.trim();
  const district = document.getElementById("district").value.trim();

  if (!name || !gender || !region || !district) {
    alert("Fadlan buuxi foomka si sax ah.");
    return;
  }

  const user = { name, gender, region, district, hasVoted: false };
  localStorage.setItem("currentUser", JSON.stringify(user));

  const userRef = push(ref(db, "users"));
  set(userRef, user);

  window.location.href = "vote.html";
}

function loadUserInfo() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return window.location.href = "index.html";
  document.getElementById("displayName").textContent = user.name;
  document.getElementById("displayRegion").textContent = user.region;
  document.getElementById("displayDistrict").textContent = user.district;
}

let selectedCandidate = null;

window.selectCandidate = (candidate) => {
  selectedCandidate = candidate;
  document.getElementById("selectedCandidateName").textContent = candidate;
  document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = () => {
  selectedCandidate = null;
  document.getElementById("confirmation").classList.add("hidden");
};

window.submitVote = () => {
  if (!selectedCandidate) return;
  const user = JSON.parse(localStorage.getItem("currentUser"));
  user.hasVoted = true;
  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "results.html";
};

function showResults() {
  const candidates = ["Farmaajo", "Hassan", "Khaire"];
  const container = document.getElementById("results");
  container.innerHTML = "";
  candidates.forEach(name => {
    const count = parseInt(localStorage.getItem(`votes_${name}`)) || 0;
    container.innerHTML += `<p><strong>${name}:</strong> ${count} votes</p>`;
  });
}
