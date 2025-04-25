import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get, set, onValue, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
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

    // Save user info to Firebase
    const usersRef = ref(db, "users");
    push(usersRef, user);

    window.location.href = "vote.html";
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return window.location.href = "index.html";

    document.getElementById("displayName").textContent = user.name;
    document.getElementById("displayDistrict").textContent = user.district;

    const regionEl = document.getElementById("displayRegion");
    if (regionEl) regionEl.textContent = user.region;
}

let selectedCandidate = null;

window.selectCandidate = (candidate) => {
    selectedCandidate = candidate;
    document.getElementById("selectedCandidateName").textContent = getFullName(candidate);
    document.getElementById("confirmation").classList.remove("hidden");
};

window.cancelVote = () => {
    selectedCandidate = null;
    document.getElementById("confirmation").classList.add("hidden");
};

function getFullName(shortName) {
    const names = {
        Farmaajo: "Mohamed Abdullahi Farmaajo",
        Hassan: "Hassan Sheikh Mohamud",
        Khaire: "Hassan Ali Khaire",
        Sharif: "Sharif Sheikh Ahmed",
        Roble: "Mohamed Hussein Roble",
        Shirdon: "Abdi Farah Shirdon"
    };
    return names[shortName] || shortName;
}

window.submitVote = async () => {
    if (!selectedCandidate) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.hasVoted) return alert("You have already voted!");

    const voteRef = ref(db, `votes/${selectedCandidate}/count`);
    const snapshot = await get(voteRef);
    const current = snapshot.exists() ? snapshot.val() : 0;
    await set(voteRef, current + 1);

    user.hasVoted = true;
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "results.html";
};

function showResults() {
    const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];
    candidates.forEach(candidate => {
        const voteRef = ref(db, `votes/${candidate}/count`);
        onValue(voteRef, (snapshot) => {
            const count = snapshot.exists() ? snapshot.val() : 0;
            const id = candidate.toLowerCase();
            const countEl = document.getElementById(`${id}Count`);
            if (countEl) countEl.textContent = `${count} votes`;
        });
    });
}
