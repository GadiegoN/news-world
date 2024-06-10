import { RouterProvider } from "react-router-dom";
import { routes } from "./page/routes";
import { ThemeProvider } from "./components/theme-provider";

export function App() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="news-world">
      <RouterProvider router={routes} />
    </ThemeProvider>
  )
}