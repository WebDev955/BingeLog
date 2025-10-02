import { useState } from "react";
import {auth} from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";


function Auth(){
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const signIn = async () =>{
        await createUserWithEmailAndPassword(auth, email, password)
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
                <button>Sign In</button>
            </div>
    );

}


export default Auth