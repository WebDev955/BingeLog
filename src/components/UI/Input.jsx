//IMPORTS - Hooks
//IMPORTS - Components 
//IMPORTS - Styles
import styles from "./Input.module.css"

function Input({label, id, attribute, ...props }) {
  return (
    <>  
    <div className={styles.inputWrapper}>
        <label htmlFor={attribute}>{label}</label>
        <input
            id = {id}
            {...props}
        />
      </div>
    </>
  )
}
export default Input
