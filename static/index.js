var taskName = document.getElementById("taskName")
var addBtn = document.getElementById("addButton");
var output_container = document.getElementsByClassName("output_container");
var taskList = [];
var editMode = false;

fetchDataFromServer();

/*-------Adding event listener to Add Task button-------*/
addBtn.addEventListener("click",()=>{
    if(editMode && taskName.value.trim().length > 0)
    {
        handleEdit();
    }
    else if(editMode == false && taskName.value.trim().length > 0)
    {
        let subContainer = createTaskObject(taskName.value);
        output_container[0].appendChild(subContainer);
        taskName.value = ""
        console.log("Line 20",taskList);
    }
})

/*-------Creating the structure of task Object-------*/
function createTaskObject(taskTitle)
{
    let taskToAdd = {
        id:Date.now(),
        title:taskTitle,
        status:false,
        editFlag:false
    };
    /*-------Added new task to the global Array of tasks-------*/
    taskList.push(taskToAdd);
    saveTaskToServer(taskToAdd)
    var returnNode = createTaskContainer(taskToAdd);
    return returnNode;
}

/*-------Craeting all elements for a task title(span), checkbox, delete and wrapping them in <div>-------*/
function createTaskContainer(task)
{
    /*-------Elements creation-------*/
    var subContainer = document.createElement("div");
    var iconsContainer = document.createElement("div");
    var labelContainer = document.createElement("div");
    var label = document.createElement("span");
    var checkBox = document.createElement("input");
    var deleteIcon = document.createElement("span");
    var editIcon = document.createElement("input");

    /*-------Added Elements properties-------*/
    subContainer.classList.add("incompleted")
    label.id = task.id+"label"
    checkBox.id = task.id+"checkbox"
    deleteIcon.id = task.id+"deleteIcon"
    editIcon.id = task.id+"editIcon"
    editIcon.id = task.id+"editIcon"

    checkBox.type = "checkbox"
    label.innerText = task.title;
    deleteIcon.innerHTML = "&#128465;"
    deleteIcon.title = "Delete task"
    deleteIcon.classList.add("delete") 
    editIcon.type = "button"
    editIcon.value = "Edit"
    editIcon.title = "Edit task"
    editIcon.classList.add("edit") 
    checkBox.classList.add("checkBox") 
    label.classList.add("label")
    iconsContainer.classList.add("icons-container")
    labelContainer.classList.add("label-container")
    /*adding style*/
    deleteIcon.style.cursor = "pointer";
    
    /*-------Adding Event Listeners on newly created elements--------*/
    checkBox.addEventListener("change",()=>{
        console.log("checked icon is clicked",checkBox.checked)
        if(checkBox.checked)
        {
            console.log("this checkbox is checked");
            label.innerHTML = "<s>"+label.innerHTML+"</s>"
            task.status = true;
            updateTaskStatusInServer(task)
        }
        else
        {
            label.innerHTML = task.title;
            task.status = false;
            updateTaskStatusInServer(task)
        }
    })
    deleteIcon.addEventListener("click",() => {
        handleDelete(task.id,subContainer);
    });
    editIcon.addEventListener("click",() => {
        console.log("Line 90",task)
        console.log("Line 91",taskList)
        console.log("edit icon is clicked")
        task.editFlag = true; 
        taskName.value = task.title;
        taskName.focus();
        /*Document is in edit mode now*/
        editMode = true;
        /*Disabling buttons*/
    })

    updateTaskStatus(checkBox,label,task)
    /*-------Appended all child elements to div container-------*/
    labelContainer.appendChild(label)
    iconsContainer.appendChild(checkBox)
    iconsContainer.appendChild(deleteIcon)
    iconsContainer.appendChild(editIcon)
    
    subContainer.appendChild(iconsContainer)
    subContainer.appendChild(labelContainer)
    return subContainer;
}

/*-------Function to handle updations in any task-------*/
function updateTaskStatus(checkBox ,label , task)
{
    if(task.status)
	{
		label.innerHTML = "<s>" + task.title + "</s>";
		checkBox.checked = true;
	}
}

/*-------Function to handle Deletion in any task-------*/
function handleDelete(id,subContainer)
{
    deleteTaskFromServer(id);
    let childNumber = 0;
    let task ;
    for(let iter = 0 ; iter < taskList.length; iter++)
    {
        childNumber++;
        task = taskList[iter];
        if(task.id == id)
        {
            if(confirm("Are you sure to delete this? 👀")){
                taskList.splice(iter,1);
                //output_container[0].childNodes[childNumber].remove();  //dom upddate-this is also working
                subContainer.remove();
            }
            break;
        }
    }
}

/*-------function to Update task name in DOM -------*/
/*------- we are searching using our own id instead of mongoDB _id in auth.js because --------*/
/*------- in taskList array for new tasks we dont have _id -------*/
function handleEdit()
{
    console.log("In Editing function")
    let childNumber = 0;
    let taskTitle = taskName.value;
    console.log("input",taskName.value,"value",taskTitle);

    for(let iter = 0 ; iter < taskList.length; iter++)
    {
        childNumber++;
        task = taskList[iter];
        if(task.editFlag)
        {
            taskName.value = "";
            task.title = taskTitle;
            task.editFlag = false;
            console.log(output_container[0].childNodes[childNumber].childNodes[1].childNodes[0]);
            if(task.status)
                output_container[0].childNodes[childNumber].childNodes[1].childNodes[0].innerHTML = "<s>"+taskTitle+"</s>";
            else
                output_container[0].childNodes[childNumber].childNodes[1].childNodes[0].innerHTML = taskTitle;
            /*Document is not on edit mode now*/
            editMode = false;
            updateTaskStatusInServer(task);
            console.log(task);
            break;
        }
    }
}

/*-------Fetch old data from server-------*/
function fetchDataFromServer()
{
    const xhr = new XMLHttpRequest();
	xhr.open("GET","/getData");

	xhr.onreadystatechange = function()
	{
		if(this.readyState == 4 && this.status == 200)
		{
			taskList = JSON.parse(xhr.responseText);
            console.log("Line 178", taskList)
		}
        
        taskList.forEach(function(task)
		{
			let subContainer = createTaskContainer(task);
            output_container[0].appendChild(subContainer);

		});
	}
	xhr.send();
}

function saveTaskToServer(task)
{
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(this.state == 4 && this.status == 200)
        {
            console.log(this.responseText);
        }
    };
    xhr.open("POST","/save");
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(JSON.stringify(task));
}

/*----------- function to request deletion of task from the server -----------*/
function deleteTaskFromServer(id)
{
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(this.state == 4 && this.status == 200)
        {
            console.log(this.responseText);
        }
    };
    xhr.open("POST",`/remove/${id}`);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send();
}

function updateTaskStatusInServer(task)
{   
    console.log(task);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(this.state == 4 && this.status == 200)
        {
            console.log(this.responseText);
        }
    };

    xhr.open("POST","/update");
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.send(JSON.stringify(task));
}

/*-------Helper function to change the disable/able all checkbox-------*/
function changeCheckBoxAbility()
{

    var checkedBoxes = document.querySelectorAll('input[type=checkbox]');
    console.log(checkedBoxes)
    checkedBoxes.forEach((checkBox) => {
        checkBox.disabled ? checkBox.disabled = false : checkBox.disabled = true;
    })
}
