import { useState, useEffect } from "react";
import { Cross2Icon, CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { todo } from "node:test";

type Todo = {
  id?: string;
  task: string;
};

// read todos from session storage
const getTodos = async () => {
  const todos = await fetch("http://localhost:8080/tasks");
  return todos;
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([{ task: "" }]);
  const [markedTodos, setMarkedTodos] = useState<number[]>([]);
  const [editedTodo, setEditedTodo] = useState<string>("");
  const [editIndex, setEditIndex] = useState<string>("");

  useEffect(() => {
    // fetch the todos from the server
    getTodos().then((todos) => {
      todos.json().then((todos) => {
        setTodos(todos);
      });
    });
  }, []);

  console.log("todos:", todos);
  // add todo
  const handleAddTodo = (todo: string) => {
    // Check if todo is empty
    if (todo.trim() === "") {
      return;
    }

    const task = { todo };

    // send the todo to the server and get the id
    fetch("http://localhost:8080/create-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ task }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, { id: data.task.id, task: data.task.todo }]);
      });
  };
  // delete todo
  const handleDeleteTodo = (id: string) => {
    console.log("id:", id);
    // delete the todo from the server
    fetch(`http://localhost:8080/delete-task/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id }),
    });

    // reload the todos
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // handle mark todo
  const handleMarkTodo = (index: number) => {
    // check if the todo is already marked
    if (markedTodos.includes(index)) {
      // unmark the todo
      setMarkedTodos(markedTodos.filter((todo) => todo !== index));

      // unmark the todo in the server
    } else {
      // mark the todo
      setMarkedTodos([...markedTodos, index]);
    }
  };

  // handle save todo for the specific todo regarding the id
  const handleSaveTodo = () => {
    // check if the todo is empty
    if (editedTodo.trim() === "") {
      return;
    }

    console.log("editedTodo:", editedTodo);
    console.log("editIndex:", editIndex);

    // update the todo in the client
    setTodos(
      todos.map((todo) => {
        if (todo.id === editIndex) {
          return { ...todo, task: editedTodo };
        } else {
          return todo;
        }
      })
    );

    // update the todo in the server
    fetch(`http://localhost:8080/edit-task/${editIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id: editIndex, task: editedTodo }),
    });
    // reset the edit index
    setEditIndex("");
  };

  return (
    <div className="mx-5 max-w-md md:mx-auto md:max-w-2xl mt-10">
      {/* todolist input */}
      <div className="">
        <div className="focus-within:ring-1 focus-within:ring-violet-400 dark:focus-within:ring-violet-500 w-full h-14 bg-[#fff]/75  dark:bg-[#25273c]/75 backdrop-blur-3xl rounded">
          {/* custom check box */}
          <div className="flex h-full m-5">
            <div className="flex items-center my-auto bg-slate-400 hover:bg-gradient-to-r from-blue-400 to-violet-400  h-7 w-7 rounded-full overflow-hidden p-[1.5px] cursor-pointer">
              <div className="w-full h-full rounded-full bg-[#fff]  dark:bg-[#25273c]/75"></div>
            </div>

            <input
              type="text"
              placeholder="Create a new todo..."
              className="w-full h-full bg-transparent outline-none px-3 text-[#25273c] dark:text-[#fff] caret-violet-400 font-300 tracking-wider"
              // value={editedTodo}
              // onChange={(e) => {
              //   setEditedTodo(
              //     e.currentTarget.value.charAt(0).toUpperCase() +
              //       e.currentTarget.value.slice(1)
              //   );
              // }}
              onKeyPress={(e) => {
                // check if the input is empty
                if (e.key === "Enter") {
                  if (e.currentTarget.value.trim() === "") return;
                  handleAddTodo(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>{" "}
        {/*  todos  */}
        <div
          className="todos-container mt-4 rounded-t"
          style={{ maxHeight: "380px", overflowY: "auto" }}
        >
          {todos?.map((todo, index) => (
            <div className="" key={index}>
              {" "}
              <div
                className={`group cursor-pointer flex items-center justify-between bg-[#fff] dark:bg-[#25273c] p-5  h-14 border-b ${
                  index !== todos.length - 1
                    ? "border-b-1 border-b-slate-200 dark:border-b-slate-600"
                    : "border-b-1 border-b-slate-200 dark:border-b-slate-600"
                } ${index === 0 ? "rounded-t" : ""} ${
                  index === todos.length - 1 ? "rounded-b-none" : ""
                }`}
                key={index}
                style={{ flexGrow: 1 }}
              >
                <div
                  className="flex items-center flex-1"
                  onClick={() => {
                    handleMarkTodo(index);
                    //   setMarkedTodos
                  }}
                >
                  <div
                    className={`flex items-center my-auto ${
                      markedTodos.includes(index)
                        ? "bg-gradient-to-r from-blue-400 to-violet-400"
                        : "bg-slate-600"
                    }   h-7 w-7 rounded-full overflow-hidden p-[1.5px] cursor-pointer`}
                    //   onClick={() => handleMarkTodo(index)}
                  >
                    <div
                      className={`w-full h-full rounded-full bg-[#fff] flex justify-center items-center ${
                        markedTodos.includes(index)
                          ? "bg-gradient-to-r from-blue-400 to-violet-400"
                          : "dark:bg-[#25273c]"
                      }`}
                    >
                      {markedTodos.includes(index) && (
                        <CheckIcon className="w-4 h-4 text-[#fff] dark:text-[#fff]" />
                      )}
                    </div>
                  </div>
                  <p
                    className={`ml-5 text-[#25273c] font-light dark:text-[#fff] tracking-wider ${
                      markedTodos.includes(index)
                        ? "line-through text-gray-300 dark:text-gray-500"
                        : ""
                    }`}
                  >
                    {todo.task}
                  </p>
                </div>
                <div className="flex items-center gap-3 ">
                  {" "}
                  <Dialog>
                    <DialogTrigger>
                      {/* Render the edit button */}
                      <div
                        className="text-[#25273c] dark:text-[#fff] hidden group-hover:block"
                        onClick={() => {
                          setEditIndex(todo.id!);
                          setEditedTodo(todo.task);
                        }}
                      >
                        <Pencil1Icon className="w-5 h-5 text-slate-500 dark:text-slate-600" />
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                      </DialogHeader>
                      <div className="p-5">
                        <input
                          type="text"
                          value={editedTodo}
                          onChange={(e) => {
                            setEditedTodo(e.target.value);
                            // setEditIndex(todo.id!);
                          }}
                          placeholder="Edit the todo..."
                          className="w-full h-10 px-3 text-[#25273c] dark:text-[#fff] rounded border border-gray-300 dark:border-gray-700 focus:ring-1 focus:ring-violet-400 dark:focus:ring-violet-500 outline-none"
                        />
                        <div className="flex justify-end mt-5 space-x-4">
                          <DialogClose asChild>
                            <div
                              className="px-4 py-2 text-sm font-medium text-gray-500 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                              //   onClick={handleCloseDialog}
                            >
                              Cancel
                            </div>
                          </DialogClose>

                          <DialogClose asChild>
                            <button
                              className="px-4 py-2 text-sm font-medium text-white bg-violet-500 hover:bg-violet-600 rounded"
                              onClick={handleSaveTodo}
                            >
                              Save
                            </button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <button
                    className="text-[#25273c] dark:text-[#fff] hidden group-hover:block"
                    onClick={() => {
                      handleDeleteTodo(todo.id!);
                      console.log("todo.id:", todo.id, "todo:", todo.task);
                    }}
                  >
                    <Cross2Icon className="w-5 h-5 text-slate-500 dark:text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
      {/* todos status */}
    </div>
  );
};

export default TodoList;
