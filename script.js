const addBtn = document.getElementById("addBtn");
const todoInput = document.getElementById("todoInput");
const dueDateInput = document.getElementById("dueDateInput");
const todoList = document.getElementById("todoList");
const pagination = document.getElementById("pagination");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const filterBtn = document.getElementById("filterBtn");

let todos = [];
const itemsPerPage = 3;
let currentPage = 1;
let filterStatus = "all";

addBtn.addEventListener("click", () => {
  const task = todoInput.value.trim();
  const dueDate = dueDateInput.value;

  if (task === "" || dueDate === "") {
    showErrorMessage("Please enter a task and due date.");
    return;
  }

  todos.unshift({
    task,
    dueDate,
    status: "Pending",
  });

  todoInput.value = "";
  dueDateInput.value = "";
  currentPage = 1;
  renderTodos();
  renderPagination();
});

deleteAllBtn.addEventListener("click", () => {
  todos = [];
  currentPage = 1;
  renderTodos();
  renderPagination();
});

filterBtn.addEventListener("click", () => {
  if (filterStatus === "all") {
    filterStatus = "pending";
    filterBtn.textContent = "FILTER: PENDING";
  } else if (filterStatus === "pending") {
    filterStatus = "completed";
    filterBtn.textContent = "FILTER: COMPLETED";
  } else {
    filterStatus = "all";
    filterBtn.textContent = "FILTER: ALL";
  }
  currentPage = 1;
  renderTodos();
  renderPagination();
});

function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;
  if (filterStatus === "pending") {
    filteredTodos = todos.filter((t) => t.status === "Pending");
  } else if (filterStatus === "completed") {
    filteredTodos = todos.filter((t) => t.status === "Completed");
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentTodos = filteredTodos.slice(start, end);

  if (currentTodos.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No task found";
    cell.className = "no-task";
    row.appendChild(cell);
    todoList.appendChild(row);
    return;
  }

  currentTodos.forEach((todo, index) => {
    const row = document.createElement("tr");

    const taskCell = document.createElement("td");
    taskCell.textContent = todo.task;

    const dateCell = document.createElement("td");
    dateCell.textContent = todo.dueDate;

    const statusCell = document.createElement("td");
    statusCell.textContent = todo.status;

    const actionCell = document.createElement("td");
    const actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "COMPLETE";
    completeBtn.className = "complete-btn";
    completeBtn.disabled = todo.status === "Completed";
    completeBtn.addEventListener("click", () => {
      const realIndex = todos.findIndex(
        (t) => t === filteredTodos[start + index]
      );
      todos[realIndex].status = "Completed";
      renderTodos();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "EDIT";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
      const realIndex = todos.findIndex(
        (t) => t === filteredTodos[start + index]
      );
      editTask(realIndex, todo);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "DELETE";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      const realIndex = todos.findIndex(
        (t) => t === filteredTodos[start + index]
      );
      deleteTask(realIndex);
    });

    actionButtons.appendChild(completeBtn);
    actionButtons.appendChild(editBtn);
    actionButtons.appendChild(deleteBtn);
    actionCell.appendChild(actionButtons);

    row.appendChild(taskCell);
    row.appendChild(dateCell);
    row.appendChild(statusCell);
    row.appendChild(actionCell);

    todoList.appendChild(row);
  });
}

function renderPagination() {
  pagination.innerHTML = "";

  let filteredTodos = todos;
  if (filterStatus === "pending") {
    filteredTodos = todos.filter((t) => t.status === "Pending");
  } else if (filterStatus === "completed") {
    filteredTodos = todos.filter((t) => t.status === "Completed");
  }

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "pagination-btn";
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTodos();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

function editTask(index, todo) {
  const newTask = prompt("Edit task:", todo.task);
  if (newTask !== null && newTask.trim() !== "") {
    todos[index].task = newTask.trim();
    renderTodos();
  }
}

function deleteTask(index) {
  todos.splice(index, 1);

  let filteredTodos = todos;
  if (filterStatus === "pending") {
    filteredTodos = todos.filter((t) => t.status === "Pending");
  } else if (filterStatus === "completed") {
    filteredTodos = todos.filter((t) => t.status === "Completed");
  }

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  if (currentPage > totalPages) {
    currentPage = Math.max(totalPages, 1);
  }

  renderTodos();
  renderPagination();
}

function showErrorMessage(message) {
  const errorMessage = document.querySelector(".error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 3000);
}

renderTodos();
renderPagination();
