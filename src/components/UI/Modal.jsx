//IMPORTS - Hooks
import { useRef, useEffect } from "react"
import { createPortal } from "react-dom";
//IMPORTS - Components 
//IMPORTS - Styles
 import styles from "./Modal.module.css"

function Modal({children, open, handleClose}) {
  const dialog = useRef()

  useEffect(()=> {
    const modal = dialog.current

    if (open) {
        modal.showModal()
    }

    return () => {
    if (modal.open) modal.close();
  };

},[open])

    return createPortal (
        <dialog onClose={handleClose} ref={dialog} className={styles.dialog}> {children} </dialog>,
        document.getElementById('modal')
  )
}
export default Modal
