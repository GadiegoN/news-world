import { FormEvent, useEffect, useState } from "react";

import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, storage } from "@/services/firebase-connection";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface CategoryProps {
    id: string
    category: string
}

export function AddNew() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [categories, setCategories] = useState<CategoryProps[]>([])

    function cleanFields() {
        setTitle('')
        setContent('')
        setCategory('')
        setTags('')
        setImage(Object)
    }

    function handleNewsRegister(e: FormEvent) {
        e.preventDefault()

        if (!image) {
            alert("Por favor, selecione uma imagem.");
            return;
        }

        const storageRef = ref(storage, `news_images/${image.name}`);

        uploadBytes(storageRef, image)
            .then(snapshot => {
                return getDownloadURL(snapshot.ref);
            })
            .then(downloadURL => {
                return addDoc(collection(db, "news"), {
                    title: title,
                    content: content,
                    category: category,
                    tags: tags,
                    image: downloadURL,
                    created: new Date()
                });
            })
            .then(() => {
                cleanFields();
                alert("Notícia adicionada com sucesso!");
            })
            .catch(error => {
                alert("Erro ao adicionar notícia.");
                console.error(error);
            });
    }

    useEffect(() => {
        const categoryRef = collection(db, "categories")
        const queryRef = query(categoryRef, orderBy("order", "asc"))

        const onsubCategory = onSnapshot(queryRef, (snapshot) => {
            const listCategory = [] as CategoryProps[]

            snapshot.forEach((doc) => {
                listCategory.push({
                    id: doc.id,
                    category: doc.data().category,
                })
            })

            setCategories(listCategory)

        })

        return () => {
            onsubCategory()
        }
    }, [])

    return (
        <div>
            <h2>Adicionar nova noticia</h2>

            <form onSubmit={handleNewsRegister}>
                <div className="mb-4">
                    <Label>Título</Label>
                    <Input
                        placeholder="Titulo da noticia"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Label>Conteúdo</Label>
                    <Textarea
                        placeholder="Conteúdo da noticia"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <Label>Categoria</Label>
                    <Select onValueChange={(value) => setCategory(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent aria-required>
                            <SelectItem value="-1">Sem categoria</SelectItem>
                            {categories.map((item) => (
                                <SelectItem key={item.id} value={item.category}>{item.category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <Label>Tags</Label>
                    <Input
                        placeholder="Tags da noticia"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        required
                    />
                    <p>Separe as tags por virgula (,)</p>
                </div>
                <div className="mb-4">
                    <Label>Imagem de destaque</Label>
                    <Input
                        type="file"
                        onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    />
                </div>
                <div className="mb-4">
                    <Button type="submit">Adicionar noticia</Button>
                </div>
            </form>
        </div>
    )
}