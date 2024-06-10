import { AdminHeader } from "@/components/admin-header";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
    return (
        <div>
            <AdminHeader />

            <div className="w-full max-w-6xl mx-auto">
                <Outlet />
            </div>
        </div>
    )
}