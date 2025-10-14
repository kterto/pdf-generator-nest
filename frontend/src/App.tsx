import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./core/queryClient";
import { RouterProvider } from "react-router-dom";
import router from "./core/router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  );
}

export default App;
