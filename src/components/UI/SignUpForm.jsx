//IMPORTS - Hooks
//IMPORTS - Components
import Input from "./Input";
import Bttn from "./Bttn";
//IMPORTS - Styles
import styles from "./SignUpForm.module.css";

function SignUpForm({ type, onSubmit, disabled, errors}) {
  return (
    <form onSubmit={onSubmit} className={styles.formWrapper}>
      <div className={styles.inputWrapper}>
      <div className={styles.errors}>{errors.form}</div>
        <Input
          label="User Name"
          htmlFor="username"
          id="username"
          name="username"
          placeholder="Type user name here."
        />
          <div className={styles.errors}>{errors.userName}</div>
        <Input
          label="Email"
          htmlFor="email"
          id="email"
          name="email"
          placeholder="Type email here."
        />
          <div className={styles.errors}>{errors.email}</div>
        <Input
          label="Password"
          htmlFor="password"
          id="password"
          name="password"
          placeholder="Type password here."
        />
          <div className={styles.errors}>{errors.password}</div>
        <Input
          label="Confirm Password"
          htmlFor="confirmpassword"
          id="confirmpassword"
          name="confirmpassword"
          placeholder="Confirm password."
        />
          <div className={styles.errors}>{errors.passwordMatch}</div>
        <Bttn className={styles.authBttn} type={type} disabled={disabled}>
          Sign Up
        </Bttn>
      </div>
    </form>
  );
}
export default SignUpForm;
