import { AppHeader } from "@/components/app-header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    return (
        <div>
            <AppHeader />

            <div className="w-full max-w-6xl mx-auto">
                <Outlet />
            </div>
        </div>
    )
}