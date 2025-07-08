let seconds = 0;
let minutes = 0;
let hours = 0;
let timer;
let isRunning = false;

function updateDisplay() {
    let h = hours < 10 ? "0" + hours : hours;
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("display").innerText = `${h}:${m}:${s}`;
}

function startStop() {
    if (!isRunning) {
        timer = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
            updateDisplay();
        }, 1000);
        isRunning = true;
        document.querySelector(".buttons button").innerText = "Pause";
    } else {
        clearInterval(timer);
        isRunning = false;
        document.querySelector(".buttons button").innerText = "Start";
    }
}

function reset() {
    clearInterval(timer);
    seconds = 0;
    minutes = 0;
    hours = 0;
    isRunning = false;
    updateDisplay();
    document.querySelector(".buttons button").innerText = "Start";
}
