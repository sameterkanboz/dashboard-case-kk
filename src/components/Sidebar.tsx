import { useRouter } from "next/router";
import { useCurrentUser } from "../hooks/auth/useCurrentUser";
import Accordion from "./Accordion";

const Sidebar = () => {
  const { user: currentUser } = useCurrentUser();
  const router = useRouter();
  return (
    <div className="flex bg-slate-800 w-72 h-screen absolute">
      <aside className="flex flex-col top-0 col-span-1 h-full py-20 bg-secondary gap-4 w-14 justify-start">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="text-2xl text-white cursor-pointer hover:text-gray-300 flex justify-center items-center"
          >
            <span>d</span>
          </div>
        ))}
        <div
          className="
        absolute bottom-6 flex items-center justify-center w-10 h-10 
        rounded-full
        "
        >
          <button
            onClick={() => {
              router.push("/profile");
            }}
            className="text-2xl text-white cursor-pointer hover:text-gray-300"
          >
            {currentUser?.data.fullName[0]}
          </button>
        </div>
      </aside>

      <main className="w-full col-span-6 h-screen bg-slate-300 py-20  border-b border-red-200 gap-2 flex flex-col px-2">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="">
            <div className="p-1 bg-gray-200 rounded-lg">
              <Accordion
                title={"Project" + item}
                answer={["Overview", "Notifications", "Analytics", "Reports"]}
              />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Sidebar;
