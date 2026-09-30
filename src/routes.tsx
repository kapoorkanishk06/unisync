import { createBrowserRouter } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Upload } from "./pages/Upload";
import { Panic } from "./pages/Panic";
import { Subjects } from "./pages/Subjects";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell><Outlet /></AppShell>,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "app",
        element: <Dashboard />,
      },
      {
        path: "app/upload",
        element: <Upload />,
      },
      {
        path: "app/panic",
        element: <Panic />,
      },
      {
        path: "app/subjects",
        element: <Subjects />,
      },
      {
        path: "app/settings",
        element: <Settings />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
