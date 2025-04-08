// teams.js - Quản lý tên đội
const defaultTeams = [
    "Đội Tuấn", "Đội 2", "Đội 3", "Đội 4",
    "Đội Hằng", "Đội 6", "Đội 7", "Đội 8",
    "Đội Vũ", "Đội 10", "Đội 11", "Đội 12",
    "Đội D", "Đội 14", "Đội 15", "Đội 16",
    "Đội 17", "Đội 18", "Đội 19", "Đội 20",
    "Đội 21", "Đội 22", "Đội 23", "Đội 24"
];

// Lấy tên đội từ localStorage, nếu chưa có thì dùng defaultTeams
function getTeams() {
    const savedTeams = localStorage.getItem("teamNames");
    return savedTeams ? JSON.parse(savedTeams) : defaultTeams;
}

// Lưu tên đội vào localStorage
function saveTeams(teams) {
    localStorage.setItem("teamNames", JSON.stringify(teams));
}

// Reset tên đội về mặc định
function resetTeams() {
    localStorage.removeItem("teamNames");
    alert("Đã reset tên đội về mặc định.");
    location.reload();
}

// Hiển thị form nhập tên đội ở 24.html
function showTeamForm() {
    const teams = getTeams();
    let formHTML = `
        <div class="table-container">
            <h2>📝 Nhập Tên Đội 📝</h2>
            <form id="teamForm">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên Đội</th>
                        </tr>
                    </thead>
                    <tbody>`;

    teams.forEach((team, index) => {
        formHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><input type="text" name="team${index}" value="${team}" /></td>
            </tr>`;
    });

    formHTML += `
                    </tbody>
                </table>
                <button type="button" onclick="updateTeams()">💾 Lưu Tên Đội</button>
                <button type="button" onclick="resetTeams()">🔄 Reset Tên Đội</button>
            </form>
        </div>`;

    document.getElementById("team-form-container").innerHTML = formHTML;
}

// Cập nhật tên đội từ form và lưu vào localStorage
function updateTeams() {
    const form = document.getElementById("teamForm");
    let updatedTeams = [];

    for (let i = 0; i < 24; i++) {
        updatedTeams.push(form[`team${i}`].value);
    }

    saveTeams(updatedTeams);
    alert("Đã cập nhật tên đội thành công!");
    location.reload();
}
