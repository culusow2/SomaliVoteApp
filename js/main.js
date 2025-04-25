document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    if (window.location.pathname.includes("vote.html")) {
        loadUserInfo();
    }

    if (window.location.pathname.includes("results.html")) {
        showResults();
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
    const current = parseInt(localStorage.getItem(voteKey)) || 0;
    localStorage.setItem(voteKey, current + 1);

    user.hasVoted = true;
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "results.html";
};

function showResults() {
    const candidates = ["Farmaajo", "Hassan", "Khaire", "Sharif", "Roble", "Shirdon"];
    candidates.forEach(candidate => {
        const count = parseInt(localStorage.getItem(`votes_${candidate}`)) || 0;
        const id = candidate.toLowerCase();
        const countEl = document.getElementById(`${id}Count`);
        const barEl = document.getElementById(`${id}Progress`);
        if (countEl) countEl.textContent = count;
        if (barEl) barEl.style.width = `${Math.min(count * 10, 100)}%`;
    });
}
