// ==========================
// STORAGE KEYS
// ==========================

const PROJECTS_KEY = "taskflow_projects";
const TASKS_KEY = "taskflow_tasks";
const MEMBERS_KEY = "taskflow_members";
const LOGS_KEY = "taskflow_logs";

// ==========================
// DATA
// ==========================

let projects =
    JSON.parse(
        localStorage.getItem(PROJECTS_KEY)
    ) || [];

let tasks =
    JSON.parse(
        localStorage.getItem(TASKS_KEY)
    ) || [];

let members =
    JSON.parse(
        localStorage.getItem(MEMBERS_KEY)
    ) || [];

let logs =
    JSON.parse(
        localStorage.getItem(LOGS_KEY)
    ) || [];

// ==========================
// DOM
// ==========================

const projectModal =
    document.getElementById("projectModal");

const taskModal =
    document.getElementById("taskModal");

const memberModal =
    document.getElementById("memberModal");

// buttons

const addProjectBtn =
    document.getElementById("addProjectBtn");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const addMemberBtn =
    document.getElementById("addMemberBtn");

const saveProjectBtn =
    document.getElementById("saveProject");

const saveTaskBtn =
    document.getElementById("saveTask");

const saveMemberBtn =
    document.getElementById("saveMember");

// ==========================
// MODAL OPEN
// ==========================

addProjectBtn.onclick = () =>
    projectModal.style.display = "flex";

addTaskBtn.onclick = () =>
    taskModal.style.display = "flex";

addMemberBtn.onclick = () =>
    memberModal.style.display = "flex";

// ==========================
// CLOSE MODAL
// ==========================

window.onclick = function(e){

    if(e.target === projectModal)
        projectModal.style.display = "none";

    if(e.target === taskModal)
        taskModal.style.display = "none";

    if(e.target === memberModal)
        memberModal.style.display = "none";
}

// ==========================
// PROJECT CREATE
// ==========================

saveProjectBtn.addEventListener(
    "click",
    createProject
);

function createProject(){

    const name =
        document.getElementById(
            "projectName"
        ).value;

    const description =
        document.getElementById(
            "projectDescription"
        ).value;

    const deadline =
        document.getElementById(
            "projectDeadline"
        ).value;

    const priority =
        document.getElementById(
            "projectPriority"
        ).value;

    if(!name) return;

    const project = {

        id: Date.now(),

        name,

        description,

        deadline,

        priority
    };

    projects.push(project);

    localStorage.setItem(
        PROJECTS_KEY,
        JSON.stringify(projects)
    );

    addLog(
        `Project Created: ${name}`
    );

    updateDashboard();

    showToast(
        "Project Created"
    );

    projectModal.style.display =
        "none";
}

// ==========================
// TASK CREATE
// ==========================

saveTaskBtn.addEventListener(
    "click",
    createTask
);

function createTask(){

    const title =
        document.getElementById(
            "taskTitle"
        ).value;

    const description =
        document.getElementById(
            "taskDescription"
        ).value;

    const dueDate =
        document.getElementById(
            "taskDueDate"
        ).value;

    const priority =
        document.getElementById(
            "taskPriority"
        ).value;

    const tags =
        document.getElementById(
            "taskTags"
        ).value;

    const assignedTo =
    document.getElementById(
        "assignMember"
    ).value || "Unassigned";


    if(!title) return;

    const task = {

        id: Date.now(),

        title,

        description,

        dueDate,

        priority,

        tags,

        assignedTo:"Unassigned",

        status:"todo"
    };

    tasks.push(task);

    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
    );

    renderTasks();

    renderCalendar();

    addLog(
        `Task Created: ${title}`
    );

    updateDashboard();

    showToast(
        "Task Created"
    );

    updateStreak();

    taskModal.style.display =
        "none";
}

// ==========================
// RENDER TASKS
// ==========================

function renderTasks(){

    document.getElementById(
        "todo"
    ).innerHTML = "";

    document.getElementById(
        "progress"
    ).innerHTML = "";

    document.getElementById(
        "review"
    ).innerHTML = "";

    document.getElementById(
        "done"
    ).innerHTML = "";

    tasks.forEach(task => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "task-card";

        card.innerHTML = `

        <h4>${task.title}</h4>

        <p>${task.description}</p>

        <p>
    👤 ${task.assignedTo}
</p>

        <div class="task-meta">

            <span class="priority-${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <span>
                ${task.dueDate}
            </span>

        </div>

        `;

        document
            .getElementById(
                task.status
            )
            .appendChild(card);
    });
}

// ==========================
// TEAM MEMBERS
// ==========================

saveMemberBtn.addEventListener(
    "click",
    createMember
);

function createMember(){

    const name =
        document.getElementById(
            "memberName"
        ).value;

    const email =
        document.getElementById(
            "memberEmail"
        ).value;

    const role =
        document.getElementById(
            "memberRole"
        ).value;

    if(!name) return;

    members.push({

        id:Date.now(),

        name,

        email,

        role,

        tasks:0
    });

    localStorage.setItem(
        MEMBERS_KEY,
        JSON.stringify(members)
    );

    renderMembers();
 
    loadMemberOptions();

    addLog(
        `Member Added: ${name}`
    );

    showToast(
        "Member Added"
    );

    memberModal.style.display =
        "none";
}

// ==========================
// RENDER MEMBERS
// ==========================

function renderMembers(){

    const table =
        document.getElementById(
            "teamTable"
        );

    table.innerHTML = "";

    members.forEach(member => {

        table.innerHTML += `

        <tr>

            <td>${member.name}</td>

            <td>${member.email}</td>

            <td>${member.role}</td>

            <td>${member.tasks}</td>

        </tr>

        `;
    });
}


function loadMemberOptions(){

    const select =
        document.getElementById(
            "assignMember"
        );

    if(!select) return;

    select.innerHTML =
        '<option value="">Assign Member</option>';

    members.forEach(member => {

        select.innerHTML += `

        <option value="${member.name}">
            ${member.name}
        </option>

        `;
    });
}


// ==========================
// ACTIVITY LOGS
// ==========================

function addLog(message){

    logs.unshift({

        time:
            new Date()
            .toLocaleString(),

        message
    });

    localStorage.setItem(
        LOGS_KEY,
        JSON.stringify(logs)
    );

    renderLogs();
}

function renderLogs(){

    const logList =
        document.getElementById(
            "activityLogs"
        );

    logList.innerHTML = "";

    logs.forEach(log => {

        logList.innerHTML += `

        <li>

            ${log.time}
            -
            ${log.message}

        </li>

        `;
    });
}

// ==========================
// DASHBOARD
// ==========================

function updateDashboard(){

    document.getElementById(
        "totalProjects"
    ).textContent =
        projects.length;

    document.getElementById(
        "totalTasks"
    ).textContent =
        tasks.length;

    const completed =
        tasks.filter(
            t => t.status === "done"
        ).length;

    const pending =
        tasks.filter(
            t => t.status !== "done"
        ).length;

    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;

    document.getElementById(
        "pendingTasks"
    ).textContent =
        pending;

    checkOverdueTasks();

loadCharts();
}

// ==========================
// SEARCH
// ==========================

document
.getElementById("searchTask")
.addEventListener(
"input",
function(){

const keyword =
this.value.toLowerCase();

document
.querySelectorAll(".task-card")
.forEach(card=>{

card.style.display =
card.innerText
.toLowerCase()
.includes(keyword)
? "block"
: "none";

});
});

// ==========================
// PRIORITY FILTER
// ==========================

document
.getElementById(
"priorityFilter"
)
.addEventListener(
"change",
function(){

const priority =
this.value;

renderTasks();

if(!priority)
return;

document
.querySelectorAll(".task-card")
.forEach(card=>{

if(
!card.innerHTML
.includes(priority)
){

card.style.display =
"none";
}

});
});

// ==========================
// DARK MODE
// ==========================

const themeBtn =
document.getElementById(
"themeToggle"
);

if(
localStorage.getItem(
"theme"
) === "dark"
){

document.body.classList
.add("dark");
}

themeBtn.onclick = () => {

document.body.classList
.toggle("dark");

localStorage.setItem(

"theme",

document.body.classList
.contains("dark")
? "dark"
: "light"

);
};

// ==========================
// TOAST
// ==========================

function showToast(msg){

const toast =
document.getElementById(
"toast"
);

toast.innerText = msg;

toast.style.display =
"block";

setTimeout(()=>{

toast.style.display =
"none";

},2500);
}

// ==========================
// INITIAL LOAD
// ==========================

renderTasks();

renderMembers();

renderLogs();

updateDashboard();




// =================================
// DRAG & DROP KANBAN
// =================================

function renderTasks() {

    document.getElementById("todo").innerHTML = "";
    document.getElementById("progress").innerHTML = "";
    document.getElementById("review").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach(task => {

        const card =
            document.createElement("div");

        card.className = "task-card";

        card.draggable = true;

        card.dataset.id = task.id;

        card.innerHTML = `

        <h4>${task.title}</h4>

        <p>${task.description}</p>

        <div class="task-meta">

            <span class="priority-${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <span>${task.dueDate}</span>

        </div>

        <div style="margin-top:10px">

            <button onclick="toggleFavorite(${task.id})">
                ${task.favorite ? "⭐" : "☆"}
            </button>

            <button onclick="editTask(${task.id})">
                ✏
            </button>

            <button onclick="deleteTask(${task.id})">
                🗑
            </button>

        </div>

        `;

        card.addEventListener(
            "dragstart",
            dragStart
        );

        document
            .getElementById(task.status)
            .appendChild(card);
    });

    saveTasks();
}

// =================================
// DRAG START
// =================================

let draggedTaskId = null;

function dragStart(e) {

    draggedTaskId =
        e.target.dataset.id;
}

// =================================
// DROP ZONES
// =================================

const columns =
    document.querySelectorAll(
        ".task-container"
    );

columns.forEach(column => {

    column.addEventListener(
        "dragover",
        e => {

            e.preventDefault();
        }
    );

    column.addEventListener(
        "drop",
        e => {

            e.preventDefault();

            const status =
                column.id;

            moveTask(
                draggedTaskId,
                status
            );
        }
    );
});

// =================================
// MOVE TASK
// =================================

function moveTask(id, status) {

    const task =
        tasks.find(
            task =>
                task.id ==
                id
        );

    if (!task) return;

    task.status =
        status;

    saveTasks();

    renderTasks();

    updateDashboard();

    addLog(
        `${task.title} moved to ${status}`
    );

    showToast(
        "Task Status Updated"
    );
}

// =================================
// DELETE TASK
// =================================

function deleteTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );

    if (!task) return;

    if (
        confirm(
            "Delete this task?"
        )
    ) {

        tasks =
            tasks.filter(
                task =>
                    task.id !== id
            );

        saveTasks();

        renderTasks();

        updateDashboard();

        addLog(
            `Task Deleted: ${task.title}`
        );

        showToast(
            "Task Deleted"
        );
    }
}

// =================================
// EDIT TASK
// =================================

function editTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );

    if (!task) return;

    const newTitle =
        prompt(
            "Edit Title",
            task.title
        );

    if (!newTitle)
        return;

    task.title =
        newTitle;

    saveTasks();

    renderTasks();

    addLog(
        `Task Updated: ${task.title}`
    );

    showToast(
        "Task Updated"
    );
}

// =================================
// FAVORITES
// =================================

function toggleFavorite(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );

    if (!task) return;

    task.favorite =
        !task.favorite;

    saveTasks();

    renderTasks();

    showToast(
        "Favorite Updated"
    );
}

// =================================
// SAVE TASKS
// =================================

function saveTasks() {

    localStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
    );
}


// =================================
// CHARTS
// =================================

let taskChart;
let priorityChart;

function loadCharts() {

    const todo =
        tasks.filter(
            task =>
                task.status === "todo"
        ).length;

    const progress =
        tasks.filter(
            task =>
                task.status === "progress"
        ).length;

    const review =
        tasks.filter(
            task =>
                task.status === "review"
        ).length;

    const done =
        tasks.filter(
            task =>
                task.status === "done"
        ).length;

    const taskCtx =
        document.getElementById(
            "taskChart"
        );

    if (taskChart)
        taskChart.destroy();

    taskChart =
        new Chart(
            taskCtx,
            {
                type: "doughnut",

                data: {

                    labels: [
                        "Todo",
                        "Progress",
                        "Review",
                        "Done"
                    ],

                    datasets: [
                        {
                            data: [
                                todo,
                                progress,
                                review,
                                done
                            ]
                        }
                    ]
                }
            }
        );

    // =========================
    // PRIORITY CHART
    // =========================

    const low =
        tasks.filter(
            task =>
                task.priority ===
                "Low"
        ).length;

    const medium =
        tasks.filter(
            task =>
                task.priority ===
                "Medium"
        ).length;

    const high =
        tasks.filter(
            task =>
                task.priority ===
                "High"
        ).length;

    const critical =
        tasks.filter(
            task =>
                task.priority ===
                "Critical"
        ).length;

    const priorityCtx =
        document.getElementById(
            "priorityChart"
        );

    if (priorityChart)
        priorityChart.destroy();

    priorityChart =
        new Chart(
            priorityCtx,
            {
                type: "bar",

                data: {

                    labels: [
                        "Low",
                        "Medium",
                        "High",
                        "Critical"
                    ],

                    datasets: [
                        {
                            label:
                                "Tasks",

                            data: [
                                low,
                                medium,
                                high,
                                critical
                            ]
                        }
                    ]
                }
            }
        );
}



// =================================
// STREAK SYSTEM
// =================================

const STREAK_KEY =
    "taskflow_streak";

function updateStreak() {

    let streak =
        parseInt(
            localStorage.getItem(
                STREAK_KEY
            )
        ) || 0;

    streak++;

    localStorage.setItem(
        STREAK_KEY,
        streak
    );

    document.getElementById(
        "streak"
    ).textContent =
        streak + " 🔥";
}

function loadStreak() {

    let streak =
        parseInt(
            localStorage.getItem(
                STREAK_KEY
            )
        ) || 0;

    document.getElementById(
        "streak"
    ).textContent =
        streak + " 🔥";
}



// =================================
// OVERDUE TASKS
// =================================

function checkOverdueTasks() {

    const today =
        new Date();

    let overdue = 0;

    tasks.forEach(task => {

        if (
            task.status !==
                "done" &&
            task.dueDate
        ) {

            const due =
                new Date(
                    task.dueDate
                );

            if (
                due < today
            ) {

                overdue++;
            }
        }
    });

    document.getElementById(
        "overdueTasks"
    ).textContent =
        overdue;
}


// =================================
// DEADLINE ALERTS
// =================================

function checkDeadlines() {

    const today =
        new Date();

    tasks.forEach(task => {

        if (
            !task.dueDate
        )
            return;

        const due =
            new Date(
                task.dueDate
            );

        const diff =
            Math.ceil(
                (
                    due -
                    today
                ) /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
            );

        if (
            diff === 1
        ) {

            showToast(
                `⚠ Task Due Tomorrow: ${task.title}`
            );
        }
    });
}



// =================================
// COMPLETION RATE
// =================================

function getCompletionRate() {

    if (
        tasks.length === 0
    )
        return 0;

    const done =
        tasks.filter(
            task =>
                task.status ===
                "done"
        ).length;

    return Math.round(
        (
            done /
            tasks.length
        ) * 100
    );
}



loadCharts();

loadStreak();

checkOverdueTasks();

checkDeadlines();





// =================================
// PDF EXPORT
// =================================

document
.getElementById("exportPdf")
.addEventListener(
"click",
exportPDF
);

function exportPDF(){

const { jsPDF } =
window.jspdf;

const doc =
new jsPDF();

const totalTasks =
tasks.length;

const completed =
tasks.filter(
t=>t.status==="done"
).length;

const pending =
tasks.filter(
t=>t.status!=="done"
).length;

const completion =
getCompletionRate();

doc.setFontSize(22);

doc.text(
"TaskFlow Pro Report",
20,
20
);

doc.setFontSize(12);

doc.text(
`Generated: ${
new Date()
.toLocaleString()
}`,
20,
35
);

doc.line(
20,
40,
190,
40
);

doc.text(
`Projects: ${projects.length}`,
20,
55
);

doc.text(
`Total Tasks: ${totalTasks}`,
20,
65
);

doc.text(
`Completed: ${completed}`,
20,
75
);

doc.text(
`Pending: ${pending}`,
20,
85
);

doc.text(
`Completion Rate: ${completion}%`,
20,
95
);

doc.line(
20,
105,
190,
105
);

doc.text(
"Recent Activity Logs",
20,
120
);

let y = 135;

logs
.slice(0,10)
.forEach(log=>{

doc.text(
`${log.message}`,
20,
y
);

y += 10;

});

doc.save(
"TaskFlowPro_Report.pdf"
);

showToast(
"PDF Downloaded"
);

}



// =================================
// CSV EXPORT
// =================================

document
.getElementById("exportCsv")
.addEventListener(
"click",
exportCSV
);

function exportCSV(){

let csv =

"Title,Priority,Status,DueDate\n";

tasks.forEach(task=>{

csv +=

`${task.title},
${task.priority},
${task.status},
${task.dueDate}\n`;

});

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const url =
URL.createObjectURL(
blob
);

const a =
document.createElement("a");

a.href = url;

a.download =
"tasks.csv";

a.click();

showToast(
"CSV Downloaded"
);

}

// =================================
// LEADERBOARD
// =================================

function generateLeaderboard(){

let leaderboard = {};

tasks.forEach(task=>{

if(
task.status === "done"
){

if(
!leaderboard[
task.assignedTo
]
){

leaderboard[
task.assignedTo
] = 0;

}

leaderboard[
task.assignedTo
]++;

}
});

console.log(
leaderboard
);

}


// =================================
// UPCOMING TASKS
// =================================

function getUpcomingTasks(){

const today =
new Date();

return tasks.filter(task=>{

if(!task.dueDate)
return false;

const due =
new Date(
task.dueDate
);

const diff =

Math.ceil(

(
due - today
)

/

(
1000*60*60*24
)

);

return diff <= 7;

});

}


// =================================
// DAILY GOAL
// =================================

function dailyGoal(){

const completed =

tasks.filter(
task =>
task.status ===
"done"
).length;

if(
completed >= 3
){

showToast(
"🎯 Daily Goal Achieved"
);

}
}


loadMemberOptions();

generateLeaderboard();

dailyGoal();



// renderTasks();

// renderMembers();

// loadMemberOptions();

// renderLogs();

// updateDashboard();


function scrollToSection(id){

    document
    .getElementById(id)
    ?.scrollIntoView({
        behavior:"smooth"
    });
}

document
.getElementById("projectMenu")
?.addEventListener(
    "click",
    () => {

        scrollToSection(
            "kanbanSection"
        );

    }
);

document
.getElementById("analyticsMenu")
?.addEventListener(
    "click",
    () => {

        scrollToSection(
            "analyticsSection"
        );

    }
);

document
.getElementById("teamMenu")
?.addEventListener(
    "click",
    () => {

        scrollToSection(
            "teamSection"
        );

    }
);

document
.getElementById("dashboardMenu")
?.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }
);


document
.getElementById("calendarMenu")
?.addEventListener(
    "click",
    () => {

        scrollToSection(
            "calendarSection"
        );

    }
);


function renderCalendar(){

    const container =
        document.getElementById(
            "calendarTasks"
        );

    if(!container) return;

    container.innerHTML = "";

    const upcoming =
        getUpcomingTasks();

    if(upcoming.length === 0){

        container.innerHTML =
            "<p>No upcoming deadlines</p>";

        return;
    }

    upcoming.forEach(task => {

        container.innerHTML += `

        <div class="calendar-item">

            <h4>
                ${task.title}
            </h4>

            <p>
                Due Date:
                ${task.dueDate}
            </p>

            <p>
                Priority:
                ${task.priority}
            </p>

        </div>

        `;
    });
}


document
.getElementById("settingsMenu")
?.addEventListener(
    "click",
    () => {

        scrollToSection(
            "settingsSection"
        );

    }
);


document
.getElementById("clearAllData")
?.addEventListener(
    "click",
    () => {

        const confirmDelete =
            confirm(
                "Are you sure? All data will be deleted."
            );

        if(!confirmDelete)
            return;

        localStorage.removeItem(
            PROJECTS_KEY
        );

        localStorage.removeItem(
            TASKS_KEY
        );

        localStorage.removeItem(
            MEMBERS_KEY
        );

        localStorage.removeItem(
            LOGS_KEY
        );

        location.reload();
    }
);



document
.getElementById("backupData")
?.addEventListener(
"click",
backupData
);

function backupData(){

    const backup = {

        projects,
        tasks,
        members,
        logs

    };

    const blob =
        new Blob(

            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],

            {
                type:
                "application/json"
            }

        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        "taskflow-backup.json";

    a.click();

    showToast(
        "Backup Downloaded"
    );
}



document
.getElementById("restoreData")
?.addEventListener(
"click",
()=>{

document
.getElementById(
"restoreFile"
)
.click();

});


document
.getElementById(
"restoreFile"
)
?.addEventListener(
"change",
restoreBackup
);

function restoreBackup(e){

const file =
e.target.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload =
function(event){

try{

const data =
JSON.parse(
event.target.result
);

localStorage.setItem(

PROJECTS_KEY,

JSON.stringify(
data.projects || []
)

);

localStorage.setItem(

TASKS_KEY,

JSON.stringify(
data.tasks || []
)

);

localStorage.setItem(

MEMBERS_KEY,

JSON.stringify(
data.members || []
)

);

localStorage.setItem(

LOGS_KEY,

JSON.stringify(
data.logs || []
)

);

showToast(
"Backup Restored"
);

setTimeout(()=>{

location.reload();

},1000);

}
catch(error){

alert(
"Invalid Backup File"
);

}

};

reader.readAsText(
file
);

}



renderTasks();

renderMembers();

renderLogs();

updateDashboard();

renderCalendar();