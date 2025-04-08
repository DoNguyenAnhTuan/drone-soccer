window.onload = function() {
    loadFromLocalStorage(); // Tải dữ liệu khi F5
    showNextRoundTeams();   //  Hiển thị danh sách 16 đội
};

let teams = [
    "Đội Tuấn", "Đội 2", "Đội 3", "Đội 4", 
    "Đội Hằng", "Đội 6", "Đội 7", "Đội 8", 
    "Đội Vũ", "Đội 10", "Đội 11", "Đội 12", 
    "Đội D", "Đội 14", "Đội 15", "Đội 16",
    "Đội 17", "Đội 18", "Đội 19", "Đội 20",
    "Đội 21", "Đội 22", "Đội 23", "Đội 24"
];

let matches = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randomizeMatches() {
    let savedMatches = localStorage.getItem("matches0");

    if (savedMatches) {
        matches = JSON.parse(savedMatches);
        renderMatches();
        return; // Không xáo trộn nếu có dữ liệu cũ
    }
            
    shuffle(teams);
    matches = [];
    let matchesContainer = document.getElementById("matches-container");
    matchesContainer.innerHTML = "";

    for (let i = 0; i < teams.length; i += 2) {
        let match = {
            team1: teams[i],
            team2: teams[i + 1],
            score1: [0, 0, 0], // 3 trận
            score2: [0, 0, 0],
            foul1: [0, 0, 0], // Số lỗi phạm của đội 1
            foul2: [0, 0, 0], // Số lỗi phạm của đội 2
            totalPoints1: 0,
            totalPoints2: 0,
            totalScore1: 0,
            totalScore2: 0,
            totalFoul1: 0,
            totalFoul2: 0
        };
        matches.push(match);
    }

    renderMatches();
}

function updateScore(matchIndex, gameIndex, team, value) {
    let match = matches[matchIndex];
    value = parseInt(value) || 0;

    if (team === 1) {
        match.score1[gameIndex] = value;
    } else {
        match.score2[gameIndex] = value;
    }
    
    calculateResults(matchIndex);
}

function updateFoul(matchIndex, gameIndex, team, value) {
    let match = matches[matchIndex];
    value = parseInt(value) || 0;

    if (team === 1) {
        match.foul1[gameIndex] = value;
    } else {
        match.foul2[gameIndex] = value;
    }
    
    calculateResults(matchIndex);
}

function calculateResults(matchIndex) {
    let match = matches[matchIndex];
    match.totalPoints1 = 0;
    match.totalPoints2 = 0;
    match.totalScore1 = 0;
    match.totalScore2 = 0;
    match.totalFoul1 = 0;
    match.totalFoul2 = 0;

    for (let i = 0; i < 2; i++) {
        match.totalScore1 += match.score1[i];
        match.totalScore2 += match.score2[i];
        match.totalFoul1 += match.foul1[i];
        match.totalFoul2 += match.foul2[i];

        if (match.score1[i] > match.score2[i]) match.totalPoints1 += 3;
        if (match.score1[i] < match.score2[i]) match.totalPoints2 += 3;
        if (match.score1[i] === match.score2[i]) {
            match.totalPoints1 += 1;
            match.totalPoints2 += 1;
        }
    }
    saveToLocalStorage(); // Lưu dữ liệu khi cập nhật điểm
    updateNextRoundTeams(); // <--- Cập nhật 16 đội ngay khi xáo trộn
    renderMatches();
}

function renderMatches() {
    let matchesContainer = document.getElementById("matches-container");
    matchesContainer.innerHTML = "";

    matches.forEach((match, index) => {
        let scoreInputs = "";
        let foulInputs = "";
        for (let i = 0; i < 2; i++) {
            scoreInputs += `
                <input type="number" class="score-input" value="${match.score1[i]}" 
                    oninput="updateScore(${index}, ${i}, 1, this.value)">
                -
                <input type="number" class="score-input" value="${match.score2[i]}" 
                    oninput="updateScore(${index}, ${i}, 2, this.value)">
                <br>
            `;

            foulInputs += `
                <input type="number" class="score-input" value="${match.foul1[i]}" 
                    oninput="updateFoul(${index}, ${i}, 1, this.value)">
                -
                <input type="number" class="score-input" value="${match.foul2[i]}" 
                    oninput="updateFoul(${index}, ${i}, 2, this.value)">
                <br>
            `;
        }

        let winnerText = `<br><b>Xét tổng điểm: ${match.totalPoints1} - ${match.totalPoints2}</b>`;
        if (match.totalPoints1 > match.totalPoints2) {
            winnerText += `<br><b>${match.team1} Vào Vòng 1-8! 🏆</b>`;
        } else if (match.totalPoints1 < match.totalPoints2) {
            winnerText += `<br><b>${match.team2} Vào Vòng 1-8! 🏆</b>`;
        } else {
            // winnerText += `<br><b>Xét số lỗi: ${match.totalFoul1} - ${match.totalFoul2}</b>`;
            // winnerText += match.totalFoul1 > match.totalFoul2 ? `<br><b>${match.team2} Vào Vòng Tứ kết! 🏆</b>` : `<br><b>${match.team1} Vào Vòng Tứ kết! 🏆</b>`;
            if (match.totalFoul1 < match.totalFoul2) {
                winnerText += `<br><b>${match.team1} Vào Vòng 1-8! 🏆</b>`;
            } else if (match.totalFoul1 > match.totalFoul2) {
                winnerText += `<br><b>${match.team2} Vào Vòng 1-8! 🏆</b>`;
            } else {
                winnerText += `<br><b>Kết quả hòa sau 2 trận! 🚨</b><br><b>Cần xét tiêu chí phụ hoặc đấu lại.</b>`;
            }
        }

        matchesContainer.innerHTML += `<div class="match-box"><div class="match-title">Trận ${index + 1}</div>${match.team1} 🆚 ${match.team2}<br><br>Điểm số:<br>${scoreInputs}<br>Phạm lỗi:<br>${foulInputs}${winnerText}</div>`;
    });
    // Hiển thị 4 đội vé vớt tốt nhất
    showBestLosers();
}

function checkAndShowNextButton() {
    let allMatchesCompleted = matches.every(match => match.totalPoints1 !== 0 || match.totalPoints2 !== 0);
    document.getElementById("nextRoundButton").classList.toggle("hidden", !allMatchesCompleted);
}

function goToNextRound() {
    window.location.href = "1_16.html"; 
}

function showBestLosers() {
    let losers = [];

    matches.forEach(match => {
        let team1 = {
            name: match.team1,
            points: match.totalPoints1,
            goals: match.totalScore1,
            fouls: match.totalFoul1
        };
        let team2 = {
            name: match.team2,
            points: match.totalPoints2,
            goals: match.totalScore2,
            fouls: match.totalFoul2
        };

        if (match.totalPoints1 < match.totalPoints2) {
            losers.push(team1);
        } else if (match.totalPoints2 < match.totalPoints1) {
            losers.push(team2);
        } else {
            if (match.totalFoul1 > match.totalFoul2) {
                losers.push(team1);
            } else {
                losers.push(team2);
            }
        }
    });

    // Sắp xếp theo: Điểm ↓, Bàn thắng ↓, Lỗi ↑
    losers.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goals !== a.goals) return b.goals - a.goals;
        return a.fouls - b.fouls;
    });

    // Lấy 4 đội thua tốt nhất
    let bestLosers = losers.slice(0, 4);

    // Hiển thị danh sách đội vé vớt dưới dạng bảng
    let losersHTML = `
        <div class="table-container">
            <h2>🎖️ 4 Đội Hạng 3 Tốt Nhất 🎖️</h2>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Đội</th>
                        <th>Điểm</th>
                        <th>Bàn Thắng</th>
                        <th>Lỗi</th>
                    </tr>
                </thead>
                <tbody>`;

    bestLosers.forEach((team, index) => {
        losersHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><b>${team.name}</b></td>
                <td>${team.points}</td>
                <td>${team.goals}</td>
                <td>${team.fouls}</td>
            </tr>`;
    });

    losersHTML += `
                </tbody>
            </table>
        </div>`;

    document.getElementById("best-losers").innerHTML = losersHTML;
    }

function resetScores() {
    matches.forEach(match => {
        match.score1 = [0, 0, 0];
        match.score2 = [0, 0, 0];
        match.foul1 = [0, 0, 0];
        match.foul2 = [0, 0, 0];
        match.totalPoints1 = 0;
        match.totalPoints2 = 0;
        match.totalScore1 = 0;
        match.totalScore2 = 0;
        match.totalFoul1 = 0;
        match.totalFoul2 = 0;
    });

    saveToLocalStorage(); // Lưu dữ liệu sau reset
    updateNextRoundTeams(); // <--- Cập nhật 16 đội ngay khi xáo trộn
    renderMatches();
}

function saveToLocalStorage() {
    localStorage.setItem("matches0", JSON.stringify(matches));
}

function loadFromLocalStorage() {
    let savedMatches = localStorage.getItem("matches0");
    if (savedMatches) {
        matches = JSON.parse(savedMatches);
        renderMatches();
    }
}
function showNextRoundTeams() {
    let nextRoundData = localStorage.getItem("123");
    if (!nextRoundData) {
        document.getElementById("next-round-teams").innerHTML = "<h2>Không tìm thấy dữ liệu 16 đội.</h2>";
        return;
    }

    let nextRoundTeams = JSON.parse(nextRoundData);

    // Kiểm tra xem dữ liệu có đủ 16 đội hay không
    if (nextRoundTeams.length !== 16) {
        document.getElementById("next-round-teams").innerHTML = "<h2>Dữ liệu không hợp lệ! Không đủ 16 đội.</h2>";
        return;
    }

    // Hiển thị danh sách 16 đội vào vòng sau dưới dạng bảng
    let teamsHTML = `
        <div class="table-container">
            <h2>✅ Danh Sách 16 Đội Vào Vòng Tiếp Theo ✅</h2>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Đội</th>
                        <th>Điểm</th>
                        <th>Bàn Thắng</th>
                        <th>Lỗi</th>
                    </tr>
                </thead>
                <tbody>`;

    nextRoundTeams.forEach((team, index) => {
        teamsHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><b>${team.name}</b></td>
                <td>${team.points}</td>
                <td>${team.goals}</td>
                <td>${team.fouls}</td>
            </tr>`;
    });

    teamsHTML += `
                </tbody>
            </table>
        </div>`;

    document.getElementById("next-round-teams").innerHTML = teamsHTML;
}

function resetAndShuffleMatches() {
        // Xóa dữ liệu cũ và xáo trộn lại các đội
        localStorage.removeItem("matches0");
        shuffle(teams);
        matches = [];

        for (let i = 0; i < teams.length; i += 2) {
            let match = {
                team1: teams[i],
                team2: teams[i + 1],
                score1: [0, 0, 0],
                score2: [0, 0, 0],
                foul1: [0, 0, 0],
                foul2: [0, 0, 0],
                totalPoints1: 0,
                totalPoints2: 0,
                totalScore1: 0,
                totalScore2: 0,
                totalFoul1: 0,
                totalFoul2: 0
            };
            matches.push(match);
        }

        saveToLocalStorage(); // Lưu lại dữ liệu mới sau khi xáo trộn
        updateNextRoundTeams(); // <--- Cập nhật 16 đội ngay khi xáo trộn
        renderMatches(); // Hiển thị trận đấu mới
        // alert("Đã xáo trộn lại danh sách đội!");
    }

function updateNextRoundTeams() {
    let winners = [];
    let losers = [];

    matches.forEach(match => {
        let team1 = {
            name: match.team1,
            points: match.totalPoints1,
            goals: match.totalScore1,
            fouls: match.totalFoul1
        };
        let team2 = {
            name: match.team2,
            points: match.totalPoints2,
            goals: match.totalScore2,
            fouls: match.totalFoul2
        };

        if (match.totalPoints1 > match.totalPoints2) {
            winners.push(team1);
            losers.push(team2);
        } else if (match.totalPoints2 > match.totalPoints1) {
            winners.push(team2);
            losers.push(team1);
        } else {
            // Xét trường hợp hòa -> Ưu tiên đội phạm ít lỗi hơn
            if (match.totalFoul1 < match.totalFoul2) {
                winners.push(team1);
                losers.push(team2);
            } else {
                winners.push(team2);
                losers.push(team1);
            }
        }
    });

    // Sắp xếp losers theo: Điểm ↓, Bàn thắng ↓, Lỗi ↑
    losers.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goals !== a.goals) return b.goals - a.goals;
        return a.fouls - b.fouls;
    });

    // Lấy 4 đội hạng 3 tốt nhất
    const bestLosers = losers.slice(0, 4);

    // Kết hợp 12 đội thắng và 4 đội vé vớt thành 16 đội
    const nextRoundTeams = winners.concat(bestLosers);

    // ✅ Lưu danh sách 16 đội vào localStorage
    localStorage.setItem("123", JSON.stringify(nextRoundTeams));

    // ✅ Hiển thị danh sách 16 đội mới
    showNextRoundTeams();
}

randomizeMatches();