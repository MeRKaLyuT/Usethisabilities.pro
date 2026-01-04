import React, {useState} from "react";
import { useLogin } from "../../../features/auth/hooks/useLogin.js";
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { LoginBtn } from "../../../shared/ui/loginBtn/index.jsx";

import * as styles from './signform.module.css';


const SignForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(false);

    const { mutate: doLogin, isPending: isLoginPending, isError, error, data } = useLogin();

    const onSubmit = (e) => {
        e.preventDefault();
        doLogin({email, password});
        setEmail("");
        setPassword("");
    }

    return (
        <div className={styles.main}>
            <div className={styles.login}>
                <h1>Sign in</h1>
                <p style={{opacity: "85%"}}>We are glad to see you!</p>
            </div>
            <div className={styles.otherappslogin}>
                <h1>You can use this</h1>
                <div>
                    <GitHubIcon sx={{fontSize: 40}} />
                    <GoogleIcon sx={{fontSize: 40}} />
                </div>
                
            </div>

            <div className={styles.loginForm}>
                <div>
                    <h1>Or sign in with</h1>
                </div>                    
                <div>
                    <form onSubmit={onSubmit}> 
                        <div className={styles.inputBox}>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className={styles.input1} />
                            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className={styles.input2} />
                        </div>
                        <div>
                            <LoginBtn disabled={isLoginPending}>Sign in</LoginBtn>
                        </div>
                        {isError && <div>Login error</div>}
                    </form>
                </div>
            </div>
            {/* <div className={styles.signupForm}>

            </div> */}
        </div>
    )
}

export default SignForm;