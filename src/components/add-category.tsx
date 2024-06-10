import { FormEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Cog, GripVertical, Trash } from "lucide-react";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, writeBatch } from "firebase/firestore";
import { db } from "@/services/firebase-connection";
import { ScrollArea } from "./ui/scroll-area";


interface CategoryProps {
    id: string
    category: string
    order: number
}

export function AddCategory() {
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<CategoryProps[]>([])

    useEffect(() => {
        const categoryRef = collection(db, "categories")
        const queryRef = query(categoryRef, orderBy("order", "asc"))

        const onsubCategory = onSnapshot(queryRef, (snapshot) => {
            const listCategory = [] as CategoryProps[]

            snapshot.forEach((doc) => {
                listCategory.push({
                    id: doc.id,
                    category: doc.data().category,
                    order: doc.data().order
                })
            })

            setCategories(listCategory)

        })

        return () => {
            onsubCategory()
        }
    }, [])

    async function getOrderValue() {
        const categoriesSnapshot = await getDocs(query(collection(db, "categories"), orderBy("order", "desc")))
        if (categoriesSnapshot.empty) {
            return 1;
        }

        const highestOrderDoc = categoriesSnapshot.docs[0];
        return highestOrderDoc.data().order + 1;
    }

    async function handleRegisterCategory(e: FormEvent) {
        e.preventDefault()

        const orderValue = await getOrderValue();

        addDoc(collection(db, "categories"), {
            category: category,
            created: new Date(),
            order: orderValue
        }).then(() => {
            setCategory("")
            console.log("Categoria registrada com sucesso");
        }).catch(() => {
            alert("Erro ao registrar categoria: ");
        });
    }

    async function handleDeleteCategory(id: string) {
        const categoryDocRef = doc(db, "categories", id)

        try {
            await deleteDoc(categoryDocRef)

            const categoriesQuery = query(collection(db, "categories"), orderBy("order"))
            const categoriesSnapshot = await getDocs(categoriesQuery)

            let newOrder = 1
            const batch = writeBatch(db);
            categoriesSnapshot.forEach((doc) => {
                batch.update(doc.ref, { order: newOrder })
                newOrder++;
            })

            await batch.commit()

            console.log("Categoria deletada e ordem ajustada com sucesso");
        } catch (error) {
            console.error("Erro ao deletar categoria", error)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    <Cog className="size-4 mr-2" /> Categorias
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicione uma nova categoria!</DialogTitle>
                    <DialogDescription className="p-4">
                        <form className="flex items-center gap-4" onSubmit={handleRegisterCategory}>
                            <div className="w-full">
                                <Input
                                    placeholder="Digite a categoria"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="">
                                <Button variant="secondary" type="submit">Adicionar</Button>
                            </div>
                        </form>

                        <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-4">
                            <div className="border-b flex gap-4">
                                <p>Mover</p>
                                <p className="flex-1">Categoria</p>
                                <p className="text-center">Deletar</p>
                            </div>
                            {categories.map((item) => (
                                <div key={item.id} className="border-b flex p-4 gap-4">
                                    <GripVertical className="cursor-move -ml-2" />
                                    <p className="flex-1 ml-2">{item.category}</p>
                                    <Trash
                                        onClick={() => handleDeleteCategory(item.id)}
                                        className="size-4 cursor-pointer text-red-500 hover:scale-110"
                                    />
                                </div>
                            ))}
                        </ScrollArea>

                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}