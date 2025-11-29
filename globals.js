const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const currentLevelElement = document.getElementById('current-level');
const progressBar = document.getElementById('progress-bar');

const timeValueElement = document.getElementById('time-value');
const bestTimeValueElement = document.getElementById('best-time-value');

const restartButton = document.getElementById('restart-button');
const settingsButton = document.getElementById('settings-button');

const modal = document.getElementById('message-modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const modalActions = document.getElementById('modal-actions');

const keyW = document.getElementById('key-w');
const keyA = document.getElementById('key-a');
const keyS = document.getElementById('key-s');
const keyD = document.getElementById('key-d');

let levelIndex = 0;
let bestTimes = {};
let fogOfWarEnabled = true;

let player = { row: 0, col: 0, size: 0 };

let gameActive = false;
let startTime = 0;
let timerInterval = null;