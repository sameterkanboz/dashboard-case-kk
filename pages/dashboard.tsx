"use client";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import Modal from "../src/components/Dialog";
import Sidebar from "../src/components/Sidebar";
import DraggableTask from "../src/components/Task";
import { useDialog } from "../src/context/UIContext";
import { useCreateTask } from "../src/hooks/board/useCreateTask";
import { useDeleteTask } from "../src/hooks/board/useDeleteTask";
import { Flags } from "../src/types/flags";
import { getAuthorizationHeader } from "../src/utils/getAuthorizationHeader";
export interface Task {
  id: number;
  createdUserId: number;
  name: string;
  description: string | null;
  code: number;
  boardId: number;
  flagId: number;
  order: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedUserId: number | null;
}

type BoardTypes = "Open" | "Todo" | "Doing" | "Done" | "Closed";

export interface data {
  id: number;
  name: BoardTypes;
  openAction: boolean;
  completeAction: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}
function Sortable({
  tasks,
  activeId,
  deleteTask,
  handleDialogState,
  handleTask,
}: {
  handleDialogState: (state: boolean) => void;
  handleTask: (task: Task | null) => void;
  deleteTask: (taskCode: number) => void;
  tasks: Task[] | null;
  activeId?: UniqueIdentifier;
}) {
  return (
    <SortableContext items={tasks || []} strategy={verticalListSortingStrategy}>
      {tasks &&
        tasks.map((task: Task | null) => (
          <>
            {task && (
              <DraggableTask
                handleDialogState={handleDialogState}
                handleTask={handleTask}
                deleteTask={deleteTask}
                id={task.id}
                task={task}
                key={task.code}
              />
            )}
          </>
        ))}
    </SortableContext>
  );
}

export type TaskDataT = {
  name: string;
  description: string;
  boardId: number;
  flagId: number;
  startDate: string;
  endDate: string;
};
const Dashboard = () => {
  const [boards, setBoards] = useState<data[] | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [todo, setTodo] = useState<Task[] | null>(null);
  const [doing, setDoing] = useState<Task[] | null>(null);
  const [done, setDone] = useState<Task[] | null>(null);
  const [closed, setClosed] = useState<Task[] | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier>(0);

  const { deleteTask } = useDeleteTask();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  const fetchBoard = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/boards",
        {
          headers: {
            accept: "application/json",
            ...getAuthorizationHeader(),
          },
        }
      );

      const data = response.data;
      setBoards(data.data);
      setTasks(data.data[0].tasks);
      setTodo(data.data[1].tasks);
      setDoing(data.data[2].tasks);
      setDone(data.data[3].tasks);
      setClosed(data.data[4].tasks);
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    fetchBoard();
  }, []);

  const { createTask } = useCreateTask();

  const flags = Flags;
  const { handleDialogState, handleTask } = useDialog();

  const handleCreateTask = async (taskData: TaskDataT) => {
    try {
      // Create the task via the API
      const createdTask = await createTask(taskData);
      // Update the state to add the created task to the appropriate board
      setBoards((prevBoards: any) => {
        if (!prevBoards) return null;
        // Find the board that the task belongs to
        const updatedBoards = prevBoards.map((board: any) => {
          // Check if the created task belongs to this board
          if (taskData === createdTask.data) {
            // Update the tasks of this board with the new task
            return {
              ...board,
              tasks: [...board.tasks, createdTask],
            };
          }
          return board;
        });
        return updatedBoards;
      });

      // Fetch the latest data after creating the task
      fetchBoard();
    } catch (error) {
      // Handle errors
      console.error("Task oluşturma işlemi başarısız oldu:", error);
    }
  };

  const [taskData, setTaskData] = useState<TaskDataT>({
    name: "",
    description: "",
    boardId: 1,
    flagId: 1,
    startDate: "2022-12-12",
    endDate: "2022-12-12",
  });

  const getTaskPosition = (taskId: number, name: string) => {
    //if array is empty return null
    console.log(
      tasks?.length,
      todo?.length,
      doing?.length,
      done?.length,
      closed?.length,
      "LENGTH"
    );
    switch (name) {
      case "open":
        if (tasks?.length === 0) return null;
        return tasks?.findIndex((task) => task.id === taskId);
      case "todo":
        if (todo?.length === 0) return null;
        return todo?.findIndex((task) => task.id === taskId);
      case "doing":
        if (doing?.length === 0) return null;
        return doing?.findIndex((task) => task.id === taskId);
      case "done":
        if (done?.length === 0) return null;
        return done?.findIndex((task) => task.id === taskId);
      case "closed":
        if (closed?.length === 0) return null;
        return closed?.findIndex((task) => task.id === taskId);
      default:
        return null;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id === over.id) {
      return;
    }

    // update the array tasks below under the tasks

    const handlers = () => {
      setTasks((tasks) => {
        const originalPos = getTaskPosition(active.id as number, "open");
        const newPos = over ? getTaskPosition(over.id as number, "open") : null;
        if (newPos === null) return tasks;
        if (originalPos === null) return tasks;
        if (originalPos === undefined) return tasks;
        if (newPos === undefined) return tasks;
        return arrayMove(tasks || [], originalPos, newPos);
      });

      setTodo((tasks) => {
        const originalPos = getTaskPosition(active.id as number, "todo");
        const newPos = over ? getTaskPosition(over.id as number, "todo") : null;
        if (newPos === null) return tasks;
        if (originalPos === null) return tasks;
        if (originalPos === undefined) return tasks;
        if (newPos === undefined) return tasks;
        return arrayMove(tasks || [], originalPos, newPos);
      });

      setDoing((tasks) => {
        const originalPos = getTaskPosition(active.id as number, "doing");
        const newPos = over
          ? getTaskPosition(over.id as number, "doing")
          : null;
        if (newPos === null) return tasks;
        if (originalPos === null) return tasks;
        if (originalPos === undefined) return tasks;
        if (newPos === undefined) return tasks;
        return arrayMove(tasks || [], originalPos, newPos);
      });

      setDone((tasks) => {
        const originalPos = getTaskPosition(active.id as number, "done");
        const newPos = over ? getTaskPosition(over.id as number, "done") : null;
        if (newPos === null) return tasks;
        if (originalPos === null) return tasks;
        if (originalPos === undefined) return tasks;
        if (newPos === undefined) return tasks;
        return arrayMove(tasks || [], originalPos, newPos);
      });

      setClosed((tasks) => {
        const originalPos = getTaskPosition(active.id as number, "closed");
        const newPos = over
          ? getTaskPosition(over.id as number, "closed")
          : null;
        if (newPos === null) return tasks;
        if (originalPos === null) return tasks;
        if (originalPos === undefined) return tasks;
        if (newPos === undefined) return tasks;
        return arrayMove(tasks || [], originalPos, newPos);
      });
    };

    handlers();

    return;
  };

  const handleDeleteTask = async (taskCode: number | undefined) => {
    try {
      const response = await deleteTask(taskCode);
      console.log("Task silme işlemi başarılı oldu:", response);

      // If deletion is successful, update the state to remove the deleted task
      setBoards((prevBoards) => {
        if (!prevBoards) return null;
        const newBoards = prevBoards.map((board) => {
          board.tasks = board.tasks.filter((task) => task.code !== taskCode);

          return board;
        });
        return newBoards;
      });
      setTasks((prevTasks) => {
        if (!prevTasks) return null;
        return prevTasks.filter((task) => task.code !== taskCode);
      });
      setTodo((prevTasks) => {
        if (!prevTasks) return null;
        return prevTasks.filter((task) => task.code !== taskCode);
      });
      setDoing((prevTasks) => {
        if (!prevTasks) return null;
        return prevTasks.filter((task) => task.code !== taskCode);
      });
      setDone((prevTasks) => {
        if (!prevTasks) return null;
        return prevTasks.filter((task) => task.code !== taskCode);
      });
      setClosed((prevTasks) => {
        if (!prevTasks) return null;
        return prevTasks.filter((task) => task.code !== taskCode);
      });
    } catch (error) {
      console.error("Task silme işlemi başarısız oldu:", error);
    }
  };
  return (
    <>
      <Head>
        <title>kargakarga | dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <section className=" bg-button dark:bg-gray-800 dark:text-gray-200 min-h-screen min-w-full py-14 pr-16 pl-80 w-full">
        <div className="flex flex-col  mb-10 gap-4 dark:bg-gray-800 dark:text-gray-200">
          <span className="mt-20">Frontend Case</span>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Boards
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              List
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Other
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Other
            </button>
          </div>
        </div>

        <div className=" overflow-auto px-6 rounded-lg border-2 border-gray-200  min-h-[500px] rounded-t-none   bg-white-50 text-gray-500">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div className="flex justify-start mt-4 gap-4 overflow-auto min-w-max  h-[455px]">
              {boards?.map((board: data) => (
                <div
                  key={board.id}
                  className="bg-white overflow-auto dark:bg-gray-700 dark:text-gray-200 rounded-md shadow-md p-4 w-80 "
                >
                  <div className="flex justify-between">
                    <span>{board.name}</span>
                    <span>{board.tasks.length}</span>
                    <span>
                      <span>+</span>
                      <span>...</span>
                    </span>
                  </div>
                  <div className="mt-4 gap-5 flex flex-col">
                    {board.name === "Open" && (
                      <Sortable
                        handleDialogState={handleDialogState}
                        handleTask={(task: Task | null) =>
                          task && handleTask != undefined && handleTask(task)
                        }
                        deleteTask={handleDeleteTask}
                        activeId={activeId}
                        tasks={tasks}
                      />
                    )}
                    {board.name === "Todo" && (
                      <Sortable
                        handleDialogState={handleDialogState}
                        handleTask={(task: Task | null) =>
                          task && handleTask != undefined && handleTask(task)
                        }
                        deleteTask={handleDeleteTask}
                        activeId={activeId}
                        tasks={todo}
                      />
                    )}
                    {board.name === "Doing" && (
                      <Sortable
                        handleDialogState={handleDialogState}
                        handleTask={(task: Task | null) =>
                          task && handleTask != undefined && handleTask(task)
                        }
                        deleteTask={handleDeleteTask}
                        activeId={activeId}
                        tasks={doing}
                      />
                    )}

                    {board.name === "Done" && (
                      <Sortable
                        handleDialogState={handleDialogState}
                        handleTask={(task: Task | null) =>
                          task && handleTask != undefined && handleTask(task)
                        }
                        deleteTask={handleDeleteTask}
                        activeId={activeId}
                        tasks={done}
                      />
                    )}
                    {board.name === "Closed" && (
                      <Sortable
                        handleDialogState={handleDialogState}
                        handleTask={(task: Task | null) =>
                          task && handleTask != undefined && handleTask(task)
                        }
                        deleteTask={handleDeleteTask}
                        activeId={activeId}
                        tasks={closed}
                      />
                    )}

                    <button
                      onClick={() => {
                        const taskData = {
                          name: "Task 1",
                          description: `Task ${board.id} description`,
                          boardId: board.id,
                          flagId: 1,
                          startDate: "2022-12-12",
                          endDate: "2022-12-12",
                        };
                        handleCreateTask(taskData);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Quick Task
                    </button>
                    <div>
                      <CreateTask
                        taskData={taskData}
                        setTaskData={setTaskData}
                        board={board}
                        handleCreateTask={handleCreateTask}
                      />
                    </div>
                  </div>
                  <div />
                </div>
              ))}
            </div>
            {/* <DragOverlay>
              {activeId ? (
                <DraggableTask id={activeId} task={undefined} />
              ) : null}
            </DragOverlay> */}
          </DndContext>
        </div>
      </section>
      <Modal />
    </>
  );
};

export default Dashboard;

function CreateTask({
  taskData,
  setTaskData,
  board,
  handleCreateTask,
}: {
  taskData: TaskDataT;
  setTaskData: React.Dispatch<React.SetStateAction<TaskDataT>>;
  board: data;
  handleCreateTask: (taskData: TaskDataT) => void;
}) {
  const [isTextAreaVisible, setTextAreaVisible] = useState(false);

  useEffect(() => {
    setTaskData({ ...taskData, boardId: board.id });
  }, [board.id]);
  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setTextAreaVisible(!isTextAreaVisible)}
      >
        Create Task
      </button>
      {isTextAreaVisible && (
        //create custom task
        <div className="flex flex-col gap-2">
          {/* for board id */}

          <input
            type="text"
            placeholder="Task Name"
            value={taskData.name}
            onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
          />
          <textarea
            placeholder="Task Description"
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
          />
          <select
            value={taskData.boardId}
            onChange={(e) =>
              setTaskData({ ...taskData, boardId: Number(e.target.value) })
            }
          >
            {[
              { id: 1, name: "Open" },
              { id: 2, name: "Todo" },
              { id: 3, name: "Doing" },
              { id: 4, name: "Done" },
              { id: 5, name: "Closed" },
            ].map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
          <select
            value={taskData.flagId}
            onChange={(e) =>
              setTaskData({ ...taskData, flagId: Number(e.target.value) })
            }
          >
            {Flags.map((flag) => (
              <option key={flag.id} value={flag.id}>
                {flag.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={taskData.startDate}
            onChange={(e) =>
              setTaskData({ ...taskData, startDate: e.target.value })
            }
          />
          <input
            type="date"
            value={taskData.endDate}
            onChange={(e) =>
              setTaskData({ ...taskData, endDate: e.target.value })
            }
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              handleCreateTask(taskData);
              setTextAreaVisible(false);
            }}
          >
            Save
          </button>
        </div>
      )}
    </>
  );
}
