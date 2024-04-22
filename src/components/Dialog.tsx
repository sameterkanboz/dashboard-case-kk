import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useDialog } from "../context/UIContext";
import { useDeleteTask } from "../hooks/board/useDeleteTask";
import { Tab } from "./Tabs";
function Attachment() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 ">Attachment</h2>
    </>
  );
}
function SubTask() {
  return (
    <>
      <h5 className="text-2xl font-semibold mb-4 ">SubTask</h5>
    </>
  );
}
function Comment() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 ">Comment</h2>
    </>
  );
}
export default function Modal() {
  const { dialog, handleDialogState, task } = useDialog();
  const [activeTab, setActiveTab] = useState<number>(1);
  const { deleteTask } = useDeleteTask();
  return (
    <>
      {dialog ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            {/*backdrop for onClick*/}
            <div
              onClick={() => handleDialogState(false)}
              className="fixed inset-0 bg-black opacity-0  "
            />

            <div className="relative w-full my-6 mx-auto max-w-7xl ">
              {/*content*/}
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-[600px]">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-2xl">
                    {task?.name} + {task?.id}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => handleDialogState(false)}
                  >
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="flex flex-row">
                  <div className="flex flex-col flex-1">
                    <div className="relative p-6 flex-auto">
                      <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                        {task?.description}
                      </p>
                      <button
                        onClick={() => {
                          if (task?.id) {
                            deleteTask(task.code);
                          }
                        }}
                      >
                        sil
                      </button>
                    </div>

                    <div className="p-4  rounded-lg  max-w-full">
                      <div className="flex">
                        <Tab
                          onClick={() => setActiveTab(1)}
                          isTabActive={activeTab === 1}
                          tabLabel="Attachment"
                        />
                        <Tab
                          onClick={() => setActiveTab(2)}
                          isTabActive={activeTab === 2}
                          tabLabel="SubTask"
                        />
                        <Tab
                          onClick={() => setActiveTab(3)}
                          isTabActive={activeTab === 3}
                          tabLabel="Comment"
                        />
                      </div>

                      <div className=" p-6 rounded-lg border-2 border-gray-200  min-h-[200px] rounded-t-none   bg-white-50 text-gray-500">
                        {activeTab === 1 && <Attachment />}
                        {activeTab === 2 && <SubTask />}
                        {activeTab === 3 && <Comment />}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-1/3 p-4 border-l border-solid border-blueGray-200 bg-[#F3F6FD]">
                    <div className="flex justify-between flex-row ">
                      <span>action</span>
                      <div className="items-center flex justify-between flex-row ">
                        <FaSearch size={16} />

                        <FiMenu size={18} />
                      </div>
                    </div>
                    <div className="overflow-x-auto h-[400px] mt-4 rounded-lg  max-w-full bg-white ">
                      {Array.from({ length: 20 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex justify-between flex-col border-solid border-1 border-gray-200 cursor-pointer"
                        >
                          -
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#F3F6FD] border-1 border-gray-300 border-solid w-18 pt-2">
                    {[
                      { name: "Actions", icon: "A" },
                      { name: "Comments", icon: "C" },
                      { name: "Attachments", icon: "A" },
                      { name: "SubTask", icon: "S" },
                      { name: "History", icon: "H" },
                    ].map((item, index) => (
                      <div className="flex justify-center items-center flex-col">
                        <button
                          type="button"
                          className="text-white m-1 bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          <span className="text-sm">{item.icon}</span>
                        </button>
                        <span className="text-gray-500 text-sm font-semibold cursor-pointer hover:text-gray-700">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
