import { useState } from 'react';
import { useMutation } from '@tanstack/react-query'
import { signin } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/userSlice'

export default function Signin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const mutation = useMutation({
        mutationFn: signin,
        onSuccess: (data) => {
            console.log(data);
            dispatch(login(data))
        }, onError: (error) => {
            console.log(error);

        }
    })

    const handleSignin = () => {
        mutation.mutate({ username, password })
    }

    return (
        <>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
            />
            <button onClick={handleSignin}>Se connecter</button>

        </>)
}