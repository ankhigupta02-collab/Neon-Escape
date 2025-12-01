
const VISIBILITY_RADIUS = 2.8;


let cellSize = 40;
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;

const MAZES = [
    [
        [1,1,1,1,1,1,1],
        [1,2,0,0,0,0,1],
        [1,1,1,0,1,0,1],
        [1,0,0,0,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,0,0,0,3,1],
        [1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1],
        [1,2,0,1,0,0,0,0,1],
        [1,0,0,1,0,1,1,0,1],
        [1,0,1,0,0,1,0,0,1],
        [1,0,1,1,1,1,0,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,2,0,0,1,0,0,0,0,0,1],
        [1,0,0,0,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,0,0,1,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,1,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
];

function formatTime(seconds) {
    if (!seconds && seconds !== 0) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")};
}

function updateTimer() {
    if (!gameActive) return;
    const elapsed = (Date.now() - startTime) / 1000;
    timeValueElement.textContent = formatTime(elapsed);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function startTimer() {
    if (timerInterval) return;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function updateBestTimeDisplay() {
    const best = bestTimes[levelIndex];
    bestTimeValueElement.textContent = formatTime(best);
}

function updateLevelDisplay() {
    currentLevelElement.textContent = levelIndex + 1;
    const progress = ((levelIndex + 1) / MAZES.length) * 100;
    progressBar.style.width = ${progress}%;
}




function findStart(maze) {
    for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
            if (maze[r][c] === 2) return { row: r, col: c };
        }
    }
    return null;
}

function drawPlayer() {
    const x = player.col * cellSize + cellSize / 2;
    const y = player.row * cellSize + cellSize / 2;
    const color = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue');

    ctx.beginPath();
    ctx.arc(x, y, player.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawMaze() {
    const maze = MAZES[levelIndex];
    const rows = maze.length;
    const cols = maze[0].length;

    const container = document.getElementById('maze-area');
    let usable = Math.min(container.clientWidth, container.clientHeight);

    if (window.innerWidth <= 768) usable = container.clientWidth - 20;

    cellSize = Math.floor(usable / Math.max(rows, cols));
    if (cellSize < 10) cellSize = 10;

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    player.size = cellSize * 0.7;

    const pathColor = getComputedStyle(document.documentElement).getPropertyValue('--path-color');
    const wallColor = getComputedStyle(document.documentElement).getPropertyValue('--wall-color');

    ctx.fillStyle = pathColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * cellSize;
            const y = r * cellSize;

            const dx = c - player.col;
            const dy = r - player.row;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const visible = !fogOfWarEnabled || dist < VISIBILITY_RADIUS;

            if (maze[r][c] === 1) {
                ctx.fillStyle = wallColor;
                ctx.fillRect(x, y, cellSize, cellSize);
            } 
            else if (maze[r][c] === 3) {
                const goal = getComputedStyle(document.documentElement).getPropertyValue('--neon-orange');
                const pad = cellSize * 0.2;

                ctx.fillStyle = goal;
                ctx.shadowColor = goal;
                ctx.shadowBlur = visible ? 10 : 0;
                ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
                ctx.shadowBlur = 0;
            }

            if (fogOfWarEnabled) {
                let opacity = 0;

                if (dist >= VISIBILITY_RADIUS) opacity = 0.98;
                else if (dist >= VISIBILITY_RADIUS - 1) opacity = (dist - (VISIBILITY_RADIUS - 1));

                if (opacity > 0) {
                    ctx.fillStyle = rgba(10,10,42,${opacity});
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
            }
        }
    }

    drawPlayer();
}


function movePlayer(dr, dc) {
    if (!gameActive) return;

    const maze = MAZES[levelIndex];
    const nr = player.row + dr;
    const nc = player.col + dc;

    if (nr < 0 || nr >= maze.length || nc < 0 || nc >= maze[0].length) return;
    if (maze[nr][nc] === 1) return;

    player.row = nr;
    player.col = nc;

    drawMaze();

    if (maze[nr][nc] === 3) levelComplete();
}


function initializeLevel(i) {
    levelIndex = i % MAZES.length;

    const start = findStart(MAZES[levelIndex]);
    if (!start) return;

    player.row = start.row;
    player.col = start.col;

    gameActive = true;

    stopTimer();
    startTimer();

    updateLevelDisplay();
    updateBestTimeDisplay();

    drawMaze();
    saveGameState();
}
function levelComplete() {
    gameActive = false;
    stopTimer();

    const finalTime = (Date.now() - startTime) / 1000;
    const timeText = formatTime(finalTime);

    saveNewBestTime(levelIndex, finalTime);

    modalTitle.textContent = (levelIndex + 1 < MAZES.length)
        ? "PROTOCOL COMPLETE"
        : "SYSTEM OFFLINE";

    modalText.textContent = (levelIndex + 1 < MAZES.length)
        ? Time: ${timeText}. Prepare for Protocol ${levelIndex + 2}.
        : SUCCESS! You defeated all ${MAZES.length} protocols in ${timeText}!;

    modalActions.innerHTML = "";

    const btn = document.createElement("button");
    btn.textContent = (levelIndex + 1 < MAZES.length)
        ? "NEXT PROTOCOL"
        : "RESTART SYSTEM";
 btn.onclick = () => {
        modal.style.display = "none";
        initializeLevel(levelIndex + 1);
    };

    modalActions.appendChild(btn);
    modal.style.display = "flex";
}

function restartCurrentLevel() {
    stopTimer();

    showConfirmationModal(
        "RESTART PROTOCOL?",
        Restart Protocol ${levelIndex + 1}? Current time will be lost.,
        "CONFIRM RESTART",
        "CANCEL",
        () => {
            modal.style.display = "none";
            initializeLevel(levelIndex);
        },
        () => {
            modal.style.display = "none";
        if (gameActive) startTimer();
        }
    );
}


function showConfirmationModal(title, text, confirm, cancel, onConfirm, onCancel) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalActions.innerHTML = "";

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "modal-cancel-button";
    cancelBtn.textContent = cancel;
    cancelBtn.onclick = onCancel;
    modalActions.appendChild(cancelBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.id = "modal-button";
    confirmBtn.textContent = confirm;
    confirmBtn.onclick = onConfirm;
    modalActions.appendChild(confirmBtn);

    modal.style.display = "flex";
}
function toggleFogOfWar() {
    fogOfWarEnabled = !fogOfWarEnabled;
    saveGameState();
    drawMaze();
    handleSettingsClick(true);
}

function handleSettingsClick(refresh = false) {
    if (!refresh && gameActive) stopTimer();

    modalTitle.textContent = "SYSTEM SETTINGS";
    modalText.textContent = Fog of War is currently ${fogOfWarEnabled ? "ENABLED" : "DISABLED"}.;

    modalActions.innerHTML = "";

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "fow-toggle-button";
    toggleBtn.textContent =
        FOG OF WAR: ${fogOfWarEnabled ? "ENABLED (HARD)" : "DISABLED (EASY)"};
    toggleBtn.className = fogOfWarEnabled ? "toggle-button toggle-on" : "toggle-button toggle-off";
       toggleBtn.onclick = toggleFogOfWar;
    modalActions.appendChild(toggleBtn);

    const closeBtn = document.createElement("button");
    closeBtn.id = "modal-close-button";
    closeBtn.textContent = "CLOSE SETTINGS";
    closeBtn.onclick = () => {
        modal.style.display = "none";
        if (gameActive) startTimer();
    };
    modalActions.appendChild(closeBtn);

    if (!refresh) modal.style.display = "flex";
}

function handleKeydown(e) {
    if (!gameActive || modal.style.display === "flex") return;

    let dr = 0, dc = 0, key = null;

    switch (e.key) {
        case "w": case "W": case "ArrowUp": dr = -1; key = keyW; break;
        case "s": case "S": case "ArrowDown": dr = 1; key = keyS; break;
        case "a": case "A": case "ArrowLeft": dc = -1; key = keyA; break;
        case "d": case "D": case "ArrowRight": dc = 1; key = keyD; break;
        default: return;
    }

    e.preventDefault();
    movePlayer(dr, dc);

    if (key) {
        key.classList.add("active");
        setTimeout(() => key.classList.remove("active"), 100);
    }
}










