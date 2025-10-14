import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./core/queryClient";
import { RouterProvider } from "react-router-dom";
import router from "./core/router";
import { useEffect } from "react";
import { axiosSetup } from "./core/api";

function App() {
  useEffect(() => {
    axiosSetup();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  );
}

export default App;
