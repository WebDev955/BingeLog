import axios from "axios";
import { doc, db, updateDoc } from "../../firebase/firebase"
import { useState } from "react"
import {useDispatch, useSelector} from "react-redux"
import { profileActions } from "../../store/slices/profileSlice";


function FileUploader() {
    //uploadStatus 'idle' 'uploading', 'success', 'error' 
    const [file, setFile] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [status, setStatus] = useState("idle");
    const [uploadProgress, setUploadProgress] = useState (0);

    
    const dispatch = useDispatch();
    //const profileImgUrl = useSelector((state) => state.profile.profileImgUrl)
    const uid =  useSelector((state) => state.auth.user.uid);

    //checks first to see if file selcted is there, if so, add it to setFile
    function handleFileChange (e) {
        if (e.target.files) {
            setFile(e.target.files[0])
        }

    }

    async function handleFileUpload() {
        if(!file) return;

        setStatus("Uploading")
        
        const formData = new FormData();//object
        formData.append('file', file) //append files to formData 
        formData.append("upload_preset", "ehljsu8d")
        
        axios.post("https://api.cloudinary.com/v1_1/duvpgswi7/image/upload", formData)
            .then((response) => {
    
            const uploadedImage = response.data.secure_url
            const docRef = doc(db, "Users", uid);
            
            updateDoc(docRef, {
                    profileImgUrl: uploadedImage
                });

                dispatch(profileActions.uploadAvatar(uploadedImage))
                alert("Image uploaded!") 
        });
    
};

    return(
        <>
            {/*onChange grabs the file upload, runs function to upload file
              creates a Object of the file selected with
            */}
            <input 
                type="file" 
                onChange={handleFileChange}
            /> 
            <div>
                {file && (
                    <div>
                        <p>File Name: {file.name}</p>
                        <p>Size: {(file.size/1024).toFixed(2)} KB</p>
                        <p>Type: {file.type}</p>
                    </div>
                )}
                {status === 'uploading' && (
                    <div className="space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div
                        className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
                    </div>
                )}
                  {file && status !== 'uploading' && (
                    <button onClick={handleFileUpload}>Upload</button>
                )}

                {status === 'error' && (
                    <p>Upload Failed</p>
                )}
                {status === 'success' && (
                    <p>File uploaded successfully </p>
                )}
                <p>{status}</p>
            </div>
        </>
    )
}



export default FileUploader
