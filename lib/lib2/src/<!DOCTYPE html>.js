html >
    lang;
"en" >
    charset;
"UTF-8" /  >
    Let;
's Learn to Read!</title>;;
body;
{
    font - family;
    'Comic Sans MS', sans - serif;
    text - align;
    center;
    margin: 0;
    padding: 20;
    px;
    /* No background color for a clean look */
}
h1;
{
    color: #ff6f61;
}
instructions;
{
    font - size;
    20;
    px;
    color: #;
    333;
    margin - bottom;
    20;
    px;
}
timer - controls;
{
    margin - bottom;
    20;
    px;
}
timer - controls;
span;
{
    font - size;
    20;
    px;
    margin: 0;
    10;
    px;
}
button;
{
    padding: 10;
    px;
    20;
    px;
    font - size;
    18;
    px;
    background - color;
    #ff6f61;
    border: none;
    color: white;
    border - radius;
    5;
    px;
    cursor: pointer;
    margin: 5;
    px;
}
button: hover;
{
    background - color;
    #ff8a80;
}
grid;
{
    display: grid;
    grid - template - columns;
    repeat(6, 1, fr);
    gap: 10;
    px;
    width: 100 % ;
    max - width;
    800;
    px;
    margin: 0;
    auto;
}
cell;
{
    background - color;
    #fff;
    border: 2;
    px;
    solid;
    #ff6f61;
    border - radius;
    10;
    px;
    padding: 20;
    px;
    font - size;
    20;
    px;
    font - weight;
    bold;
    cursor: pointer;
    transition: transform;
    0.2;
    s, background - color;
    0.3;
    s;
    user - select;
    none;
    overflow: hidden;
}
cell: hover;
{
    transform: scale(1.1);
}
cell.selected;
{
    background - color;
    #a8e6cf;
    border - color;
    #;
    56;
    ab2f;
    color: #fff;
}
new  - words - container;
{
    margin - top;
    20;
    px;
}
progress - container;
{
    width: 100 % ;
    max - width;
    800;
    px;
    background - color;
    #ddd;
    border - radius;
    10;
    px;
    margin: 20;
    px;
    auto;
    overflow: hidden;
}
progress - bar;
{
    width: 0 % ;
    height: 20;
    px;
    background - color;
    #ff6f61;
    transition: width;
    1;
    s;
    linear;
}
modals;
{
    display: none;
    position: fixed;
    z - index;
    1000;
    left: 50 % ;
    top: 50 % ;
    transform: translate(-50 % , -50 % );
    background: white;
    padding: 20;
    px;
    border - radius;
    10;
    px;
    box - shadow;
    0;
    0;
    10;
    px;
    rgba(0, 0, 0, 0.3);
}
modals - overlay;
{
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100 % ;
    height: 100 % ;
    background: rgba(0, 0, 0, 0.5);
    z - index;
    999;
}
/* Flash overlay styling */
#flashOverlay;
{
    position: fixed;
    top: 0;
    left: 0;
    width: 100 % ;
    height: 100 % ;
    background - color;
    yellow;
    opacity: 0;
    pointer - events;
    none;
    transition: opacity;
    0.2;
    s;
    ease - out;
    z - index;
    9999;
}
/style>
    < /head>
    < body >
    Heart;
Words;
from;
Gabby < /h1>
    < !--Timer;
Controls;
at;
the;
Top-- >
    class {
    };
"timer-controls" >
    class {
    };
"button";
onclick = "startTimer()" > Start;
Timer < /button>
    < button;
class {
}
"button";
onclick = "stopTimer()" > Stop;
Timer < /button>
    < button;
class {
}
"button";
onclick = "resetTimer()" > Reset;
Timer < /button>
    < br /  > />
    < div;
class {
}
"progress-container" >
    class {
    };
"progress-bar";
id = "progressBar" > /div>
    < /div>
    < span > Timer;
id;
"timer" > 0;
0 < /span></span >
    Score;
id;
"highlightCount" > 0 < /span></span >
    /div>
    < div;
class {
}
"grid";
id = "grid" >
    --Words;
will;
appear;
here-- >
    /div>
    < div;
class {
}
"new-words-container" >
    class {
    };
"button";
onclick = "generateNewGrid()" > New;
Words < /button>
    < /div>
    < div;
class {
}
"modals-overlay";
id = "modalOverlay" > /div>
    < div;
class {
}
"modals";
id = "scoreModal" >
    Score;
id;
"finalScore" > 0 < /span></p >
    class {
    };
"button";
onclick = "closeModal()" > Close < /button>
    < /div>
    < !--Flash;
overlay;
element-- >
    id;
"flashOverlay" > (/div>);
let timerInterval;
let progressBarInterval;
let secondsElapsed = 0;
let progress = 0;
function updateTimerDisplay() {
    let minutes = Math.floor(secondsElapsed / 60);
    let seconds = secondsElapsed % 60;
    document.getElementById("timer").textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
function startTimer() {
    if (timerInterval)
        return;
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimerDisplay();
    }, 1000);
    progressBarInterval = setInterval(() => {
        progress += 100 / 60;
        document.getElementById("progressBar").style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(timerInterval);
            clearInterval(progressBarInterval);
            celebrate();
            celebrate();
            celebrate();
            celebrate();
            openModal();
        }
    }, 1000);
}
function stopTimer() {
    clearInterval(timerInterval);
    clearInterval(progressBarInterval);
    timerInterval = null;
    progressBarInterval = null;
}
function resetTimer() {
    stopTimer();
    secondsElapsed = 0;
    progress = 0;
    updateTimerDisplay();
    document.getElementById("progressBar").style.width = "0%";
}
function openModal() {
    document.getElementById("finalScore").textContent = document.getElementById("highlightCount").textContent;
    document.getElementById("modalOverlay").style.display = "block";
    document.getElementById("scoreModal").style.display = "block";
}
function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("scoreModal").style.display = "none";
}
let wordList = [
    "a", "am", "an", "and", "do", "go", "I", "into", "is", "my", "no", "of", "said", "so", "the", "to",
    "are", "as", "for", "he", "her", "his", "me", "not", "or", "see", "she", "that", "this", "was", "with", "you", "your",
    "about", "all", "be", "each", "from", "get", "good", "have", "like", "little", "look", "more", "out", "put", "says", "they", "very", "what", "when", "who",
    "again", "day", "does", "goes", "off", "only", "other", "say", "which"
];
wordList.concat([
    "any", "by", "come", "draw", "first", "friend", "front", "half", "know", "love",
    "many", "my", "pretty", "saw", "some", "talk", "try", "two", "walk", "why"
]);
wordList.concat([
    "blue", "could", "done", "funny", "gone", "happen", "here", "listen", "myself", "often",
    "once", "one", "open", "problem", "should", "their", "there", "these", "those", "true",
    "use", "where"
]);
wordList.concat([
    "almost", "another", "before", "both", "brother", "children", "color", "course", "during",
    "earth", "father", "four", "heart", "learn", "mother", "sure", "wind", "word", "work",
    "world", "yours"
]);
wordList.concat([
    "above", "against", "ahead", "around", "away", "because", "been", "break", "busy",
    "buy", "bye", "carry", "early", "eight", "family", "great", "heavy", "instead",
    "nothing", "people", "please", "ready"
]);
// Generate a random word following a simple CEV or CEVE pattern.
function generateRandomWord() {
    const consonants = "bcdfghjklmnpqrstvwxyz";
    const vowels = "aeiou";
    return wordList[Math.floor(Math.random() * wordList.length)];
}
// Update the count of highlighted words.
function updateHighlightCount() {
    const count = document.querySelectorAll('.cell.selected').length;
    document.getElementById("highlightCount").textContent = count;
}
// Flash the screen with a quick yellow overlay.
function flashScreen() {
    const flash = document.getElementById("flashOverlay");
    flash.style.opacity = 1;
    setTimeout(() => {
        flash.style.opacity = 0;
    }, 100); // Flash duration in milliseconds
}
// Create a single AudioContext for playing sounds.
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// Play a short affirmative beep.
function playAffirmativeSound() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    oscillator.stop(audioCtx.currentTime + 0.1);
}
// Create a new grid of words.
function generateNewGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = ""; // Clear the previous grid
    // Create 36 cells (a 6x6 grid)
    for (let i = 0; i < 36; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = generateRandomWord();
        // Toggle the "selected" state when a cell is clicked.
        cell.addEventListener("click", function () {
            const wasSelected = cell.classList.contains("selected");
            cell.classList.toggle("selected");
            // When the cell is being highlighted (selected now):
            if (!wasSelected && cell.classList.contains("selected")) {
                playAffirmativeSound();
                // If the timer is 1 minute or more, flash the screen.
                if (secondsElapsed >= 60) {
                    flashScreen();
                }
            }
            updateHighlightCount();
        });
        grid.appendChild(cell);
    }
    // Reset highlighted count after creating a new grid.
    updateHighlightCount();
}
// Initialize the grid and timer display when the page loads.
generateNewGrid();
updateTimerDisplay();
/script>
    < /body>
    < /html>;
//# sourceMappingURL=%3C!DOCTYPE%20html%3E.js.map
//# sourceMappingURL=%3C!DOCTYPE%20html%3E.js.map