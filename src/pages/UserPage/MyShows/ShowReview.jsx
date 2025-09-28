//IMPORTS
import Modal from "../../../components/UI/Modal"

//Import - REDUX
import { showActions } from "../../../store/slices/showsSlice"
import { useSelector } from "react-redux"



function ShowReview({show}){
const openModal = useSelector((state) => state.shows.isReviewing)
const closeModal = useSelector((state) => state.shows.isReviewing)


    return(
        <>
        <Modal open = {openModal} onClose={closeModal}>
            <textarea
               defaultValue={show.title}
            />
        </Modal>
        
        </>
    )
}

export default ShowReview