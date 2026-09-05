// =========================================
// CRICLIVE API
// =========================================

// IMPORTANT:
// Put your API key between the quotation marks.
// Do NOT send your key to me.

const API_KEY = "273|87YAeSoNtOSF3acmffdndOS07CIHx8CrJUWRkgkhbc482973";


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


let allMatches = [];

let currentFilter = "all";


// =========================================
// GET LIVE MATCHES FROM API
// =========================================

async function getMatches() {

    console.log("Getting cricket matches...");

    try {

        const response = await fetch(
            "https://cricketliveapi.com/api/v1/cricket/live",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Accept": "application/json"
                }
            }
        );


        console.log(
            "HTTP Status:",
            response.status
        );


        const data = await response.json();


        console.log(
            "FULL API RESPONSE:",
            data
        );


        // =================================
        // CHECK API RESPONSE
        // =================================

        if (!response.ok) {

            console.error(
                "API ERROR:",
                data
            );

            liveMatches.innerHTML =
                "<p>API error. Check the Console.</p>";

            return;
        }


        // =================================
        // GET MATCH DATA
        // =================================

        if (!Array.isArray(data.data)) {

            console.error(
                "Unexpected API response:",
                data
            );

            liveMatches.innerHTML =
                "<p>No match data received.</p>";

            return;
        }


        allMatches = data.data;


        console.log(
            "Matches received:",
            allMatches.length
        );


        // =================================
        // DISPLAY
        // =================================

        displayMatches();

    }


    catch (error) {

        console.error(
            "FETCH ERROR:",
            error
        );


        liveMatches.innerHTML =
            "<p>Unable to connect to cricket API.</p>";

    }

}


// =========================================
// DISPLAY MATCHES
// =========================================

function displayMatches() {

    liveMatches.innerHTML = "";


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredMatches =
        allMatches.filter(match => {


            // =================================
            // SEARCHABLE TEXT
            // =================================

            const teams =
                match.teams || "";


            const status =
                match.status || "";


            const format =
                match.format || "";


            const venue =
                match.venue || "";


            const series =
                match.series || "";


            const searchableText =
                `${teams} ${status} ${format} ${venue} ${series}`
                    .toLowerCase();


            const matchesSearch =
                searchableText.includes(
                    searchText
                );


            // =================================
            // STATUS FILTER
            // =================================

            let matchesFilter = true;


            if (
                currentFilter === "live"
            ) {

                matchesFilter =
                    status
                        .toLowerCase()
                        .includes("live");

            }


            if (
                currentFilter === "completed"
            ) {

                matchesFilter =
                    status
                        .toLowerCase()
                        .includes("completed") ||
                    status
                        .toLowerCase()
                        .includes("finished");

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    // =================================
    // NO RESULTS
    // =================================

    if (
        filteredMatches.length === 0
    ) {

        liveMatches.innerHTML =
            "<p>No matches found.</p>";

        return;
    }


    // =================================
    // CREATE MATCH CARDS
    // =================================

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


    // =================================
    // MATCH INFORMATION
    // =================================

    const teams =
        match.teams ||
        "Teams unavailable";


    const score =
        match.score ||
        "Score unavailable";


    const status =
        match.status ||
        "LIVE";


    const format =
        match.format ||
        "CRICKET";


    const venue =
        match.venue ||
        "";


    const series =
        match.series ||
        "";


    // =================================
    // STATUS STYLE
    // =================================

    let statusText =
        status.toUpperCase();


    let statusClass =
        "live";


    const lowerStatus =
        status.toLowerCase();


    if (
        lowerStatus.includes("completed") ||
        lowerStatus.includes("finished")
    ) {

        statusText =
            "COMPLETED";

        statusClass =
            "completed";

    }


    // =================================
    // CREATE CARD
    // =================================

    const matchCard =
        document.createElement("div");


    matchCard.className =
        "match-card";


    // =================================
    // CARD HTML
    // =================================

    matchCard.innerHTML = `

        <div class="match-header">

            <span class="match-type">
                ${format.toUpperCase()}
            </span>

            <span
                class="match-status-badge ${statusClass}">
                ${statusText}
            </span>

        </div>


        <div class="teams">

            <div class="team-row">

                <div class="team-info">

                    <span class="team-name">
                        ${teams}
                    </span>

                </div>

            </div>


            <div class="team-row">

                <div class="team-info">

                    <span class="team-name">
                        SCORE
                    </span>

                </div>

                <span class="team-score-value">
                    ${score}
                </span>

            </div>

        </div>


        ${
            venue
                ? `
                    <div class="venue">
                        📍 ${venue}
                    </div>
                `
                : ""
        }


        ${
            series
                ? `
                    <div class="match-series">
                        ${series}
                    </div>
                `
                : ""
        }


        <div class="match-result">

            ${status}

        </div>

    `;


    liveMatches.appendChild(
        matchCard
    );

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
// START
// =========================================

getMatches();