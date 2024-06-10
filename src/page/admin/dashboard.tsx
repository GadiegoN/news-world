import { useEffect, useState } from "react"
import { db } from "@/services/firebase-connection"
import { collection, query, orderBy, onSnapshot, Timestamp, doc, deleteDoc } from "firebase/firestore"
import { AddCategory } from "@/components/add-category"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash } from "lucide-react"

interface NewsProps {
    id: string
    title: string
    content: string
    category: string
    tags: string
    image: File
    created: Date
}

interface CategoryProps {
    id: string
    category: string
    order: number
}

export function Dashboard() {
    const [news, setNews] = useState<NewsProps[]>([])
    const [categories, setCategories] = useState<CategoryProps[]>([])

    useEffect(() => {
        const newsRef = collection(db, "news")
        const queryRef = query(newsRef, orderBy("created", "asc"))

        const unsub = onSnapshot(queryRef, (snapshot) => {
            const list = [] as NewsProps[]

            snapshot.forEach((doc) => {
                const data = doc.data();
                const createdTimestamp = data.created as Timestamp;
                list.push({
                    id: doc.id,
                    title: doc.data().title,
                    content: doc.data().content,
                    category: doc.data().category,
                    tags: doc.data().tags,
                    image: doc.data().image,
                    created: createdTimestamp.toDate(),
                })
            })

            setNews(list)
        })

        return () => {
            unsub()
        }
    }, [])

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

    async function handleDeleteNews(id: string) {
        const docRef = doc(db, "news", id)

        await deleteDoc(docRef)
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div>
                <div className="w-full flex gap-4 items-center">
                    {categories.map((data) => (
                        <Button variant="outline" id={data.id.toLowerCase()}><a href={`#${data.category.toLowerCase()}`}>{data.category}</a></Button>
                    ))}
                    <AddCategory />
                </div>

            </div>

            {news.map((item) => (
                <div key={item.id} id={item.category} className="my-10 border p-4 rounded-lg relative">
                    <Trash className="absolute right-2 top-2 text-red-500 cursor-pointer hover:scale-110" onClick={() => handleDeleteNews(item.id)} />
                    <div className="flex justify-between gap-4">
                        <img src={`${item.image}`} alt={item.title} width={100} height={100} className="size-20" />
                        <div className="w-full">
                            <h1 className="text-2xl font-bold">{item.title}</h1>
                            <p className="truncate w-11/12">{item.content}</p>
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center mt-3">
                        <div className="flex gap-4">
                            {item.tags.split(',').map((tag) => (
                                <Badge variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                        <p>{item.created.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}