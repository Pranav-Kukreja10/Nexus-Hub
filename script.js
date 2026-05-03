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

// Focus Timer

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


// Daily Tasks — localStorage-backed with 24-hour auto-expiry

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const tasksContainer = document.getElementById("tasks-container");
const progressText = document.getElementById("task-progress-text");
const progressBar = document.getElementById("task-progress-bar");

const TASKS_STORAGE_KEY = "nexus_daily_tasks";
const TASK_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// --- Persistence helpers ---

function loadTasks() {
    try {
        const raw = localStorage.getItem(TASKS_STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveTasks(tasks) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

function pruneExpiredTasks(tasks) {
    const now = Date.now();
    return tasks.filter(t => (now - t.createdAt) < TASK_TTL_MS);
}

function getTasksFromStorage() {
    let tasks = loadTasks();
    const before = tasks.length;
    tasks = pruneExpiredTasks(tasks);
    if (tasks.length !== before) saveTasks(tasks); // persist the pruning
    return tasks;
}

// --- DOM rendering ---

function updateProgress() {
    const allTasks = tasksContainer.getElementsByClassName("task-item");
    const completedTasks = tasksContainer.getElementsByClassName("done");

    const totalCount = allTasks.length;
    const completedCount = completedTasks.length;
    const percentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    progressText.innerText = `${completedCount} / ${totalCount} done`;
    progressBar.style.width = percentage + "%";
}

function createTaskElement(taskData) {
    const newTaskItem = document.createElement("div");
    newTaskItem.className = "task-item" + (taskData.done ? " done" : "");
    newTaskItem.dataset.id = taskData.id;

    newTaskItem.innerHTML =
        '<span class="material-symbols-rounded task-check">' +
            (taskData.done ? "check_circle" : "radio_button_unchecked") +
        '</span>' +
        '<span class="task-text">' + taskData.text + '</span>' +
        '<span class="material-symbols-rounded task-del">delete</span>';

    const checkButton = newTaskItem.querySelector(".task-check");
    const deleteButton = newTaskItem.querySelector(".task-del");
    const textSpan = newTaskItem.querySelector(".task-text");

    function toggleTask() {
        const isDone = newTaskItem.classList.toggle("done");
        checkButton.innerText = isDone ? "check_circle" : "radio_button_unchecked";
        // Persist toggle
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === taskData.id);
        if (task) { task.done = isDone; saveTasks(tasks); }
        updateProgress();
    }

    checkButton.addEventListener("click", toggleTask);
    textSpan.addEventListener("click", toggleTask);

    deleteButton.addEventListener("click", function () {
        newTaskItem.remove();
        // Persist deletion
        let tasks = loadTasks();
        tasks = tasks.filter(t => t.id !== taskData.id);
        saveTasks(tasks);
        updateProgress();
    });

    return newTaskItem;
}

function renderAllTasks() {
    tasksContainer.innerHTML = "";
    const tasks = getTasksFromStorage();
    tasks.forEach(taskData => {
        tasksContainer.appendChild(createTaskElement(taskData));
    });
    updateProgress();
}

// --- Adding a new task ---

function addTask() {
    const taskTextValue = taskInput.value.trim();
    if (taskTextValue === "") return;

    const taskData = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        text: taskTextValue,
        done: false,
        createdAt: Date.now()
    };

    // Persist first, then render
    const tasks = loadTasks();
    tasks.push(taskData);
    saveTasks(tasks);

    tasksContainer.appendChild(createTaskElement(taskData));
    taskInput.value = "";
    updateProgress();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// --- Initialise on page load ---
renderAllTasks();


// Quick Notes

const notesArea = document.getElementById("note-content"); 
const savedNotes = localStorage.getItem("nexusANotes"); 

if (savedNotes != null) {
    notesArea.innerHTML = savedNotes; 
}

notesArea.addEventListener("input", function () {
    let currentContent = notesArea.innerHTML; 
    localStorage.setItem("nexusNotes", currentContent);
});



