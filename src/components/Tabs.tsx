/** @format */

import { cn } from "../utils/cn";

interface TabType {
  isTabActive?: boolean;
  tabLabel: string;
  onClick?: () => void;
}

export function Tab({ isTabActive, tabLabel, onClick }: TabType) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 min-w-[100px]   border-y border-x-white  h-[44px]   flex items-center justify-center rounded-b-none  font-bold  -mb-[.8px] z-10 w-full ",
        {
          "bg-[#F9FAFB] text-primary  border-b-primary  ": isTabActive,
          " bg-[#F9FAFB]  text-black  ": !isTabActive,
        }
      )}
    >
      {tabLabel}
    </button>
  );
}
