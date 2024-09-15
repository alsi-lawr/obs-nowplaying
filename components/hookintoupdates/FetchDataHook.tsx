import { useContext } from "react";
import { FetchDataContext } from "./FetchDataProvider";

export const useFetchData = () => {
  const context = useContext(FetchDataContext);

  if (context === undefined) {
    throw new Error("useFetchData must be used within a FetchDataProvider");
  }
  return context;
};
