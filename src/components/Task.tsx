import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../../pages/dashboard";
import { Flags } from "../types/flags";
const DraggableTask = ({
  task,
  id,
  deleteTask,
  handleDialogState,
  handleTask,
}: {
  handleDialogState: (state: boolean) => void;
  handleTask: (task: Task) => void;
  task: Task;
  id: UniqueIdentifier;
  deleteTask: (taskCode: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const flags = Flags;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      //   key={task.code}
      style={style}
      className="flex justify-between flex-col border-solid border-4 border-gray-600 cursor-pointer"
    >
      <>
        <button
          onMouseDown={() => {
            deleteTask(task.code);
          }}
          className="text-red-800"
        >
          delete
        </button>
        <div
          onMouseUp={() => {
            if (handleDialogState && handleTask) {
              handleDialogState(true);
              handleTask(task);
            }
          }}
        >
          <span>{task?.name}</span>
          <p>{task?.description}</p>
          <span>{task?.code}</span>
          <div>
            <span className="text-xs">
              {task?.startDate
                ? new Date(task.startDate).toLocaleDateString("en-US")
                : ""}
            </span>
            <span className="text-xs"> - {""}</span>
            <span className="text-xs">
              {task?.endDate
                ? new Date(task.endDate).toLocaleDateString("en-US")
                : ""}
            </span>
          </div>
        </div>
      </>

      {flags.map((flag) => (
        <>
          {task?.flagId === flag.id && (
            <div className="flex flex-row items-center justify-start gap-4">
              <span>milestone name</span>
              <svg
                key={flag.id}
                width="12"
                height="14"
                viewBox="0 0 12 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.61911 6.55667L11.2878 3.40133C11.3698 3.246 11.3644 3.05933 11.2738 2.90933C11.1838 2.75933 11.0211 2.66733 10.8458 2.66733H6.45711V1.76C6.45711 1.484 6.23311 1.26 5.95711 1.26H1.65442V1C1.65442 0.724 1.43042 0.5 1.15442 0.5C0.878419 0.5 0.654419 0.724 0.654419 1V13C0.654419 13.276 0.878419 13.5 1.15442 13.5C1.43042 13.5 1.65442 13.276 1.65442 13V9.078L5.45844 8.984V9.998C5.45844 10.1327 5.51311 10.262 5.60911 10.356C5.70511 10.45 5.81044 10.498 5.97044 10.498L10.8578 10.3787C11.0318 10.3747 11.1904 10.28 11.2778 10.1293C11.3651 9.97933 11.3684 9.794 11.2858 9.64133L9.61911 6.55667Z"
                  fill={flag.color}
                />
              </svg>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default DraggableTask;
