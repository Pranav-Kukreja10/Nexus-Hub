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
const NOTE_PLACEHOLDER = "Type here to start writing...";

function setNotePlaceholder() {
    note.textContent = NOTE_PLACEHOLDER;
    note.classList.add("note-placeholder");
}

function clearNotePlaceholder() {
    if (note.classList.contains("note-placeholder")) {
        note.textContent = "";
        note.classList.remove("note-placeholder");
    }
}

const savedNote = localStorage.getItem("note");
if (savedNote && savedNote.trim() !== "") {
    note.textContent = savedNote;
    note.classList.remove("note-placeholder");
} else {
    setNotePlaceholder();
}

note.addEventListener("focus", () => {
    clearNotePlaceholder();
});

note.addEventListener("blur", () => {
    const content = note.textContent.trim();
    if (content === "") {
        localStorage.removeItem("note");
        setNotePlaceholder();
    } else {
        localStorage.setItem("note", note.textContent);
    }
});

note.addEventListener("input", () => {
    if (!note.classList.contains("note-placeholder")) {
        const content = note.textContent.trim();
        if (content === "") {
            localStorage.removeItem("note");
        } else {
            localStorage.setItem("note", note.textContent);
        }
    }
});


// Daily Tasks 

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const tasksContainer = document.getElementById("tasks-container");
const progressText = document.getElementById("task-progress-text");
const progressBar = document.getElementById("task-progress-bar");

const TASKS_STORAGE_KEY = "nexus_daily_tasks";
const TASK_TTL_MS = 24 * 60 * 60 * 1000; 



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
    if (tasks.length !== before) saveTasks(tasks); 
    return tasks;
}



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


//Theme


// ==========================================
    // THEME & CUSTOMIZATION LOGIC
    // ==========================================

    let editThemeBtn = document.querySelector(".edit-btn");
    let themePopup = document.getElementById("theme-popup");
    let themeButtons = document.querySelectorAll(".theme-btn");
    let accentPicker = document.getElementById("custom-accent");
    let bgPicker = document.getElementById("custom-bg");
    let rootStyle = document.documentElement.style;

    // Memory variables to remember user choices
    let savedTheme = localStorage.getItem("nexusTheme") || "dark";
    let savedAccent = localStorage.getItem("nexusAccent") || "#7c6eff";
    let savedBg = localStorage.getItem("nexusBg") || "#0e1015";

    // Function to apply preset themes
    function applyTheme(themeName) {
        document.body.className = ""; 
        
        switch(themeName) {
            case "dark":
                rootStyle.setProperty("--bg", savedBg); // Uses custom bg for default mode
                rootStyle.setProperty("--text", "#e8eaf2");
                rootStyle.setProperty("--glass", "#FFFFFF0F");
                rootStyle.setProperty("--border", "#FFFFFF17");
                break;
            case "light":
                rootStyle.setProperty("--bg", "#f4f5f9");
                rootStyle.setProperty("--text", "#1a1d2e");
                rootStyle.setProperty("--glass", "#0000000A"); 
                rootStyle.setProperty("--border", "#00000017");
                break;
            case "gradient":
                rootStyle.setProperty("--bg", "transparent");
                rootStyle.setProperty("--text", "#e8eaf2");
                rootStyle.setProperty("--glass", "#FFFFFF0F");
                rootStyle.setProperty("--border", "#FFFFFF17");
                document.body.classList.add("bg-gradient");
                break;
            case "hacker":
                rootStyle.setProperty("--bg", "#050505");
                rootStyle.setProperty("--text", "#00ff00");
                rootStyle.setProperty("--glass", "#00ff000A");
                rootStyle.setProperty("--border", "#00ff0033");
                break;
            case "ocean":
                rootStyle.setProperty("--bg", "#041b2d");
                rootStyle.setProperty("--text", "#e0f7fa");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--border", "#00e5ff33");
                break;
            case "sunset":
                rootStyle.setProperty("--bg", "#2b1104");
                rootStyle.setProperty("--text", "#ffe0b2");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--border", "#ff572233");
                break;
            case "vaporwave":
                rootStyle.setProperty("--bg", "#2b003a");
                rootStyle.setProperty("--text", "#f8bbd0");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--border", "#ff007f33");
                break;
            case "midnight":
                rootStyle.setProperty("--bg", "#0a1128");
                rootStyle.setProperty("--text", "#fdf0d5");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--border", "#ffb70333");
                break;
            case "hacker":
                rootStyle.setProperty("--bg", "#050505");
                rootStyle.setProperty("--text", "#00ff00");
                rootStyle.setProperty("--glass", "#00ff000A");
                rootStyle.setProperty("--border", "#00ff0033");
                break;
        }

        // Always ensure the accent color remains consistent across preset themes
        rootStyle.setProperty("--accent", savedAccent);
    }

    // --- Open/Close Popup Logic ---
    // 1. Clicking the button toggles the popup
    editThemeBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        themePopup.classList.toggle("show");
        editThemeBtn.classList.toggle("active");
    });

    // 2. Clicking anywhere INSIDE the dock (popup + button) keeps it open
    document.querySelector(".theme-dock").addEventListener("click", function(event) {
        event.stopPropagation();
    });

    // 3. Clicking ANYWHERE ELSE on the document closes the popup
    document.addEventListener("click", function() {
        themePopup.classList.remove("show");
        editThemeBtn.classList.remove("active");
    });

    // --- Preset Theme Hover/Click Logic ---
    for (let i = 0; i < themeButtons.length; i++) {
        let btn = themeButtons[i];
        
        btn.addEventListener("mouseover", function() {
            applyTheme(btn.getAttribute("data-theme"));
        });

        btn.addEventListener("mouseout", function() {
            applyTheme(savedTheme);
        });

        btn.addEventListener("click", function() {
            savedTheme = btn.getAttribute("data-theme");
            localStorage.setItem("nexusTheme", savedTheme);
            applyTheme(savedTheme);
        });
    }

    // --- Custom Color Pickers Logic ---
    
    // Accent Color Picker
    accentPicker.addEventListener("input", function() {
        rootStyle.setProperty("--accent", accentPicker.value);
    });
    accentPicker.addEventListener("change", function() {
        savedAccent = accentPicker.value;
        localStorage.setItem("nexusAccent", savedAccent);
    });

    // Background Color Picker
    bgPicker.addEventListener("input", function() {
        // Automatically switch to the "Default" theme so custom background works
        savedTheme = "dark";
        localStorage.setItem("nexusTheme", "dark");
        document.body.className = ""; // Remove gradients if they were active
        rootStyle.setProperty("--bg", bgPicker.value);
    });
    bgPicker.addEventListener("change", function() {
        savedBg = bgPicker.value;
        localStorage.setItem("nexusBg", savedBg);
        applyTheme("dark"); // Refresh the default theme with the new background
    });

    // --- Initialize on Page Load ---
    applyTheme(savedTheme);
    accentPicker.value = savedAccent;
    bgPicker.value = savedBg;


// Weather

let WeatherWidget = document.querySelector(".weather-widget");
let tempDisplay = document.querySelector(".weather-temp");
let descDisplay = document.querySelector(".weather-sub");
let iconDisplay = document.querySelector(".weather-icon"); 

let defaultLat = "30.9010"
let defaultLon = "75.8573"
let defaultCity = "Ludhiana"

function fetchWeather(lat, lon, cityName) {
    tempDisplay.innerText = "..."
    descDisplay.innerText = cityName + " · Fetching...";

    let apiUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true";
    
    fetch(apiUrl)
            .then(function(response) {
                return response.json(); 
            })
            .then(function(data) {
                let currentTemp = Math.round(data.current_weather.temperature);
                let weatherCode = data.current_weather.weathercode;

                tempDisplay.innerText = currentTemp + "°C";

                let weatherDesc = "Clear";
                let iconName = "sunny";

                if (weatherCode === 0) {
                    weatherDesc = "Clear Sky";
                    iconName = "sunny";
                } else if (weatherCode >= 1 && weatherCode <= 3) {
                    weatherDesc = "Partly Cloudy";
                    iconName = "partly_cloudy_day";
                } else if (weatherCode === 45 || weatherCode === 48) {
                    weatherDesc = "Foggy";
                    iconName = "foggy";
                } else if (weatherCode >= 51 && weatherCode <= 67) {
                    weatherDesc = "Rain";
                    iconName = "rainy";
                } else if (weatherCode >= 71 && weatherCode <= 77) {
                    weatherDesc = "Snow";
                    iconName = "weather_snowy";
                } else if (weatherCode >= 95) {
                    weatherDesc = "Thunderstorm";
                    iconName = "thunderstorm";
                }

                descDisplay.innerText = cityName + " · " + weatherDesc;
                iconDisplay.innerText = iconName;
            })
            .catch(function(error) {
                descDisplay.innerText = cityName + " · Offline";
                tempDisplay.innerText = "--°C";
                console.log("Weather API Error: " + error);
            });
    }
function getUserLocation() {
    if (navigator.geolocation) {
        tempDisplay.innerText = "...";
        descDisplay.innerText = "Locating..."; 

        navigator.geolocation.getCurrentPosition(
            // Scenario A: User clicked "Allow"
            function(position) {
                let userLat = position.coords.latitude; 
                let userLon = position.coords.longitude;

                // NEW: Use a Reverse Geocoding API to get the city name
                let geoApiUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + userLat + "&longitude=" + userLon + "&localityLanguage=en";

                fetch(geoApiUrl)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        // Extract the city name. If 'city' is empty, try 'locality'. 
                        // If both fail, fall back to "Local".
                        let actualCityName = data.city || data.locality || "Local";
                        
                        // Now that we have the real name, fetch the weather!
                        fetchWeather(userLat, userLon, actualCityName);
                    })
                    .catch(function(error) {
                        // If the name lookup fails for some reason, just use "Local" so the app doesn't crash
                        console.log("City lookup failed: " + error);
                        fetchWeather(userLat, userLon, "Local");
                    });
            },
            // Scenario B: User clicked "Block"
            function(error) {
                console.log("Location access Denied or failed! Using Default Location");
                fetchWeather(defaultLat, defaultLon, defaultCity);
            }
        );
    } else {
        // Scenario C: Browser doesn't support geolocation
        fetchWeather(defaultLat, defaultLon, defaultCity);
    }
}

getUserLocation();

WeatherWidget.addEventListener("click", function() {
    getUserLocation(); 
});