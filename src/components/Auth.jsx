import { useState } from "react";
import {auth} from "../firebase/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";


function Auth(){
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    console.log(auth?.currentUser?.email)
    
    const signIn = async () =>{
        await createUserWithEmailAndPassword(auth, email, password)
    };

    const signOut = async () => {
        try{
            await signOut(auth) 
        } catch (err) {
            console.error(err)
        }
    };

    return (
            <div>
                <input 
                    placeholder="Email..." 
                    onChange = {(e) => setEmail(e.target.value)}
                />

                <input 
                    placeholder="Password..."
                    onChange = {(e) => setPassword(e.target.value)}
                    
                    />
                <button onClick = {signIn}>Sign In</button>
                <button onClick = {signOut}>SignOut</button>
            </div>
    );

}


export default Auth