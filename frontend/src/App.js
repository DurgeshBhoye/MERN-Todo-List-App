import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import "./App.css";

const App = () => {

	const [task, setTask] = useState("");
	const [tasks, setTasks] = useState([]);

	const inputRef = useRef();

	useEffect(() => {                 // focus on the input field on page load
		inputRef.current.focus();
	}, []);

	// update when any changes in the task list
	useEffect(() => {
		getTasks();
	}, []);

	axios.defaults.baseURL = "http://localhost:5050";        // port number for database connection


	// function to get all the tasks
	const getTasks = async () => {
		try {
			const response = await axios.get("/api/tasks");
			setTasks(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	//function to add a task
	const addTask = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post("/api/task", { task });

			if (response.data.success) {
				setTask("");                      // Set the task value to empty
				getTasks();                     // Get the tasks again
			} else {
				// Handle the error
			}
		} catch (error) {
			console.error(error);
		}
	};


	// Function to delete a task
	const deleteTask = async (id) => {
		try {
			const response = await axios.delete(`/api/tasks/${id}`);
			if (response.data.success) {
				getTasks();
			}
		} catch (error) {
			console.error(error);
		}
	};

	// Function to update a task
	const updateTask = async (id, newTask) => {
		try {
			const response = await axios.put(`/api/tasks/${id}`, { task: newTask });
			if (response.data.success) {
				getTasks();
			}
		} catch (error) {
			console.error(error);
		}
	};


	// Function to delete all tasks
	const deleteAllTasks = async () => {
		try {
			let conf = window.confirm('Are you sure you want to delete all tasks?');        // confirm delete all tasks
			if (conf) {
				const response = await axios.delete(`/api/tasks`);
				if (response.data.success) {
					getTasks();                      // Refresh the list of tasks
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	// mark tasks as completed
	const handleChange = async (id, check) => {
		// setChecked(!check);
		try {
			await axios.put(`/api/tasks/${id}/checked`, { checked: !check });
			getTasks();
		} catch (error) {
			console.log(error);
		}
	};

	const leftTodos = tasks.length;    //remaining tasks

	return (
		<Fragment>
			<div className="App">

				<h1 className='fw-bolder text-light'>To Do List App</h1>

				<form className='d-flex align-item-center justify-content-center mt-4 row' onSubmit={addTask}>

					<label className='fs-5 col-8 col-lg-3 text-primary-emphasis'><b>Enter Task: </b></label>

					{/* Input field to the task name */}
					<input
						ref={inputRef}
						className='border border-none rounded col-8 p-sm-2 col-lg-6 p-lg-1 p-2 mx-lg-2 my-lg-0 my-2'
						type="text"
						placeholder='Enter Task'
						value={task}
						onChange={(e) => setTask(e.target.value)}
						required
					/>

					<button className='col-8 col-lg-2 btn btn-success align-middle' type='submit'>Add Task</button>
				</form>


				<div className="text-center mt-4">

					{tasks.length === 0 && <h5 className="fw-bold">Todos</h5>}
					{tasks.length !== 0 && <h5 className="fst-italic">{leftTodos} {leftTodos === 1 ? `task` : `tasks`} remaining</h5>}
					<hr />

					{tasks.length === 0 && <p className='text-white-50'>You are done!</p>}

					{/* Display Tasks */}

					{tasks.map((task) => (
						<div className="bg-light w-75 mx-auto shadow p-2 my-3 rounded d-lg-flex justify-content-between align-items-center" key={task._id} >

							{/* Check button */}
							<div class="form-check checkbox-xl">
								<input class="form-check-input" type="checkbox" checked={task.checked} onClick={() => handleChange(task._id, task.checked)} />
								<label className={task.checked ? 'text-decoration-line-through' : ''}>
									{task.name}
								</label>
							</div>

							{/* <h6>{task.name}</h6> */}

							<div className="inner-div">

								{/* Button to update/edit task */}
								<button
									className="btn btn-primary m-1 btn-sm"
									onClick={() => {
										let currentTaskName = task.name;
										const newTask = prompt("Enter the updated task:", currentTaskName);
										if (newTask) {
											updateTask(task._id, newTask);
										}
									}}
								>
									Update
								</button>

								{/* Button to delete a task */}
								<button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}>
									Delete
								</button>

							</div>
						</div>
					))}

				</div>

				{/* Button to delete all the tasks*/}
				<button className="btn btn-warning btn-block" onClick={deleteAllTasks}>Delete All Tasks</button>
			</div>
		</Fragment>
	)
};

export default App;
