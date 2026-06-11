//Imports - Hooks
import {useState} from "react"
//Imports - Hooks
import styles from "./CommentChats.module.css"
//IMPORTS - SLICES
import { useSelector } from "react-redux"

//Status.statusId is prop 
	//passed from ActionBar (which was passed from FeedCard)

export const ReplyComment = ({statusId, commentId}) => {
	const userName = useSelector((state) => state.auth.user.userName)
	const userId = useSelector((state) => state.auth.user.uid)
	const userImg = useSelector((state) => state.profile.profileImgUrl)

	const [replyDraft, setReplyDraft] = useState("Reply to User B's comment")
	
	const updateReply = (value) => {
		setReplyDraft ((prev) => 
			value
		)
	}
	async function postReply (replyDraft) {
		const newReply = {
			replyId: crypto.random.UUID(),
			authorId: userId,
            authorUserName: userName,
            authorImg: userImg,
			timeStamp: new Date().getTime(),
			text: replyDraft,
		}
		
		//try {
			//const docRefChatThread = collection(db, "chatComments”)
				//await addDoc()
		//}catch{
			//{error.catch}
		//}
	}
	
	return (
		<main className = {styles.commentChatChainWrapper}>
			<h3>Post a Reply</h3>
				<div className = {styles.commentChatChains}>
					<div className = {styles.comment}>
						<textarea
							value = {replyDraft}
							onChange = {(e) => updateReply(e.target.value)}
						/>
						<button onClick = {()=> postReply(replyDraft)}>
							Post Reply
						</button>
					</div>
				</div>
		</main>	
	)
}

export default ReplyComment