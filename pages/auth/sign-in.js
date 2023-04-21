import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Head from "next/head";

function Error({ error }) {

    function display(message) {
        return (
            <div className="d-flex flex-row align-items-center text-danger mb-3">
                <FontAwesomeIcon icon={faTriangleExclamation}/>
                <p className="ms-2 mb-0">{message}</p>
            </div>
        );
    }

    if (!error) {
        return <></>;
    }
    if (error === 'OAuthSignin') {
        return display("Error in constructing an authorization URL.");
    }
    if (error === 'OAuthCallback') {
        return display("Error in handling the response (1, 2, 3) from an OAuth provider.");
    }
    if (error === 'OAuthCreateAccount') {
        return display("Could not create OAuth provider user in the database.");
    }
    if (error === 'EmailCreateAccount') {
        return display("Could not create email provider user in the database.");
    }
    if (error === 'Callback') {
        return display("Error in the OAuth callback handler route.");
    }
    if (error === 'OAuthAccountNotLinked') {
        return display("If the email on the account is already linked, but not with this OAuth account");
    }
    if (error === 'EmailSignin') {
        return display("Sending the e-mail with the verification token failed.");
    }
    if (error === 'CredentialsSignin') {
        return display("Wrong credentials!");
    }
    if (error === 'SessionRequired') {
        return display("The content of this page requires you to be signed in at all times. See useSession for configuration");
    }
    if (error === 'Default') {
        return display("Catch all, will apply, if none of the above matched.");
    }
}

export default function SingIn() {
    const params = useSearchParams();
    const email = useRef();
    const password = useRef();
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(params.toString())
        if (params.has('error')) {
            setError(params.get('error'));
        }
    }, [params]);

    function handleSubmit(e) {
        e.preventDefault();
        e.target.classList.add('was-validated');
        if (!e.target.checkValidity()) {
            e.stopPropagation();
            return;
        }
        signIn('credentials', {
            email: email.current.value,
            password: password.current.value,
            callbackUrl: params.has('callbackUrl') ? params.get('callbackUrl') : '/library/all',
            redirect: true
        }).then(r => console.debug("Logged in!"));
    }

    return (
        <>
            <div className="mt-3 mt-lg-0 col-12 col-md-9 col-lg-6 col-xl-6">
                <Image src="/login.svg" alt="Login image" className="img-fluid w-100 h-auto" width={0} height={0}/>
            </div>
            <div className="mt-3 mt-lg-0 col-12 col-md-9 col-lg-6 col-xl-5 offset-xl-1">
                <form onSubmit={handleSubmit} noValidate={true}>
                    <Error error={error}/>
                    <div className="form-floating mb-2">
                        <input type="email" id="email" className="form-control form-control-lg"
                               required={true} autoComplete="username" ref={email}/>
                        <label htmlFor="email">Email address</label>
                        <div className="invalid-feedback">Please insert a valid email.</div>
                    </div>
                    <div className="form-floating mb-2">
                        <input type="password" id="password" className="form-control form-control-lg"
                               placeholder="Password" minLength={8} required={true} autoComplete="current-password"
                               ref={password}/>
                        <label htmlFor="password">Password</label>
                        <div className="invalid-feedback">Please insert a valid password.</div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember"
                                   defaultChecked={true}/>
                            <label className="form-check-label" htmlFor="remember">Remember me</label>
                        </div>
                        {/*<Link to="" className="small">Forgot password?</Link>*/}
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg btn-block w-100">Sign in</button>
                    <div className="d-flex align-items-center my-4">
                        <hr className="border flex-grow-1"/>
                        <p className="fw-bold mx-3 mb-0">OR</p>
                        <hr className="border flex-grow-1"/>
                    </div>
                    <div className="d-flex justify-content-around align-items-center">
                        <button type="button" className="btn btn-social" style={{ color: "#dd4b39" }}>
                            <FontAwesomeIcon icon={faGoogle}/>
                        </button>
                        <button type="button" className="btn btn-social" style={{ color: "#3B5998" }}>
                            <FontAwesomeIcon icon={faFacebook}/>
                        </button>
                        <button type="button" className="btn btn-social" style={{ color: "#55ACEE" }}>
                            <FontAwesomeIcon icon={faTwitter}/>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

SingIn.getLayout = function getLayout(Component, pageProps) {
    return (
        <>
            <Head>
                <title>Sing in</title>
            </Head>
            <main className="vh-100 container d-flex flex-column flex-lg-row align-items-center justify-content-center">
                <Component {...pageProps}/>
            </main>
        </>
    );
}
