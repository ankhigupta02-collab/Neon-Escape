
window.addEventListener("keydown", handleKeydown);
canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

window.addEventListener("resize", drawMaze);

restartButton.addEventListener("click", restartCurrentLevel);
settingsButton.addEventListener("click", () => handleSettingsClick(false));

keyW.addEventListener("click", () => handleControlClick(-1, 0, keyW));
keyA.addEventListener("click", () => handleControlClick(0, -1, keyA));
keyS.addEventListener("click", () => handleControlClick(1, 0, keyS));
keyD.addEventListener("click", () => handleControlClick(0, 1, keyD))


async function startGame() {
    await loadBestTimes();
    await loadGameState();

    initializeLevel(levelIndex);
}


startGame();