//IMPORTS - Hooks
//IMPORTS - Components
//IMPORTS - Styles
import styles from "./Input.module.css";

function Input({ label, id, htmlFor, ...props }) {
  return (
    <>
      <div className={styles.inputWrapper}>
        <label htmlFor={htmlFor}>{label}</label>
        <input id={id} {...props} />
      </div>
    </>
  );
}
export default Input;
