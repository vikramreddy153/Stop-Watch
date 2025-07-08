let swSec = 0, swMin = 0, swHr = 0;
let swTimer, swRunning = false;
let alarmList = [];
let currentAudio = null;
let snoozeTimeout = null;

// Clock
setInterval(() => {
  const now = new Date();
  document.getElementById("liveClock").innerText = now.toLocaleTimeString();
}, 1000);

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
  const icon = document.getElementById("themeToggle");
  icon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// Screen switcher with active color
function switchScreen(id, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// Stopwatch
function updateStopwatch() {
  swSec++;
  if (swSec === 60) { swSec = 0; swMin++; }
  if (swMin === 60) { swMin = 0; swHr++; }
  const h = swHr.toString().padStart(2, '0');
  const m = swMin.toString().padStart(2, '0');
  const s = swSec.toString().padStart(2, '0');
  document.getElementById("stopwatchDisplay").innerText = `${h}:${m}:${s}`;
}

function startStopwatch() {
  const btn = event.target;
  if (!swRunning) {
    swTimer = setInterval(updateStopwatch, 1000);
    swRunning = true;
    btn.innerText = "Pause";
  } else {
    clearInterval(swTimer);
    swRunning = false;
    btn.innerText = "Start";
  }
}

function resetStopwatch() {
  clearInterval(swTimer);
  swSec = swMin = swHr = 0;
  swRunning = false;
  document.getElementById("stopwatchDisplay").innerText = "00:00:00";
  document.querySelectorAll(".buttons button")[0].innerText = "Start";
}

// Alarms
function addAlarm() {
  const time = document.getElementById("alarmTime").value;
  const label = document.getElementById("alarmLabel").value || "Alarm";
  const file = document.getElementById("alarmAudio").files[0];
  const repeat = document.getElementById("repeatAlarm").checked;
  if (!time) return alert("Please select time");

  const audioURL = file ? URL.createObjectURL(file) : null;
  alarmList.push({ time, label, audioURL, repeat });

  const li = document.createElement("li");
  li.innerHTML = `${label} - ${time} ${repeat ? '(Daily)' : ''} <button onclick="removeAlarm(this)">❌</button>`;
  li.dataset.time = time;
  document.getElementById("alarmList").appendChild(li);
}

function removeAlarm(btn) {
  const li = btn.parentElement;
  const time = li.dataset.time;
  alarmList = alarmList.filter(a => a.time !== time);
  li.remove();
}

function clearAllAlarms() {
  alarmList = [];
  document.getElementById("alarmList").innerHTML = "";
}

function stopCurrentAlarm() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (snoozeTimeout) {
    clearTimeout(snoozeTimeout);
    snoozeTimeout = null;
  }
}

function snoozeAlarm() {
  if (!currentAudio) return alert("No alarm is ringing!");
  stopCurrentAlarm();
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  const snoozeTime = now.toTimeString().slice(0, 5);
  alarmList.push({ time: snoozeTime, label: "Snoozed Alarm", audioURL: null, repeat: false });
  const li = document.createElement("li");
  li.innerHTML = `Snoozed Alarm - ${snoozeTime} <button onclick="removeAlarm(this)">❌</button>`;
  li.dataset.time = snoozeTime;
  document.getElementById("alarmList").appendChild(li);
}

// Alarm checker
setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  alarmList.forEach((alarm, index) => {
    if (alarm.time === currentTime && !currentAudio) {
      currentAudio = alarm.audioURL
        ? new Audio(alarm.audioURL)
        : document.getElementById("defaultBeep").cloneNode();

      currentAudio.play().catch(e => console.error("Autoplay error:", e));
      alert(`🔔 ${alarm.label} is ringing!`);

      if (!alarm.repeat) {
        alarmList.splice(index, 1);
        const items = document.querySelectorAll("#alarmList li");
        if (items[index]) items[index].remove();
      }
    }
  });
}, 1000);

function updateAnalogClock() {
  const now = new Date();
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = now.getHours() % 12 + min / 60;

  const secDeg = sec * 6;
  const minDeg = min * 6;
  const hrDeg = hr * 30;

  document.getElementById("secondHand").style.transform = `rotate(${secDeg}deg)`;
  document.getElementById("minuteHand").style.transform = `rotate(${minDeg}deg)`;
  document.getElementById("hourHand").style.transform = `rotate(${hrDeg}deg)`;

  document.getElementById("clockDate").innerText = now.toDateString();

  if (Math.floor(sec) === sec) {
    const tick = document.getElementById("tickSound");
    if (tick) {
      tick.pause();
      tick.currentTime = 0;
      tick.play().catch(() => {});
    }
  }
}

function drawClockNumbers() {
  const container = document.getElementById("clockNumbers");
  if (!container) {
    console.error("clockNumbers container not found");
    return;
  }
  container.innerHTML = "";
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 100;
    const center = 125;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    const num = document.createElement("div");
    num.className = "clock-num";
    num.style.left = `${x}px`;
    num.style.top = `${y}px`;
    num.innerText = i;
    container.appendChild(num);
  }
}

window.onload = () => {
  drawClockNumbers();
  updateAnalogClock();
  setInterval(updateAnalogClock, 1000 / 30);
};
