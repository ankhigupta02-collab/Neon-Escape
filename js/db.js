const DB_NAME = 'NeonEscapeDB'; 
const STORE_NAME = 'gameState';
const BEST_TIMES_STORE_NAME = 'bestTimes';
const DB_VERSION = 3;


function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject("Database error");

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(BEST_TIMES_STORE_NAME)) {
                db.createObjectStore(BEST_TIMES_STORE_NAME, { keyPath: 'levelIndex' });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
    });
}

async function saveGameState() {
    try {
        
        const db = await openDB();
        const tx = db.transaction([STORE_NAME], "readwrite");
        const store = tx.objectStore(STORE_NAME);

        const data = { id: 1, levelIndex, fogOfWarEnabled };
        store.put(data);

        return tx.complete;
    } catch (err) {
        console.error("Failed to save game state:", err);
    }
}

async function loadGameState() {
    try {
        const db = await openDB();
        const tx = db.transaction([STORE_NAME], "readonly");
        const store = tx.objectStore(STORE_NAME);

        const res = await store.get(1);

        return new Promise((resolve) => {
            tx.oncomplete = () => {
                if (res.result) {
                    levelIndex = res.result.levelIndex ?? 0;
                    fogOfWarEnabled = res.result.fogOfWarEnabled ?? true;
                }
                resolve();
            };
        });
    } catch (err) {
        console.error("Failed to load:", err);
    }
}

async function loadBestTimes() {
    try {
        const db = await openDB();
        const tx = db.transaction([BEST_TIMES_STORE_NAME], "readonly");
        const store = tx.objectStore(BEST_TIMES_STORE_NAME);

        const req = store.getAll();

        return new Promise((resolve) => {
            req.onsuccess = () => {
                req.result.forEach(item => bestTimes[item.levelIndex] = item.bestTime); 
                resolve();
            };
        });

    } catch (err) {
        console.error("Failed to load best times:", err);
    }

}

async function saveNewBestTime(levelIndex, newTime) {
    if (bestTimes[levelIndex] == null || newTime < bestTimes[levelIndex]) {
        bestTimes[levelIndex] = newTime;

        const db = await openDB();
        const tx = db.transaction([BEST_TIMES_STORE_NAME], "readwrite");
        tx.objectStore(BEST_TIMES_STORE_NAME).put({
            levelIndex, bestTime: newTime
        });

        return tx.complete;
    }
}
