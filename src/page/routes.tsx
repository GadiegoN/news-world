import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "./_layouts/admin";
import { AuthLayout } from "./_layouts/auth";
import { AppLayout } from "./_layouts/app";
import { Home } from "./app/home";
import { New } from "./app/noticia";
import { SignIn } from "./auth/sign-in";
import { Dashboard } from "./admin/dashboard";
import { AddNew } from "./admin/add-new";
import { PrivateRoute } from "./private-routes";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/noticia/:id', element: <New /> },
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            { path: '/login', element: <SignIn /> }
        ]
    },
    {
        path: '/',
        element: <PrivateRoute><AdminLayout /></PrivateRoute>,
        children: [
            { path: '/painel-admin', element: <Dashboard /> },
            { path: '/painel-admin/add', element: <AddNew /> },
        ]
    },
])