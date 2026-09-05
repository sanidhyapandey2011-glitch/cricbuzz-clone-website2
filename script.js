// =========================================
// CRICKETDATA.ORG API
// =========================================

// Put your CricketData.org API key here.
// Keep your key private.
const API_KEY = "cad35ade-73d8-42bf-babd-afe67fcb1bd4";

// API endpoint
const API_URL =
    `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`;


// =========================================
// HTML ELEMENTS
// =========================================

const liveMatches =
    document.getElementById("live-matches");

const searchInput =
    document.getElementById("search-input");

const allBtn =
    document.getElementById("all-btn");

const liveBtn =
    document.getElementById("live-btn");

const completedBtn =
    document.getElementById("completed-btn");


// =========================================
// VARIABLES
// =========================================

let allMatches = [];

let currentFilter = "all";


// =========================================
// GET MATCHES FROM CRICKETDATA.ORG
// =========================================

async function getMatches() {

    console.log("🏏 Getting cricket matches...");

    // Show loading message
    if (liveMatches) {

        liveMatches.innerHTML =
            "<p>Loading cricket matches...</p>";

    }


    try {

        const response =
            await fetch(API_URL);


        console.log(
            "HTTP Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "FULL API RESPONSE:",
            data
        );


        // =========================================
        // API ERROR CHECK
        // =========================================

        if (
            data.status &&
            data.status !== "success"
        ) {

            console.error(
                "API ERROR:",
                data
            );


            liveMatches.innerHTML =
                `<p>API Error: ${
                    data.reason ||
                    "Unable to load matches."
                }</p>`;

            return;

        }


        // =========================================
        // CHECK MATCH DATA
        // =========================================

        if (!Array.isArray(data.data)) {

            console.error(
                "Unexpected API response:",
                data
            );


            liveMatches.innerHTML =
                "<p>No match data received.</p>";

            return;

        }


        allMatches =
            data.data;


        console.log(
            "✅ Matches received:",
            allMatches.length
        );


        // Display matches
        displayMatches();

    }


    catch (error) {

        console.error(
            "❌ FETCH ERROR:",
            error
        );


        liveMatches.innerHTML = `
            <p>
                Unable to connect to CricketData API.
                Check the Console.
            </p>
        `;

    }

}


// =========================================
// DISPLAY MATCHES
// =========================================

function displayMatches() {

    if (!liveMatches) {
        return;
    }


    liveMatches.innerHTML = "";


    // =========================================
    // SEARCH TEXT
    // =========================================

    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    // =========================================
    // FILTER MATCHES
    // =========================================

    const filteredMatches =
        allMatches.filter(match => {


            // Team names
            const teams =
                Array.isArray(match.teams)
                    ? match.teams.join(" ")
                    : "";


            const name =
                match.name || "";


            const status =
                match.status || "";


            const matchType =
                match.matchType || "";


            const venue =
                match.venue || "";


            const searchableText =
                `
                ${teams}
                ${name}
                ${status}
                ${matchType}
                ${venue}
                `
                .toLowerCase();


            // Search
            const matchesSearch =
                searchableText.includes(
                    searchText
                );


            // =========================================
            // FILTER STATUS
            // =========================================

            let matchesFilter = true;


            // LIVE
            if (
                currentFilter === "live"
            ) {

                matchesFilter =
                    match.matchStarted === true &&
                    match.matchEnded !== true;

            }


            // COMPLETED
            if (
                currentFilter === "completed"
            ) {

                matchesFilter =
                    match.matchEnded === true;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    // =========================================
    // NO RESULTS
    // =========================================

    if (
        filteredMatches.length === 0
    ) {

        liveMatches.innerHTML =
            "<p>No matches found.</p>";

        return;

    }


    // =========================================
    // CREATE MATCH CARDS
    // =========================================

    filteredMatches.forEach(
        match => {

            createMatchCard(match);

        }
    );

}


// =========================================
// CREATE MATCH CARD
// =========================================

function createMatchCard(match) {


    // =========================================
    // TEAM NAMES
    // =========================================

    let team1 =
        "Team 1";

    let team2 =
        "Team 2";


    if (
        Array.isArray(match.teams)
    ) {

        team1 =
            match.teams[0] ||
            "Team 1";

        team2 =
            match.teams[1] ||
            "Team 2";

    }


    // =========================================
    // MATCH INFORMATION
    // =========================================

    const status =
        match.status ||
        "Status unavailable";


    const matchType =
        match.matchType
            ? match.matchType.toUpperCase()
            : "CRICKET";


    const venue =
        match.venue || "";


    const matchName =
        match.name || "";


    // =========================================
    // GET SCORES
    // =========================================

    const scoreArray =
        Array.isArray(match.score)
            ? match.score
            : [];


    let team1Scores = [];

    let team2Scores = [];


    scoreArray.forEach(
        inning => {


            const inningName =
                (
                    inning.inning ||
                    ""
                )
                .toLowerCase();


            // =========================================
            // SCORE TEXT
            // =========================================

            const runs =
                inning.r !== undefined
                    ? inning.r
                    : "-";


            const wickets =
                inning.w !== undefined
                    ? inning.w
                    : "-";


            const overs =
                inning.o !== undefined
                    ? inning.o
                    : "-";


            const scoreText =
                `${runs}/${wickets} (${overs} Ov)`;


            // =========================================
            // IDENTIFY TEAM
            // =========================================

            if (
                inningName.includes(
                    team1.toLowerCase()
                )
            ) {

                team1Scores.push(
                    scoreText
                );

            }


            else if (
                inningName.includes(
                    team2.toLowerCase()
                )
            ) {

                team2Scores.push(
                    scoreText
                );

            }

        }
    );


    // =========================================
    // FINAL SCORE TEXT
    // =========================================

    const team1Score =
        team1Scores.length > 0
            ? team1Scores.join(" & ")
            : "Yet to bat";


    const team2Score =
        team2Scores.length > 0
            ? team2Scores.join(" & ")
            : "Yet to bat";


    // =========================================
    // MATCH STATUS
    // =========================================

    let statusText =
        "UPCOMING";

    let statusClass =
        "upcoming";


    // Live match
    if (
        match.matchStarted === true &&
        match.matchEnded !== true
    ) {

        statusText =
            "LIVE";

        statusClass =
            "live";

    }


    // Completed match
    if (
        match.matchEnded === true
    ) {

        statusText =
            "COMPLETED";

        statusClass =
            "completed";

    }


    // =========================================
    // CREATE MATCH CARD
    // =========================================

    const matchCard =
        document.createElement("div");


    matchCard.className =
        "match-card";


    // =========================================
    // CARD HTML
    // =========================================

    matchCard.innerHTML = `

        <div class="match-header">

            <span class="match-type">
                ${escapeHTML(matchType)}
            </span>

            <span
                class="match-status-badge ${statusClass}">
                ${statusText}
            </span>

        </div>


        ${
            matchName
                ? `
                    <div class="match-series">
                        ${escapeHTML(matchName)}
                    </div>
                `
                : ""
        }


        <div class="teams">


            <!-- TEAM 1 -->

            <div class="team-row">

                <div class="team-info">

                    <span class="team-name">
                        ${escapeHTML(team1)}
                    </span>

                </div>


                <span class="team-score-value">

                    ${escapeHTML(team1Score)}

                </span>

            </div>



            <!-- TEAM 2 -->

            <div class="team-row">

                <div class="team-info">

                    <span class="team-name">
                        ${escapeHTML(team2)}
                    </span>

                </div>


                <span class="team-score-value">

                    ${escapeHTML(team2Score)}

                </span>

            </div>


        </div>


        ${
            venue
                ? `
                    <div class="venue">
                        📍 ${escapeHTML(venue)}
                    </div>
                `
                : ""
        }


        <div class="match-result">

            ${escapeHTML(status)}

        </div>

    `;


    liveMatches.appendChild(
        matchCard
    );

}


// =========================================
// ESCAPE HTML
// =========================================
// Prevents API text from accidentally being
// interpreted as HTML.

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =========================================
// SEARCH
// =========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayMatches
    );

}


// =========================================
// REMOVE ACTIVE BUTTON
// =========================================

function removeActiveButton() {

    if (allBtn) {

        allBtn.classList.remove(
            "active"
        );

    }


    if (liveBtn) {

        liveBtn.classList.remove(
            "active"
        );

    }


    if (completedBtn) {

        completedBtn.classList.remove(
            "active"
        );

    }

}


// =========================================
// ALL BUTTON
// =========================================

if (allBtn) {

    allBtn.addEventListener(
        "click",
        function () {

            currentFilter =
                "all";


            removeActiveButton();


            allBtn.classList.add(
                "active"
            );


            displayMatches();

        }
    );

}


// =========================================
// LIVE BUTTON
// =========================================

if (liveBtn) {

    liveBtn.addEventListener(
        "click",
        function () {

            currentFilter =
                "live";


            removeActiveButton();


            liveBtn.classList.add(
                "active"
            );


            displayMatches();

        }
    );

}


// =========================================
// COMPLETED BUTTON
// =========================================

if (completedBtn) {

    completedBtn.addEventListener(
        "click",
        function () {

            currentFilter =
                "completed";


            removeActiveButton();


            completedBtn.classList.add(
                "active"
            );


            displayMatches();

        }
    );

}


// =========================================
// START WEBSITE
// =========================================

getMatches();
