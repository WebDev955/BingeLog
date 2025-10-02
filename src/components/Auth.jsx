import { useState } from "react";
import {auth} from "../firebase/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";


function Auth(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    console.log("UserEmail", auth?.currentUser?.email)
    console.log("UserPass", auth?.currentUser?.password)
    
    
    const signIn = async () =>{
        try{
           await createUserWithEmailAndPassword(auth, email, password) 
        } catch (err){
            console.error(err)
        }
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