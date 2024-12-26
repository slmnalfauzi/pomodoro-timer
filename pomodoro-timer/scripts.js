// Pomodoro Timer Code
let allTypes = document.querySelectorAll(".container .time-options button");
let timer = document.querySelector(".container .progress-bar h3");
let startBtn = document.querySelector(".container .control-buttons .start-btn");
let stoptBtn = document.querySelector(".container .control-buttons .stop-btn");
let resetBtn = document.querySelector(".container .control-buttons .reset-btn");
let circularProgressBar = document.querySelector(".container .progress-bar");

// Notifikasi audio
let notificationSound = new Audio("alarm-clock.mp3");

let getType = (elem, type) => {
    for (let x of allTypes) {
        x.classList.remove("active");
    }
    elem.classList.add("active");
    pomodoroType = type;
    resetTimer();
};

const timer_type_pomodoro = "Pomodoro";
const timer_type_shortbreak = "Shortbreak";
const timer_type_longbreak = "Longbreak";
let pomodoroType = timer_type_pomodoro;

// Default time in seconds
let pomodoroTimeInSec = 1500;
let shortBreakTimeInSec = 300;
let longBreakTimeInSec = 900;

let timerValue = pomodoroTimeInSec;
let multipleFactor = 360 / timerValue;
let progressInterval;
let isTimerRunning = false; // Flag to track if the timer is running

let resetTimer = () => {
    clearInterval(progressInterval);
    startBtn.style.display = "block";
    stoptBtn.style.display = "none";
    if (pomodoroType === timer_type_pomodoro) {
        timerValue = pomodoroTimeInSec;
    } else if (pomodoroType === timer_type_shortbreak) {
        timerValue = shortBreakTimeInSec;
    } else if (pomodoroType === timer_type_longbreak) {
        timerValue = longBreakTimeInSec;
    }
    multipleFactor = 360 / timerValue;
    timerProgress();
    isTimerRunning = false; // Reset the timer running state
};

let FormatedNumberInMinutes = (number) => {
    let minutes = Math.trunc(number / 60).toString().padStart(2, "0");
    let seconds = Math.trunc(number % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
};

let timerProgress = () => {
    if (timerValue == 0) {
        stopTimer();
        notificationSound.play(); // Mainkan suara notifikasi
        alert("Timer selesai! Waktu untuk beristirahat atau mulai sesi baru!"); // Tampilkan pop-up
        return;
    }
    timer.innerHTML = `${FormatedNumberInMinutes(timerValue)}`;
    circularProgressBar.style.background = `conic-gradient(#664efe ${timerValue * multipleFactor}deg, #422f66 0deg)`;
};

let startTimer = () => {
    if (isTimerRunning) return; // Prevent starting a new interval if already running

    progressInterval = setInterval(() => {
        timerValue--;
        timerProgress();
    }, 1000);

    startBtn.style.display = "none";
    stoptBtn.style.display = "block";
    isTimerRunning = true; // Set timer running state to true
};

let stopTimer = () => {
    clearInterval(progressInterval);
    startBtn.style.display = "block";
    stoptBtn.style.display = "none";
    isTimerRunning = false; // Set timer running state to false
};

// Event listeners for buttons
resetBtn.addEventListener("click", resetTimer);
stoptBtn.addEventListener("click", stopTimer);
startBtn.addEventListener("click", startTimer);

const openSettings = () => {
    document.getElementById("settingsModal").style.display = "flex";
};

const closeSettings = () => {
    document.getElementById("settingsModal").style.display = "none";
};

const saveSettings = () => {
    const pomodoroTime = document.getElementById("pomodoro-time").value;
    const shortBreakTime = document.getElementById("short-break-time").value;
    const longBreakTime = document.getElementById("long-break-time").value;

    // Validate inputs
    if (pomodoroTime > 0 && shortBreakTime > 0 && longBreakTime > 0) {
        pomodoroTimeInSec = pomodoroTime * 60; // Convert to seconds
        shortBreakTimeInSec = shortBreakTime * 60; // Convert to seconds
        longBreakTimeInSec = longBreakTime * 60; // Convert to seconds

        alert("Settings saved!");
        resetTimer();
        closeSettings();
    } else {
        alert("Please enter valid time values!");
    }
};

// To-Do List Code
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");

// Load saved tasks
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToList(task));
};

// Add task to UI and save
const addTaskToList = (task) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${task}</span>
        <div class="todo-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    todoList.appendChild(li);

    // Edit functionality
    li.querySelector(".edit-btn").addEventListener("click", () => editTask(li));

    // Delete functionality
    li.querySelector(".delete-btn").addEventListener("click", () => {
        todoList.removeChild(li);
        saveTasks();
    });
};

// Save tasks to localStorage
const saveTasks = () => {
    const tasks = [];
    document.querySelectorAll("#todo-list .task-text").forEach(taskText => {
        tasks.push(taskText.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Edit task
const editTask = (li) => {
    const taskText = li.querySelector(".task-text");
    const currentText = taskText.textContent;

    // Replace task text with input for editing
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.classList.add("edit-input");
    taskText.replaceWith(input);

    // Change edit button to save button
    const editBtn = li.querySelector(".edit-btn");
    editBtn.textContent = "Save";
    editBtn.classList.add("save-btn");
    editBtn.classList.remove("edit-btn");

    // Save edited task
    editBtn.addEventListener("click", () => {
        if (input.value.trim() === "") return; // Prevent empty tasks
        const newTaskText = document.createElement("span");
        newTaskText.classList.add("task-text");
        newTaskText.textContent = input.value.trim();
        input.replaceWith(newTaskText);

        // Restore edit button functionality
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.classList.remove("save-btn");
        editBtn.removeEventListener("click", arguments.callee);

        saveTasks();
    });
};

// Add task event
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (todoInput.value.trim() === "") return; // Prevent empty tasks
    addTaskToList(todoInput.value.trim());
    saveTasks();
    todoInput.value = "";
});

// Load tasks on page load
loadTasks();
