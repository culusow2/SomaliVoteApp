import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("loginForm")) {
        document.getElementById("loginForm").addEventListener("submit", handleLogin);
    }
    if (window.location.pathname.includes("vote.html")) {
        loadUserInfo();
    }
    if (window.location.pathname.includes("results.html")) {
        showResults();
    }
    if (window.location.pathname.includes("admin.html")) {
        showVoters();
        showVotes();
    }
});

function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const gender = document.getElementById("gender").value;
    const region = document.getElementById("region").value.trim();
    const district = document.getElementById("district").value.trim();

    if (!name || !gender || !region || !district) {
        alert("Please fill all fields correctly.");
        return;
    }

    const user = { name, gender, region, district, hasVoted: false };
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "vote.html";
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) window.location.href = "index.html";

    document.getElementById("displayName").textContent = user.name;
    document.getElementById("displayDistrict").textContent = user.district;
    document.getElementById("displayRegion").textContent = user.region;
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

window.submitVote = async () => {
    if (!selectedCandidate) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || user.hasVoted) {
        alert("You already voted!");
        return;
    }

    // Save vote
    const voteRef = ref(db, "votes/" + selectedCandidate);
    const voteSnapshot = await get(voteRef);
    const currentVotes = voteSnapshot.exists() ? voteSnapshot.val() : 0;
    await set(voteRef, currentVotes + 1);

    // Save user
    user.hasVoted = true;
    const userRef = ref(db, "voters");
    push(userRef, user);

    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "results.html";
};

function showResults() {
    const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];
    candidates.forEach(candidate => {
        const voteRef = ref(db, "votes/" + candidate);
        onValue(voteRef, (snapshot) => {
            const votes = snapshot.exists() ? snapshot.val() : 0;
            const countElement = document.getElementById(candidate.toLowerCase() + "Count");
            const barElement = document.getElementById(candidate.toLowerCase() + "Progress");
            if (countElement) countElement.textContent = votes;
            if (barElement) barElement.style.width = Math.min(votes * 10, 100) + "%";
        });
    });
}

function showVoters() {
    const votersRef = ref(db, "voters");
    onValue(votersRef, (snapshot) => {
        const tbody = document.getElementById("voterTableBody");
        tbody.innerHTML = "";
        snapshot.forEach(child => {
            const data = child.val();
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${data.name}</td>
                <td>${data.gender}</td>
                <td>${data.region}</td>
                <td>${data.district}</td>
                <td>${data.hasVoted ? "Yes" : "No"}</td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function showVotes() {
    const adminVotes = document.getElementById("adminVotes");
    adminVotes.innerHTML = "";
    const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];
    candidates.forEach(candidate => {
        const voteRef = ref(db, "votes/" + candidate);
        onValue(voteRef, (snapshot) => {
            const votes = snapshot.exists() ? snapshot.val() : 0;
            const p = document.createElement("p");
            p.innerHTML = `<strong>${candidate}:</strong> ${votes} votes`;
            adminVotes.appendChild(p);
        });
    });
}
