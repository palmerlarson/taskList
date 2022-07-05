const init = () => {
	document.querySelector("#newTask").addEventListener("click", addNewTask);
	document.querySelector("#task").addEventListener("keyup", function() {
		if (event.keyCode === 13) {
			addNewTask();
		}
	});
	getAllTasks();
};

window.onload = init;

//gets the json data
const getAllTasks = () => {
	let xhr = new XMLHttpRequest();
	let url = "http://127.0.0.1:3000/api/tasks";
	let newElement = document.createElement("div");
	let p = document.querySelector(".loaderContainer");

	xhr.open("get", url);
	newElement.setAttribute('class', "loader");
	newElement.innerHTML = "";
	p.appendChild(newElement);
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			let data = JSON.parse(xhr.responseText);
			displayAllTasks(data);
			p.removeChild(newElement);
		}
	}
	xhr.send(null);
};

//displays all tasks when page loads
const displayAllTasks = jsonData => {
	let displayDiv = document.querySelector(".lister");
	for (let i = 0; i < jsonData.length; i++) {
		let id = jsonData[i].id;
		let name = jsonData[i].name;
		displayDiv.innerHTML += `<li id='${id} liItem'><button id="btnStatus" class="btn" onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i></button><span id='${id + "span"}' class="editHover" ondblclick="editTask(${id})">${name}</span></li>`;
	}

}

//adds user entered tasks
const addNewTask = () => {
	let displayDiv = document.querySelector(".lister");
	let xhr = new XMLHttpRequest();
	let url = "http://127.0.0.1:3000/api/tasks/";
	let p = document.querySelector(".loaderContainer");
	let taskDescription = document.querySelector("#task").value;
	let newElement = document.createElement("div");
	let params = {
		name: taskDescription
	};

	if (taskDescription == "") {
		alert("You can't enter an empty task");
	} else {
		xhr.open("post", url);
		xhr.setRequestHeader("Content-Type", "application/json");
		newElement.setAttribute('class', "loader");
		newElement.innerHTML = "";
		p.appendChild(newElement);

		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4) {
				let data = JSON.parse(xhr.responseText);
				let id = data.id;
				let name = data.name;
				p.removeChild(newElement);
				console.log(name + id + " was added...");
			}
		}
		document.getElementById("task").value = "";
		xhr.send(JSON.stringify(params));
	}
};

//deletes a task
const deleteTask = taskId => {
	let listItem = document.getElementById(taskId);
	let xhr = new XMLHttpRequest();
	let url = "http://localhost:3000/api/tasks/";
	let p = document.querySelector(".loaderContainer");
	let newElement = document.createElement("div");
	let params;

	xhr.open("delete", url + taskId);
	xhr.setRequestHeader("Content-Type", "application/json");

	document.getElementById("newTask").disabled = true;
	newElement.setAttribute('class', "loader");
	newElement.innerHTML = "";
	p.appendChild(newElement);
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			console.log(taskId + " was deleted...");
			let data = JSON.parse(xhr.responseText);
			p.removeChild(newElement);
			document.getElementById("newTask").disabled = false;
		}
	}

	xhr.send(JSON.stringify(params));
}

//opens the textbox on dbl click
const editTask = value => {
	let span_el = document.getElementById(value + "span");
	let span_Text = document.getElementById(value + "span").innerText;
	let allSpans = document.querySelectorAll(".editHover");
	span_el.ondblclick = null;
	span_el.classList.remove("editHover");
	console.log(allSpans);

	for (let i = 0; i < allSpans.length; i++) {
		allSpans[i].ondblclick = null;
		allSpans[i].classList.remove("editHover");
		console.log(allSpans[i]);
	}

	span_el.innerHTML = `<input class="css-edit-input" type="text" id="taskEdit" maxlength="50" value="${span_Text}"><a onclick="eventHandler(${value})"><i class="fa-solid fa-check check"></i></a>`;

	document.querySelector("#taskEdit").addEventListener("keyup", function() {
		if (event.keyCode === 13) {
			eventHandler(value);
		}
	});
}

//runs event on enter or click
const eventHandler = val => {
	let taskDescription = document.querySelector("#taskEdit").value;
	putTask(val, taskDescription);
}

//enters the change into the json file
const putTask = (changeId, changeText) => {
	let span_el = document.getElementById(changeId + "span");
	let xhr = new XMLHttpRequest();
	let url = "http://localhost:3000/api/tasks/";
	let params = {
		name: changeText
	};

	if (changeText != null) {
		xhr.open("put", url + changeId);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4) {
				console.log(changeId + " was changed...");
				let data = JSON.parse(xhr.responseText);
				span_el.innerHTML = `<span id='${changeId + "span"}' 			ondblclick="editTask(${changeId})">${changeText}</span>`
			}
		}

		xhr.send(JSON.stringify(params));
	}

}
