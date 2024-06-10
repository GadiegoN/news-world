import { Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="w-full h-screen max-w-6xl mx-auto flex flex-col justify-center relative">
            <Outlet />
        </div>
    )
}