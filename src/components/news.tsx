import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge"


interface NewsProps {
    id: string
    title: string
    content: string
    category: string
    tags: string
    image: File
    created: string
}

export function News({ id, title, content, created, category, tags, image }: NewsProps) {
    const navigate = useNavigate()

    return (
        <div id={category} className="flex flex-col border rounded-xl w-full p-4 gap-2">
            <div className="w-full flex justify-between">
                <h1 className="font-bold text-lg">{title}</h1>
                <p className="text-sm font-mono text-muted-foreground">{created}</p>
            </div>
            <div className="flex gap-4 my-2">
                <img className="size-20 rounded-xl" src={image.name} alt="" />
                <p className="font-mono">
                    {content}
                </p>
            </div>
            <div className="w-full flex justify-between">
                <div className="flex gap-2">
                    <Badge variant="outline">{tags}</Badge>
                </div>
                <Button variant="link" onClick={() => navigate(`/noticia/${id}`)}>Continuar lendo...</Button>
            </div>
        </div>
    )
}