import React, { ReactNode, useContext, useState } from "react";
import { Task } from "../../pages/dashboard";

export interface DialogProviderProps {
  children?: ReactNode;
}

export interface DialogContextModel {
  dialog: boolean;
  handleDialogState: (newState: boolean) => void;
  task?: Task | null;
  handleTask?: (newState: Task | null) => void;
}

export const DialogContext = React.createContext<DialogContextModel>(
  {} as DialogContextModel
);

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialog, setDialog] = useState<boolean>(false);

  const [task, setTask] = useState<Task | null>(null);

  function handleTask(newState: Task | null) {
    setTask(newState);
  }

  function handleDialogState(newState: boolean) {
    setDialog(newState);
  }
  const values = {
    dialog,
    handleDialogState,
    task,
    handleTask,
  };

  return (
    <DialogContext.Provider value={values}>{children}</DialogContext.Provider>
  );
};

export function useDialog() {
  return useContext(DialogContext);
}
