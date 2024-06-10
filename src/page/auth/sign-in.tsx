import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "@/services/firebase-connection";
import { signInWithEmailAndPassword } from "firebase/auth";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignIn() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleSignIn(e: FormEvent) {
        e.preventDefault()

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/painel-admin')
            })
            .catch((err) => {
                alert("Email ou senha incorreto")
                console.log(err)
            })
    }

    return (
        <>
            <div className="absolute top-6 right-10">
                <ModeToggle />
            </div>
            <h1 className="text-center font-bold text-2xl">Bem vindo(a)!</h1>
            <p className="text-lg text-muted-foreground text-center">Entre com seu email e senha.</p>

            <form className="shadow-xl flex flex-col gap-2 w-full max-w-lg mx-auto px-4 py-6 mt-4 bg-muted rounded-lg" onSubmit={handleSignIn}>
                <Label className="mt-4">Email</Label>
                <Input
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Label className="mt-4">Senha</Label>
                <Input
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                />

                <Button type="submit" className="mt-6">Entrar</Button>
            </form>
        </>
    )
}