
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



