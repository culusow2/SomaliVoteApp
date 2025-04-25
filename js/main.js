import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    if (window.location.pathname.includes("vote.html")) {
        loadUserInfo();
    }

    if (window.location.pathname.includes("results.html")) {
        showResults();
    }

    if (window.location.pathname.includes("admin.html")) {
        showVoterList();
    }
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

    const votersRef = ref(db, "voters");
    push(votersRef, user);

    window.location.href = "vote.html";
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) window.location.href = "index.html";

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

window.submitVote = () => {
    if (!selectedCandidate) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.hasVoted) return alert("You have already voted!");

    const voteKey = `votes_${selectedCandidate}`;
    const voteRef = ref(db, voteKey);

    // Update Firebase vote count
    push(voteRef, { timestamp: Date.now() });

    user.hasVoted = true;
    localStorage.setItem("currentUser", JSON.stringify(user));

    const voterRef = ref(db, "voters");
    push(voterRef, user);

    window.location.href = "results.html";
};

function showResults() {
    const candidates = ["Farmaajo", "Hassan", "Khaire"];
    candidates.forEach(candidate => {
        const candidateKey = `votes_${candidate}`;
        const candidateRef = ref(db, candidateKey);
        onValue(candidateRef, snapshot => {
            const voteCount = snapshot.size;
            document.getElementById(`${candidate.toLowerCase()}Count`).textContent = `${voteCount} votes`;
            document.getElementById(`${candidate.toLowerCase()}Progress`).style.width = `${Math.min(voteCount * 10, 100)}%`;
        });
    });
}

function showVoterList() {
    const voterRef = ref(db, "voters");
    onValue(voterRef, snapshot => {
        const list = document.getElementById("voterList");
        list.innerHTML = "";

        snapshot.forEach(child => {
            const user = child.val();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.gender}</td>
                <td>${user.region}</td>
                <td>${user.district}</td>
                <td>${user.hasVoted ? "Yes" : "No"}</td>
            `;
            list.appendChild(row);
        });
    });
}
