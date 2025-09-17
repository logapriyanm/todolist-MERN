import { useState, useEffect } from "react"

const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "https://todolist-mern-backend-bur5.onrender.com";


    const handleSubmit = () => {
        setError("");

        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ title, description })
            })
                .then((res) => res.json())
                .then((newTodo) => {
                    setTodos([...todos, newTodo]); // use actual response with _id
                    setTitle("");
                    setDescription("");
                    setMessage("Task added Successfully");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch(() => {
                    setError("Unable to create your Task");
                });


        }
    }
    useEffect(() => {
        getItems()
    }, [])


    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res)
            })
    }

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");

        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })
                    setTodos(updatedTodos)
                    setEditTitle("");
                    setEditDescription("")
                    setMessage("Task updated Successfully")
                    setTimeout(() => {
                        setMessage("")
                    }, 3000)
                    setEditId(-1)

                } else {
                    setError("Unable to create Task")
                }
            }).catch(() => {
                setError("Unable to create your Task")
            })

        }
    }

    const handleEditCancel = () => {
        setEditId(-1)
    }


    const handleDelete = (id) => {
        if (window.confirm('Are you Sure want to delete?')) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            })
                .then(() => {
                    const updatedTodos = todos.filter((item) => item._id !== id)
                    setTodos(updatedTodos)
                })
        }
    }

    return (
        <section className="bg-gray-400 min-h-screen  flex flex-col  items-center  justify-center ">

            <div className="w-2xl h-auto p-5 rounded-xl bg-white">
                <div>
                    <h1 className="text-center text-3xl font-medium bg-green-700 p-4 font-sans text-white m-2 rounded-xl">ToDo Project with MERN Stack</h1>
                </div>
                <div className="m-2">
                    <h3 className="text-xl font-medium">Add Task</h3>
                    {message && <p>{message}</p>}
                    <div className="flex gap-2  m-2 w-full ">
                        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} type="text" value={title} className="border-2 border-gray-500 bg-slate-300 p-1 outline-none rounded-sm" />
                        <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} type="text" value={description} className="border-2 bg-slate-300  border-gray-500 outline-none p-1 rounded-sm" />
                        <button className="border-2 px-2 rounded-sm hover:cursor-pointer bg-gray-800 text-white ml-5  " onClick={handleSubmit}>Submit</button>
                    </div>
                    {error && <p className="bg-red-600 text-white">{error}</p>}
                </div>
                <div className="m-2  " >
                    <h3 className="text-xl font-medium">Tasks</h3>

                    <ul className=" ">
                        {
                            todos.map((item) =>
                                <li className="flex justify-between bg-blue-600 space-y-2   px-3 m-2 rounded-lg items-center ">
                                    <div className="flex flex-col ">
                                        {
                                            editId == -1 || editId !== item._id ? <>
                                                <span className="text-xl font-medium font-sans my-1">{item.title}</span>
                                                <span className="font-mono">{item.description}</span>
                                            </> : <>
                                                <div className="flex gap-2  m-2 w-full ">
                                                    <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} type="text" value={editTitle} className="border-2 p-1 outline-none rounded-sm" />
                                                    <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} type="text" value={editDescription} className="border-2 outline-none p-1 rounded-sm" />

                                                </div>
                                            </>
                                        }

                                    </div>
                                    <div className="flex gap-6">
                                        {editId === item._id ? (
                                            <>
                                                <button
                                                    className="px-4 py-0.5 rounded-sm hover:cursor-pointer bg-yellow-600 text-black border-none"
                                                    onClick={handleUpdate}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="px-2 py-0.5 rounded-sm hover:cursor-pointer bg-red-700 border-none text-white"
                                                    onClick={handleEditCancel}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="px-4 py-0.5 rounded-sm hover:cursor-pointer bg-yellow-600 text-black border-none"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-2 py-0.5 rounded-sm hover:cursor-pointer bg-red-700 border-none text-white"
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}

                                    </div>

                                </li>
                            )
                        }




                    </ul>
                </div>
            </div>
        </section>
    )

}
export default Todo
