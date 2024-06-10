import { Badge } from "@/components/ui/badge"
import { db } from "@/services/firebase-connection"
import { Timestamp, doc, getDoc } from "firebase/firestore"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface NewsProps {
    id: string
    title: string
    content: string
    category: string
    tags: string
    image: File
    created: Date
}

export function New() {
    const { id } = useParams<{ id: string }>()
    const [getNew, setGetNew] = useState<NewsProps | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadNew() {
            if (id) {
                const docRef = doc(db, "news", id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const createdTimestamp = data.created as Timestamp;
                    const newData: NewsProps = {
                        id: docSnap.id,
                        title: data.title,
                        content: data.content,
                        category: data.category,
                        tags: data.tags,
                        image: data.image,
                        created: createdTimestamp.toDate(),
                    };
                    setGetNew(newData);
                }
            }
        }

        loadNew()
    }, [id])

    return (
        <>
            <div className="h-16 flex flex-col justify-center relative">
                <ArrowLeft className="cursor-pointer hover:scale-110 absolute" onClick={() => navigate('/')} size={32} />
                <h1 className="font-bold text-3xl text-center truncate">{getNew?.title}</h1>
            </div>

            <div className="w-full p-4 max-h-96 rounded-lg flex justify-center">
                <img src={`${getNew?.image}`} alt={getNew?.title} className="w-full h-30 object-cover" />
            </div>

            <p>{getNew?.content}</p>

            <div className="w-full flex justify-between items-center mt-3">
                <div className="flex gap-4">
                    {getNew?.tags.split(',').map((tag) => (
                        <Badge variant="secondary">{tag}</Badge>
                    ))}
                </div>
                <p>{getNew?.created.toLocaleString()}</p>
            </div>
        </>
    )
}