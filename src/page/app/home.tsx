import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { db } from "@/services/firebase-connection"
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface NewsProps {
    id: string
    title: string
    content: string
    category: string
    tags: string
    image: File
    created: Date
}

export function Home() {
    const navigate = useNavigate()
    const [news, setNews] = useState<NewsProps[]>([])

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

    return (
        <>
            <h1 className="font-bold text-xl">Noticias</h1>

            {news.map((item) => (
                <div key={item.id} id={item.category} className="my-10 border p-4 rounded-lg relative">
                    <div className="flex justify-between gap-4">
                        <img src={`${item.image}`} alt={item.title} width={100} height={100} className="size-20" />
                        <div className="w-full">
                            <h1 className="text-2xl font-bold">{item.title}</h1>
                            <p className="truncate w-11/12">{item.content}</p>
                            <Button
                                variant="link"
                                onClick={() => navigate(`/noticia/${item.id}`)}
                            >
                                Continuar lendo...
                            </Button>
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
        </>
    )
}