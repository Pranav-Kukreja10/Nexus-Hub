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

// Voice Search
const voiceSearchBtn = document.getElementById("voice-search-btn");
if (voiceSearchBtn) {
    voiceSearchBtn.addEventListener("click", () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.onstart = () => {
                searchField.placeholder = "Listening...";
                voiceSearchBtn.style.color = "var(--red)";
            };
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                searchField.value = transcript;
                searchButton.click();
            };
            recognition.onend = () => {
                searchField.placeholder = "Search the web...";
                voiceSearchBtn.style.color = "";
            };
            recognition.start();
        } else {
            alert("Voice search is not supported in this browser.");
        }
    });
}

// Image Search
const imageSearchBtn = document.getElementById("image-search-btn");
if (imageSearchBtn) {
    imageSearchBtn.addEventListener("click", () => {
        const imageUrl = prompt("Enter the URL of the image to search:");
        if (imageUrl && imageUrl.trim() !== "") {
            window.location.href = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl.trim())}`;
        }
    });
}

// Focus Timer

const display = document.getElementById("timer-time");
const toggleBtn = document.getElementById("timer-toggle");
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

function playBeep() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 800; 
    
    gainNode.gain.setValueAtTime(1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
}

let isRunning = false;

toggleBtn.onclick = () => {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
        toggleBtn.innerText = "Start";
        toggleBtn.classList.remove("btn-ghost");
    } else {
        clearInterval(interval);
        isRunning = true;
        toggleBtn.innerText = "Stop";
        toggleBtn.classList.add("btn-ghost");
        interval = setInterval(() => {
            if (time > 0) {
                time--;
                updateDisplay();
            } else {
                clearInterval(interval);
                isRunning = false;
                toggleBtn.innerText = "Start";
                toggleBtn.classList.remove("btn-ghost");
                playBeep();
                setTimeout(() => {
                    alert("Time's up!");
                }, 50);
            }
        }, 1000);
    }
};

resetBtn.onclick = () => {
    clearInterval(interval);
    isRunning = false;
    toggleBtn.innerText = "Start";
    toggleBtn.classList.remove("btn-ghost");
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
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
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

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
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

    let editThemeBtn = document.querySelector(".edit-btn");
    let themePopup = document.getElementById("theme-popup");
    let themeButtons = document.querySelectorAll(".theme-btn");
    let accentPicker = document.getElementById("custom-accent");
    let bgPicker = document.getElementById("custom-bg");
    let rootStyle = document.documentElement.style;


    let savedTheme = localStorage.getItem("nexusTheme") || "dark";
    let savedAccent = localStorage.getItem("nexusAccent") || "#7c6eff";
    let savedBg = localStorage.getItem("nexusBg") || "#0e1015";

  
    function applyTheme(themeName) {
        document.body.className = ""; 
        
        switch(themeName) {
            case "dark":
                rootStyle.setProperty("--bg", savedBg); 
                rootStyle.setProperty("--text", "#e8eaf2");
                rootStyle.setProperty("--glass", "#FFFFFF0F");
                rootStyle.setProperty("--glass-hover", "#FFFFFF1A");
                rootStyle.setProperty("--border", "#FFFFFF17");
                rootStyle.setProperty("--border-hover", "#FFFFFF2E");
                break;
            case "cosmic":
                rootStyle.setProperty("--bg", "transparent");
                rootStyle.setProperty("--text", "#e8eaf2");
                rootStyle.setProperty("--glass", "#FFFFFF0F"); 
                rootStyle.setProperty("--glass-hover", "#FFFFFF1A");
                rootStyle.setProperty("--border", "#FFFFFF17");
                rootStyle.setProperty("--border-hover", "#FFFFFF2E");
                document.body.classList.add("bg-cosmic");
                break;
            case "gradient":
                rootStyle.setProperty("--bg", "transparent");
                rootStyle.setProperty("--text", "#e8eaf2");
                rootStyle.setProperty("--glass", "#FFFFFF0F");
                rootStyle.setProperty("--glass-hover", "#FFFFFF1A");
                rootStyle.setProperty("--border", "#FFFFFF17");
                rootStyle.setProperty("--border-hover", "#FFFFFF2E");
                document.body.classList.add("bg-gradient");
                break;
            case "hacker":
                rootStyle.setProperty("--bg", "#050505");
                rootStyle.setProperty("--text", "#00ff00");
                rootStyle.setProperty("--glass", "#00ff000A");
                rootStyle.setProperty("--glass-hover", "#00ff001A");
                rootStyle.setProperty("--border", "#00ff0033");
                rootStyle.setProperty("--border-hover", "#00ff004D");
                break;
            case "ocean":
                rootStyle.setProperty("--bg", "#041b2d");
                rootStyle.setProperty("--text", "#e0f7fa");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--glass-hover", "#ffffff1A");
                rootStyle.setProperty("--border", "#00e5ff33");
                rootStyle.setProperty("--border-hover", "#00e5ff4D");
                break;
            case "sunset":
                rootStyle.setProperty("--bg", "#2b1104");
                rootStyle.setProperty("--text", "#ffe0b2");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--glass-hover", "#ffffff1A");
                rootStyle.setProperty("--border", "#ff572233");
                rootStyle.setProperty("--border-hover", "#ff57224D");
                break;
            case "vaporwave":
                rootStyle.setProperty("--bg", "#2b003a");
                rootStyle.setProperty("--text", "#f8bbd0");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--glass-hover", "#ffffff1A");
                rootStyle.setProperty("--border", "#ff007f33");
                rootStyle.setProperty("--border-hover", "#ff007f4D");
                break;
            case "midnight":
                rootStyle.setProperty("--bg", "#0a1128");
                rootStyle.setProperty("--text", "#fdf0d5");
                rootStyle.setProperty("--glass", "#ffffff0A");
                rootStyle.setProperty("--glass-hover", "#ffffff1A");
                rootStyle.setProperty("--border", "#ffb70333");
                rootStyle.setProperty("--border-hover", "#ffb7034D");
                break;
        }


        rootStyle.setProperty("--accent", savedAccent);
    }


    editThemeBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        themePopup.classList.toggle("show");
        editThemeBtn.classList.toggle("active");
    });


    document.querySelector(".theme-dock").addEventListener("click", function(event) {
        event.stopPropagation();
    });


    document.addEventListener("click", function() {
        themePopup.classList.remove("show");
        editThemeBtn.classList.remove("active");
    });

  
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


  
    accentPicker.addEventListener("input", function() {
        rootStyle.setProperty("--accent", accentPicker.value);
    });
    accentPicker.addEventListener("change", function() {
        savedAccent = accentPicker.value;
        localStorage.setItem("nexusAccent", savedAccent);
    });

    bgPicker.addEventListener("input", function() {
        
        savedTheme = "dark";
        localStorage.setItem("nexusTheme", "dark");
        document.body.className = ""; 
        rootStyle.setProperty("--bg", bgPicker.value);
    });
    bgPicker.addEventListener("change", function() {
        savedBg = bgPicker.value;
        localStorage.setItem("nexusBg", savedBg);
        applyTheme("dark"); 
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

// Currency 

let baseInput = document.getElementById("base-input"); 
let targetVal = document.getElementById("target-val"); 
let baseCurr = document.getElementById("base-curr");
let targetCurr = document.getElementById("target-curr"); 
let convFooter = document.getElementById("conv-date"); 

let exchangeRates = {}; 

function fetchRates() {
    let base = baseCurr.value; 
    let apiURL = "https://open.er-api.com/v6/latest/" + base;

    fetch(apiURL)
        .then(function(response) {
            return response.json(); 
        })
        .then(function(data){
            exchangeRates = data.rates; 

            let updateDate = data.time_last_update_utc.slice(0, 16);
            convFooter.innerText = "Rates from: " + updateDate;

            calculateConversion();
        }) 
        .catch(function(error){
            targetVal.innerText = "Err"; 
            convFooter.innerText = " Failed to load rates.";
            console.log("Currrency API Error: " + error);
        })
}

function calculateConversion() {
    let amount = parseFloat(baseInput.value); 
    let target = targetCurr.value; 

    if (isNaN(amount)) {
        targetVal.innerText = "0.00";
        return 
    }

    let rate = exchangeRates[target]; 

    let result = amount * rate; 

    targetVal.innerText = result.toFixed(2);
}

fetchRates(); 

baseInput.addEventListener("input", calculateConversion);

baseCurr.addEventListener("change", fetchRates); 

targetCurr.addEventListener("change", calculateConversion); 



    let timeList = document.getElementById("time-list");
    let resetTimeBtn = document.getElementById("reset-time");

    function loadScreenTime() {
        chrome.storage.local.get(["screenTime"], function(result) {
            let allData = result.screenTime || {};
            let today = new Date().toDateString();
            
            // ONLY look at the data for today
            let data = allData[today] || {}; 

            timeList.innerHTML = ""; 

            // If today's data is empty, show the starting message
            if (Object.keys(data).length === 0) {
                timeList.innerHTML = '<div class="theme-hint" style="margin-top: 10px;">Start browsing today to track time!</div>';
                return;
            }

            let sites = [];
            for (let domain in data) {
                // DATA SANITATION: Ignore glitches like "null", "undefined", or blank names
                if (domain !== "null" && domain !== "undefined" && domain !== "") {
                    sites.push({ domain: domain, time: data[domain] });
                }
            }
            
            // Sort highest to lowest
            sites.sort(function(a, b) { return b.time - a.time; });

            let maxTime = sites.length > 0 ? sites[0].time : 0;
            let displayCount = Math.min(sites.length, 3);
            let sitesShown = 0;

            for (let i = 0; i < sites.length; i++) {
                if (sitesShown >= displayCount) break;

                let site = sites[i];
                let totalSeconds = Math.floor(site.time / 1000); 
                let totalMinutes = Math.floor(site.time / 60000);
                
                // Show site if you've been on it for more than 5 seconds
                if (totalSeconds > 5) {
                    sitesShown++;
                    let percentage = (site.time / maxTime) * 100;
                    
                    let timeString = "";
                    if (totalMinutes >= 60) {
                        let hours = Math.floor(totalMinutes / 60);
                        let mins = totalMinutes % 60;
                        timeString = hours + "h " + mins + "m";
                    } else if (totalMinutes > 0) {
                        timeString = totalMinutes + "m";
                    } else {
                        timeString = "< 1m"; // Shows this if under a minute
                    }

                    let siteItem = document.createElement("div");
                    siteItem.className = "site-item";
                    siteItem.innerHTML = `
                        <div class="site-info">
                            <span class="site-name">${site.domain}</span>
                            <span class="site-time">${timeString}</span>
                        </div>
                        <div class="site-bar-track">
                            <div class="site-bar-fill" style="width: ${percentage}%"></div>
                        </div>
                    `;
                    timeList.appendChild(siteItem);
                }
            }
            
            if (sitesShown === 0) {
                 timeList.innerHTML = '<div class="theme-hint" style="margin-top: 10px;">Browsing under 5 seconds...</div>';
            }
        });
    }

    
    loadScreenTime();


    if (resetTimeBtn) {
        resetTimeBtn.addEventListener("click", function() {
            let today = new Date().toDateString();
            
            chrome.storage.local.get(["screenTime"], function(result) {
                let allData = result.screenTime || {};
                allData[today] = {}; 
                
                chrome.storage.local.set({ screenTime: allData }, function() {
                    loadScreenTime(); 
                });
            });
        });
    }

// ======================
// SIMPLE MUSIC PLAYER
// ======================
const tracks = [
    { name: "Song 1", artist: "Artist A" },
    { name: "Song 2", artist: "Artist B" },
    { name: "Song 3", artist: "Artist C" }
];

let currentTrack = 0;
let isPlaying = false;

const trackName = document.querySelector(".track-name");
const trackArtist = document.querySelector(".track-artist");
const playBtn = document.querySelector(".play-btn");
const nextBtn = document.querySelectorAll(".media-btn")[2];
const prevBtn = document.querySelectorAll(".media-btn")[0];

function loadTrack(index) {
    trackName.innerText = tracks[index].name;
    trackArtist.innerText = tracks[index].artist;
}

playBtn.addEventListener("click", function () {
    isPlaying = !isPlaying;
    playBtn.innerText = isPlaying ? "pause_circle" : "play_circle";
});

nextBtn.addEventListener("click", function () {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
});

prevBtn.addEventListener("click", function () {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
});

// Load first track
loadTrack(currentTrack);


// ======================
// QUICK LINKS WORKING
// ======================
const links = document.querySelectorAll(".link-item");

links[0].href = "https://github.com";
links[1].href = "https://youtube.com";
links[2].href = "https://meet.google.com";
links[3].href = "https://reddit.com";


// ======================
// AUTO CHANGING QUOTES
// ======================
const quotes = [
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" }
];

const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");

function changeQuote() {
    let random = Math.floor(Math.random() * quotes.length);
    quoteText.innerText = `"${quotes[random].text}"`;
    quoteAuthor.innerText = "— " + quotes[random].author;
}

// Change every 5 sec
setInterval(changeQuote, 5000);


// ======================
// VOICE SEARCH (BASIC)
// ======================
const micBtn = document.querySelector('[title="Voice Search"]');

micBtn.addEventListener("click", function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.onresult = function (event) {
        document.getElementById("search-input").value =
            event.results[0][0].transcript;
    };

    recognition.start();
});
