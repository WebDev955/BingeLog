//IMPORTS - Hooks
//IMPORTS - Components 
//IMPORTS - Styles
    //import styles from FILE LOCATION

function Input({label, id, attribute, ...props }) {
  return (
    <>  
        <label htmlFor={attribute}>{label}</label>
        <input
            id = {id}
            {...props}
        />
    </>
  )
}
export default Input
