let user = localStorage.getItem('username');
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const quotes = [
    {
        text:"Push yourself, because no one else is going to do it for you.",
        image: "https://images.unsplash.com/photo-1551892589-865f69869476?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        text:"Success doesn't come from what you do occasionally.It comes from what you do consistently.",
        image: "https://images.unsplash.com/photo-1517976547714-720226b864c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        text: "Don't limit your challenges. Challenge your limits.",
        image: "https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

window.onload = function() {
    getUsername();
    renderTasks();
    showMotivationalQuote();
};

function getUsername(){
    if(!user){
        document.getElementById("name-modal").classList.remove("hidden");
        setTimeout(() => document.getElementById("name-input").focus(),100);
    } else {
        renderGreeting();
    }
}

function changeName(){
    localStorage.removeItem('username');
    document.getElementById("name-input").value = "";
    user = null;
    getUsername();
}

function submitName(){
    const input = document.getElementById("name-input");
    const name = input.value.trim();
    if(name){
        user = name;
        localStorage.setItem('username',user);
        document.getElementById("name-modal").classList.add("hidden");
        renderGreeting();
    }
}

function renderGreeting(){
    document.getElementById('greeting').textContent = `Hi ${user}, let's crush your tasks!`;
}

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function addTask(text) {
    if(text.trim() === "")return;
    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    document.getElementById("task-input").value = "";
}

function toggleTaskComplete(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (taskElement) {
        taskElement.offsetWidth;
        taskElement.classList.add("fade-out");
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
        }, 550);
    }
}

function deleteTask(id){
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function editTask(id){
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if(taskElement){
        openEditModal(taskElement);
    }
}

function renderTasks(){
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    if(tasks.length === 0){
        list.innerHTML = `<p class = "text-gray-500 text-center mt-4">No tasks yet. Add one!</p>`;
        return;
    }

    tasks.forEach(task => {
        const item = document.createElement("div");
        item.className = "flex items-center justify-between bg-white p-3 rounded-lg shadow mb-2 transition-all";
        item.setAttribute("data-id",task.id);
        item.innerHTML = `
            <div class = "flex items-center">
              <label class = "flex items-center cursor-pointer space-x-2">
              <input type = "checkbox" class = "peer hidden" onchange = "toggleTaskComplete(${task.id})" ${task.completed ? "checked" : ""} />
              <div class = "w-5 h-5 rounded-full border-2 border-purple-500 peer-checked:bg-purple-500 transition-all"></div>
              <span class = " ${task.completed ? " line-through  text-gray-500" : ""}">${task.text}</span>
              </label>
              </div>
              <div class = "space-x-2">
                <button onclick = "editTask(${task.id})" class = " text-blue-500 hover:underline">Edit</button>
                </div>
                `;
                list.appendChild(item);
    });
}

let taskBeingEdited = null;

function openEditModal(taskElement){
    document.getElementById("edit-input").value = "";
    document.getElementById("edit-modal").classList.remove("hidden");
    taskBeingEdited = taskElement;
    setTimeout(() => document.getElementById("edit-input").focus(), 100);
}

function submitEdit(){
    const newText = document.getElementById("edit-input").value.trim();
    if(newText && taskBeingEdited){
        const id = parseInt(taskBeingEdited.getAttribute("data-id"));
        const task = tasks.find(t => t.id === id);
        if(task){
            task.text = newText;
            saveTasks();
        }
        taskBeingEdited.querySelector("span").innerText = newText;
        taskBeingEdited = null;
        document.getElementById("edit-modal").classList.add("hidden");
    }
}

function showMotivationalQuote(){
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("quote").textContent = `"${random.text}"`;
    document.getElementById("quote-img").src = random.image;
}

//event listeners go here

document.getElementById("task-input").addEventListener("keydown",function(event) {
    if (event.key == "Enter"){
        addTask(this.value);
    }
});

document.addEventListener("DOMContentLoaded",() => {
    const nameInput = document.getElementById("name-input");
    const editInput = document.getElementById("edit-input");

    nameInput.addEventListener("keydown",function(event){
        if(event.key === "Enter"){
            submitName();
        }
    });

    editInput.addEventListener("keydown",function(event){
        if(event.key === "Enter"){
            submitEdit();
        }
    });

    const storedName = localStorage.getItem("username");
    if(storedName){
        document.getElementById("greeting").textContent = `Hello, ${storedName}`;
    }else {
        document.getElementById("name-modal").classList.remove("hidden");
    }
});