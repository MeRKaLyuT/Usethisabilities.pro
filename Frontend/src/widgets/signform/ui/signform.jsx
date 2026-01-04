import React, {useState} from "react";
import { useLogin } from "../../../features/auth/hooks/useLogin.js";
import { useRegister } from "../../../features/auth/hooks/useRegister.js";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { LoginBtn } from "../../../shared/ui/loginBtn/index.jsx";
import { NotRegisteredYetBtn } from "../../../shared/ui/notRegisteredYetBtn/index.jsx";

import * as styles from './signform.module.css';


const SignForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);    

    const { mutate: doLogin, isPending: isLoginPending, isError: isLoginError} = useLogin();
    const { mutate: doRegister, isPending: isRegisterPending, isError: isRegisterError} = useRegister();

    const onSubmitLogin = (e) => {
        e.preventDefault();
        doLogin({email, password});
        setEmail("");
        setPassword("");
    }
    const onSubmitRegister = (e) => {
        e.preventDefault();
        doRegister({username, email, password, confirmPassword});
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <div className={styles.main}>

            <div className={styles.login}>
                {isRegistered ? <h1>Sign in</h1> : <h1>Sign up</h1>}
                <p style={{opacity: "85%"}}>We are glad to see you!</p>
            </div>
            <div className={styles.otherappslogin}>
                <h1>You can use this</h1>
                <div>
                    <GitHubIcon sx={{fontSize: 40}} />
                    <GoogleIcon sx={{fontSize: 40}} />
                </div>
            </div>

            {isRegistered ? (
            <div className={styles.loginForm}>
            <h1>Or sign in with</h1>                   
                <form onSubmit={onSubmitLogin}> 
                    <div className={styles.inputBox}>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className={styles.input} />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className={styles.input} />
                    </div>
                    <LoginBtn disabled={isLoginPending}>Sign in</LoginBtn>
                    {isLoginError && <div>Login error</div>}
                </form>
                <NotRegisteredYetBtn onClick={() => {setIsRegistered(!isRegistered)}}>Not registered yet?</NotRegisteredYetBtn>
            </div>

            ) : (

            <div className={styles.signup}>
                <h1>Or sign up with</h1>
                <form onSubmit={onSubmitRegister}> 
                    <div className={styles.inputBox}>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className={styles.input} />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className={styles.input} />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className={styles.input} />
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" type="password" className={styles.input} />
                    </div>                    
                    <LoginBtn disabled={isRegisterPending}>Sign in</LoginBtn>
                    {isRegisterError && <div>Login error</div>}
                </form>
                <NotRegisteredYetBtn onClick={() => {setIsRegistered(!isRegistered)}}>Already have an account?</NotRegisteredYetBtn>
            </div>
            )}
        </div>
    )
}

export default SignForm;