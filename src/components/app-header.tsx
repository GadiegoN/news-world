import { Logo } from "@/assets/logo";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { db } from "@/services/firebase-connection";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CategoryProps {
    id: string
    category: string
    order: number
}

export function AppHeader() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<CategoryProps[]>([])

    useEffect(() => {
        const categoryRef = collection(db, "categories")
        const queryRef = query(categoryRef, orderBy("order", "asc"))

        const onsub = onSnapshot(queryRef, (snapshot) => {
            const list = [] as CategoryProps[]

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    category: doc.data().category,
                    order: doc.data().order
                })
            })

            setCategories(list)
        })

        return () => {
            onsub()
        }
    }, [])

    return (
        <div className="w-full max-w-6xl flex justify-between mx-auto p-6">
            <Logo />
            <div className="flex items-center gap-2">
                {categories.map((item) => (
                    <Button variant="link" asChild key={item.id}><a href={`#${item.category.toLowerCase()}`}>{item.category}</a></Button>
                ))}
                <Button variant="link" onClick={() => navigate('/painel-admin')}>Entrar</Button>
                <ModeToggle />
            </div>
        </div>
    )
}