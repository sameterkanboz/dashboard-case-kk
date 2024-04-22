import { getAuthorizationHeader } from "../../utils/getAuthorizationHeader";

export const useGetBoard = () => {
  const board = async () => {
    const board = await fetch(process.env.NEXT_PUBLIC_API_URL + "/board", {
      headers: {
        ...getAuthorizationHeader(),
        "Content-Type": "application/json",
      },
    });

    return board.json();
  };

  return { board };
};
