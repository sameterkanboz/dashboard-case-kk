import { Task } from "../../pages/dashboard";

type CardProps = {
  title: string;
  description?: string;
  tasks?: Task[];
};

const Card = ({ title, description, tasks }: CardProps) => {
  return (
    <a
      href="#"
      className="block max-w-sm py-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 w-3/4"
    >
      <h5 className="px-6 pb-2 mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white border-b-2">
        {title}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {tasks && (
          <span className="block text-sm text-gray-500 dark:text-gray-400">
            {description}
          </span>
        )}
        {tasks && (
          <>
            {tasks.map((task) => (
              <span
                key={task.id}
                className="block mt-2 text-sm text-gray-500 dark:text-gray-400"
              >
                {task.name}
              </span>
            ))}
          </>
        )}
      </p>
    </a>
  );
};

export default Card;
