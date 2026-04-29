function updateClock() {
    let now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    let ampm;
    if (hours >= 12) {
        ampm = "PM";
    } else {
        ampm = "AM";
    }

    hours = hours % 12;
    hours = hours ? hours : 12;

    if (minutes < 10) 
    minutes = "0" + minutes;

    document.getElementById("clock").innerText =
    hours + ":" + minutes + " " + ampm;   
}
setInterval(updateClock, 1000);
updateClock();

// Dynamic Greeting (Morning / Evening)

let hour = new Date().getHours();
let greeting = "Good Evening";

    if (hour < 12) 
        greeting = "Good Morning";
    else if (hour < 18) 
            greeting = "Good Afternoon";

document.getElementById("greeting-text").innerText = greeting + ", User";

// Search Button
let searchButton = document.getElementById("search-btn");
let searchField = document.getElementById("search-input");
let searchProvider = document.getElementById("search-engine");

searchButton.addEventListener("click", function () {
    let queryText = searchField.value.trim();

    if (queryText !== "") {
        window.location.href = searchProvider.value + encodeURIComponent(queryText);
    }
});

// Enter Key Search

document.getElementById("search-input").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        document.getElementById("search-btn").click();
    }
});

// Add task
const btn = document.getElementById("add-task-btn");
const input = document.getElementById("task-input");
const container = document.getElementById("tasks-container");

btn.onclick = () => {
    const text = input.value.trim();
    if (!text) return;

    const task = document.createElement("div");
    task.className = "task-item";

    task.innerHTML = `
        <span class="material-symbols-rounded task-check">radio_button_unchecked</span>
        <span class="task-text">${text}</span>
        <span class="material-symbols-rounded task-del">delete</span>
    `;

    container.appendChild(task);
    input.value = "";
};

//Focus Timer

const display = document.getElementById("timer-time");
const startBtn = document.getElementById("timer-start");
const stopBtn = document.getElementById("timer-stop");
const resetBtn = document.getElementById("timer-reset");
const plusBtn = document.getElementById("timer-plus");
const minusBtn = document.getElementById("timer-minus");

let time = 25 * 60; 
let interval;

function updateDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.innerText = `${minutes}:${seconds}`;
}

startBtn.onclick = () => {
    clearInterval(interval); 
    
    interval = setInterval(() => {
        if (time > 0) {
            time--;
            updateDisplay();
        } else {
            clearInterval(interval);
            alert("Time's up!");
        }
    }, 1000);
};

stopBtn.onclick = () => {
    clearInterval(interval); 
};

resetBtn.onclick = () => {
    clearInterval(interval);
    time = 25 * 60;
    updateDisplay();
};

plusBtn.onclick = () => {
    time += 60;
    updateDisplay();
};

minusBtn.onclick = () => {
    if (time > 60) {
        time -= 60;
        updateDisplay();
    }
};

updateDisplay();

// Note Local storage
const note = document.getElementById("note-content");

note.innerHTML = localStorage.getItem("note") || "";

note.addEventListener("input", () => {
    localStorage.setItem("note", note.innerHTML);
});

