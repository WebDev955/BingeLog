//IMPORTS - Hooks
//IMPORTS - Components
import Input from "./Input";
import Bttn from "./Bttn";
//IMPORTS - Styles
import styles from "./SignUpForm.module.css";

function SignUpForm({ type, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className={styles.formWrapper}>
      <div className={styles.inputWrapper}>
        <Input
          label="User Name"
          htmlFor="username"
          id="username"
          name="username"
          placeholder="Typer user name here."
        />
        <Input
          label="Email"
          htmlFor="email"
          id="email"
          name="email"
          placeholder="Typer email here."
        />
        <Input
          label="Password"
          htmlFor="password"
          id="password"
          name="password"
          placeholder="Typer passowrd here."
        />
        <Bttn className={styles.signUpBttn} type={type}>
          Sign Up
        </Bttn>
      </div>
    </form>
  );
}
export default SignUpForm;
