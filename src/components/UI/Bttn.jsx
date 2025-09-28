//IMPORTS - Hooks
//IMPORTS - Components 
//IMPORTS - Styles
    //import styles from 

function Bttn({children, ...props}) {
  return (
    <>
        <button {...props}>{children}</button>
    </>
  )
}
export default Bttn