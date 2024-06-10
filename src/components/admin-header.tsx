import { Logo } from "@/assets/logo";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase-connection";
import { LogOut } from "lucide-react";

export function AdminHeader() {
    const navigate = useNavigate()
    const [page, setPage] = useState('painel-admin')

    function selectedPage(newPage: string) {
        setPage(newPage)
        navigate(newPage)
    }

    async function handleLogout() {
        await signOut(auth)
    }

    return (
        <div className="w-full max-w-6xl flex justify-between mx-auto p-6">
            <Logo />

            <nav className="flex gap-2 items-center">
                <Button variant={page === "painel-admin" ? "default" : "outline"} onClick={() => selectedPage('painel-admin')}>Painel</Button>
                <Button variant={page === "painel-admin/add" ? "default" : "outline"} onClick={() => selectedPage('painel-admin/add')}>Add Noticia</Button>
                <Button variant="outline" onClick={handleLogout}>Sair <LogOut className="size-4 ml-2" /></Button>
                <ModeToggle />
            </nav>
        </div>
    )
}