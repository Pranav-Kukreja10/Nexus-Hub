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

// // Voice Search
// const voiceSearchBtn = document.getElementById("voice-search-btn");
// if (voiceSearchBtn) {
//     voiceSearchBtn.addEventListener("click", () => {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         if (SpeechRecognition) {
//             const recognition = new SpeechRecognition();
//             recognition.onstart = () => {
//                 searchField.placeholder = "Listening...";
//                 voiceSearchBtn.style.color = "var(--red)";
//             };
//             recognition.onresult = (event) => {
//                 const transcript = event.results[0][0].transcript;
//                 searchField.value = transcript;
//                 searchButton.click();
//             };
//             recognition.onend = () => {
//                 searchField.placeholder = "Search the web...";
//                 voiceSearchBtn.style.color = "";
//             };
//             recognition.start();
//         } else {
//             alert("Voice search is not supported in this browser.");
//         }
//     });
// }

// // Image Search
// const imageSearchBtn = document.getElementById("image-search-btn");
// if (imageSearchBtn) {
//     imageSearchBtn.addEventListener("click", () => {
//         const imageUrl = prompt("Enter the URL of the image to search:");
//         if (imageUrl && imageUrl.trim() !== "") {
//             window.location.href = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl.trim())}`;
//         }
//     });
// }

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




// Daily Tasks 

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const tasksContainer = document.getElementById("tasks-container");
const progressText = document.getElementById("task-progress-text");
const progressBar = document.getElementById("task-progress-bar");

function updateProgress(){
    const allTasks = document.querySelectorAll(".task-item");
    const doneTasks = document.querySelectorAll(".task-item.done"); 

    const totalCount = allTasks.length; 
    const doneCount = doneTasks.length; 

    progressText.innerText = `${doneCount} / ${totalCount} done`;

    if (totalCount === 0) {
        progressBar.style.width = "0%";
    }
    else{
        const percentage = (doneCount / totalCount) * 100; 
        progressBar.style.width = percentage + "%"; 
    }
} 

function saveTasks() {
    const tasksToSave = []; 
    const allTasks = document.querySelectorAll(".task-item");

    for (let i = 0; i < allTasks.length; i++) {
        const taskElement = allTasks[i]; 
        const text = taskElement.querySelector(".task-text").innerText;
        const isDone = taskElement.classList.contains("done");
        
        tasksToSave.push({text: text, done: isDone});
    }

    localStorage.setItem("daily_tasks", JSON.stringify(tasksToSave));
    updateProgress();
}

function createTaskElement(taskText, isDone) {
    const taskDiv = document.createElement("div"); 
    taskDiv.className = "task-item";

    if (isDone) {
        taskDiv.classList.add("done"); 
    }

    let icon = isDone ? "check_circle" : "radio_button_unchecked";
    taskDiv.innerHTML = `
    <span class="material-symbols-rounded task-check">${icon}</span>
    <span class="task-text">${taskText}</span>
    <span class="material-symbols-rounded task-del">delete</span>
    `;

    const checkBtn = taskDiv.querySelector(".task-check"); 
    const deleteBtn = taskDiv.querySelector(".task-del"); 

    checkBtn.addEventListener("click", function() {
        taskDiv.classList.toggle("done"); 

        if (taskDiv.classList.contains("done")){
            checkBtn.innerText = "check_circle";
        }
        else{
            checkBtn.innerText = "radio_button_unchecked";
        }

        saveTasks();
    });

    deleteBtn.addEventListener("click", function() {
        taskDiv.remove(); 
        saveTasks();  
    }); 

    tasksContainer.appendChild(taskDiv); 
}

addTaskBtn.addEventListener("click", function() {
    const text = taskInput.value.trim();

    if (text != ""){
        createTaskElement(text, false); 
        taskInput.value = ""; 
        saveTasks();
    }
});

taskInput.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        addTaskBtn.click();
    }
});


function loadTasks(){
    const saveData = localStorage.getItem("daily_tasks"); 

    if (saveData) {
        const parsedTasks = JSON.parse(saveData);

        for (let i = 0; i < parsedTasks.length; i++){
            createTaskElement(parsedTasks[i].text, parsedTasks[i].done); 
        }
    }
    updateProgress(); 
}

loadTasks(); 

 
// Quick Notes

const note = document.getElementById("note-content");


note.textContent = localStorage.getItem("note") || "";


note.addEventListener("input", () => {
    const content = note.textContent.trim();
    
    if (content) {
        localStorage.setItem("note", note.textContent);
    } else {
        localStorage.removeItem("note");
    }
});

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


let savedTheme = localStorage.getItem("nexusTheme");
if (savedTheme === null) {
    savedTheme = "dark"; 
}

let savedAccent = localStorage.getItem("nexusAccent");
if (savedAccent === null) {
    savedAccent = "#7c6eff"; 
}

let savedBg = localStorage.getItem("nexusBg");
if (savedBg === null) {
    savedBg = "#0e1015";
}


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
    
 
    if (themePopup.classList.contains("show")) {
        themePopup.classList.remove("show");
        editThemeBtn.classList.remove("active");
    } else {
        themePopup.classList.add("show");
        editThemeBtn.classList.add("active");
    }
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
        let hoverTheme = btn.getAttribute("data-theme");
        applyTheme(hoverTheme);
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
         
            function(position) {
                let userLat = position.coords.latitude; 
                let userLon = position.coords.longitude;

   
                let geoApiUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + userLat + "&longitude=" + userLon + "&localityLanguage=en";

                fetch(geoApiUrl)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                   
                        let actualCityName = data.city || data.locality || "Local";
                        
                    
                        fetchWeather(userLat, userLon, actualCityName);
                    })
                    .catch(function(error) {          console.log("City lookup failed: " + error);
                        fetchWeather(userLat, userLon, "Local");
                    });
            },
           
            function(error) {
                console.log("Location access Denied or failed! Using Default Location");
                fetchWeather(defaultLat, defaultLon, defaultCity);
            }
        );
    } else {
 
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



//Screen Time


let timeList = document.getElementById("time-list");
let resetTimeBtn = document.getElementById("reset-time");

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

function loadScreenTime() {
    chrome.storage.local.get(["screenTime"], function(result) {
        let allData = result.screenTime || {};
        let today = new Date().toDateString();
        let data = allData[today] || {}; 

        timeList.innerHTML = ""; 

        let domainNames = Object.keys(data);
        if (domainNames.length === 0) {
            timeList.innerHTML = '<div class="theme-hint" style="margin-top: 10px;">Start browsing today to track time!</div>';
            return;
        }

        let sites = [];
        for (let i = 0; i < domainNames.length; i++) {
            let domain = domainNames[i];
    
            if (domain !== "null" && domain !== "undefined" && domain !== "") {
                sites.push({ 
                    domain: domain, 
                    time: data[domain] 
                });
            }
        }
        
        sites.sort(function(a, b) { return b.time - a.time; });

        let maxTime = 0;
        if (sites.length > 0) {
            maxTime = sites[0].time;
        }
        
        let displayCount = 3;
        if (sites.length < 3) {
            displayCount = sites.length;
        }
        
        let sitesShown = 0;

       
        for (let i = 0; i < displayCount; i++) {
            let site = sites[i];
            
            let totalSeconds = Math.floor(site.time / 1000); 
            let totalMinutes = Math.floor(totalSeconds / 60);
            let hours = Math.floor(totalMinutes / 60);
            let remainingMins = totalMinutes % 60;
           
           
            if (totalSeconds > 5) {
                sitesShown++;
                let percentage = (site.time / maxTime) * 100;
                let timeString = "";
                
              
                if (hours > 0) {
                    timeString = hours + "h " + remainingMins + "m";
                } else if (totalMinutes > 0) {
                    timeString = totalMinutes + "m";
                } else {
                    timeString = "< 1m"; 
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