import React, {useEffect, useState} from "react";
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

    const { mutate: doLogin, isPending: isLoginPending, isError: isLoginError, error: loginError, isSuccess: isLoginSuccess } = useLogin();
    const { mutate: doRegister, isPending: isRegisterPending, isError: isRegisterError, error: registerError, isSuccess: isRegisterSuccess } = useRegister();

    const getErrorMessage = (error) => {
        if (!error) return "";
        if (error?.response?.data) {
            const data = error.response.data;
            return (
                data.non_field_errors?.[0] ||
                data.email?.[0] ||
                data.username?.[0] ||
                data.password?.[0] ||
                Object.values(data)[0]?.[0] ||
                "Unknown error"
            );
        }
        return error?.message || "Network error";
    };

    useEffect(() => {
        if (isLoginSuccess) {
            setEmail("");
            setPassword("");
        }
    }, [isLoginSuccess]);

    useEffect(() => {
        if (isRegisterSuccess) {
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }
    }, [isRegisterSuccess]);

    const loginErrorMsg = isLoginError ? getErrorMessage(loginError) : "";
    const registerErrorMsg = isRegisterError ? getErrorMessage(registerError) : "";

    const onSubmitLogin = (e) => {
        e.preventDefault();
        doLogin({email, password});
    }

    const onSubmitRegister = (e) => {
        e.preventDefault();
        doRegister({username, email, password, confirmPassword});
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

            <div className={`${styles.loginForm} ${isRegistered ? styles.visible : styles.hidden}`}>
            <h1>Or sign in with</h1>                   
                <form onSubmit={onSubmitLogin}> 
                    <div className={styles.inputBox}>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className={styles.input} />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className={styles.input} />
                    </div>
                    <LoginBtn disabled={isLoginPending}>Sign in</LoginBtn>
                    {loginErrorMsg && <div style={{color: "red", fontSize:"1.5rem"}}>{loginErrorMsg}</div>}
                </form>
                <NotRegisteredYetBtn onClick={() => {setIsRegistered(!isRegistered)}}>Not registered yet?</NotRegisteredYetBtn>
            </div>

            <div className={`${styles.signupForm} ${!isRegistered ? styles.visible : styles.hidden}`}>
                <h1>Or sign up with</h1>
                <form onSubmit={onSubmitRegister}> 
                    <div className={styles.inputBox}>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className={styles.input} />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className={styles.input} />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className={styles.input} />
                        <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" type="password" className={styles.input} />
                    </div>                    
                    <LoginBtn disabled={isRegisterPending}>Sign up</LoginBtn>
                    {registerErrorMsg && <div style={{color: "red", fontSize:"1.5rem"}}>{registerErrorMsg}</div>}
                </form>
                <NotRegisteredYetBtn onClick={() => {setIsRegistered(!isRegistered)}}>Already have an account?</NotRegisteredYetBtn>
            </div>
        </div>
    )
}

export default SignForm;
