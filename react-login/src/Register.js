import React, { useState, useEffect } from "react";
// import { Routes, Route, useNavigate, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from "react-router-dom";
import { gapi } from 'gapi-script';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';


function RegisterForm() {
    debugger;
    // const navigate = useNavigate();
    const [Name, setName] = useState('');
    const [Username, setUserName] = useState('Imran123');
    const [email, setEmail] = useState('');
    const [Contact, setContact] = useState('');
    const [Password, setPassword] = useState('');
    const [C_Password, setc_Password] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const RegisterFormSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        if (Password !== C_Password) {
            setError('Passwords do not match');
            return;
        }       
        try {
            debugger;
            axios.post('http://127.0.0.1:5000/register',{Name,email,Contact,Username,Password,C_Password})
                .then(response => {
                    debugger;
                    sessionStorage.setItem("Name", response.data.Name);
                    sessionStorage.setItem("Username", response.data.Username);
                    sessionStorage.setItem("Password", response.data.Password);
                    sessionStorage.setItem("email", response.data.email);
                    sessionStorage.setItem("C_Password", response.data.C_Password);
                    sessionStorage.setItem("Contact", response.data.Contact);
                    sessionStorage.setItem('access_token', response.data.access_token);
                    Swal.fire(
                        'Good job!',
                        'Register Successful Please login',
                        'success'
                    );
                    window.location.replace("/");
                })
                .catch(error => {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: error.response.data.message,
                        timer: 5000,
        
                    })
                    //alert(error.response)

                }).finally(error => {
                    //alert(error.response)
                });
        }
        catch (err) {
            console.log(error);
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: error.response.data.message,
                timer: 5000,

            })
        }


    }
    //#region google login
    const [profile, setProfile] = useState([]);
    const clientId = '386932037035-k8v833noqjk7m4auae0t83vnkrqvvg3t.apps.googleusercontent.com';
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });

    const onSuccess = (res) => {
        setProfile(res.profileObj);

        axios.post("http://127.0.0.1:5000/Google_Register", {
            Name: res.profileObj.name,
            email: res.profileObj.email,
            Contact: '',
            Username: res.profileObj.givenName,
            Password: '',
            C_Password: '',

        }, {
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            Swal.fire({
                type: 'success',
                title: 'Good job !Login Successfully',
                timer: 2000,

            })
            sessionStorage.setItem('email', email);
            window.location.replace("/Home");
            //history.push("/Home");

        }).catch(error => {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: error.response.data.message,
                timer: 5000,

            })
        });



        // Swal.fire({
        //     type: 'success',
        //     title: 'Good job !Login Successfully',
        // })
        // setTimeout(function () {
        //     window.location.replace("/Home");
        // }, 2000);
    };

    //Function to handle the login form submission


    const onFailure = (err) => {
        console.log('failed', err);
        window.location.replace("/learningLogin");
    };

    const logOut = () => {
        //setProfile(null);
    };

    //#region linkdin login start here

    // const LinkedInPage=()=> {
    //     debugger;
    console.log(window.location.origin);
    const { linkedInLogin } = useLinkedIn({
        clientId: '86vhj2q7ukf83q',
        redirectUri: `${window.location.origin}/linkedin`, // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
        onSuccess: (code) => {
            console.log(code);
        },
        scope: "r_emailaddress r_liteprofile",
        onError: (error) => {
            console.log(error);
        },
    });




    //#endregion linkdin login end here

    return (
        // # start
        <div className="container-fluid">
            <div className="row header">
                <div className="col-md-1">

                </div>
                <div className="col-md-11 me-0">
                    {< img alt="" className="rounded float-start" src={require('../src/images/kaas_logo.png')} />}
                    {< img alt="" className="rounded float-end" src={require('../src/images/upper graphic log in.png')} />}
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-11 me-0">
                    {/* <h4 className="text-left fs-6">Welcome back</h4> */}
                    <h2 className="card-title text-left fs-3">Sign Up</h2><br />
                </div>
            </div>
            <form onSubmit={RegisterForm}>

                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-3">
                        <div className="mb-0">
                            {/* <label>Name</label> */}
                            <input
                                type="text"
                                placeholder="Type Your Name"
                                className="form-control mt-3"
                                name="Name"
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-0">
                            {/* <label>Email address</label> */}
                            <input
                                type="email"
                                placeholder="Type Your Email"
                                className="form-control mt-3"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-0">
                            {/* <label>Contact</label> */}
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                className="form-control mt-3"
                                name="contact"
                                value={Contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </div>
                        <div className="mb-0">
                            {/* <label>User Name</label> */}
                            <input
                                type="password"
                                placeholder="Password"
                                className="form-control mt-3"
                                name="password"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-0">
                            {/* <label>User Name</label> */}
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="form-control mt-3"
                                name="C_password"
                                value={C_Password}
                                onChange={(e) => setc_Password(e.target.value)}
                            />
                        </div>
                        {/* <div className="mb-0">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control mt-3"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div> */}
                        {/* <div className="mb-0">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control mt-3"
                                name="c_password"
                                value={c_password}
                                onChange={(e) => setc_Password(e.target.value)}
                            /> */}
                        <br />
                        <button type="submit" className="btn btn-danger form-control mb-2" width="100%" name="Register" onClick={RegisterFormSubmit} id="btnRegister">
                            Sign Up
                        </button>
                        <br />
                        {/* <button type="" className="btn btn-danger form-control mb-2" width="100%" name="RegisterTest" onClick={RegisterFormSubmit} id="btnRegistertest">
                            Register
                        </button> */}
                        <br />

                        {/* <button type="submit" clientId={clientId} onSuccess={onSuccess} onFailure={onFailure} cookiePolicy={'single_host_origin'}  className="form-control mb-2" width="100%">
                            <img src={require('../src/images/Google_logo_kass.png')}></img>Or sign-in with Google
                        </button> */}

                        <GoogleLogin type="submit" clientId={clientId} buttonText="Sign in with Google" onSuccess={onSuccess} onFailure={onFailure} cookiePolicy={'single_host_origin'} className="btn btn-outline border form-control mb-3" width="100%" />


                        <button type="submit" className="form-control mb-2" width="100%" name="submit" id="submit" onClick={linkedInLogin} src={linkedin}>
                            <img src={require('../src/images/kaas-logo_linkdin_social.jpg')}></img> sign-in with Linkedin
                        </button>

                        {/* <img onClick={linkedInLogin} src={linkedin} alt="Sign in with Linked In" style={{ maxWidth: '180px', cursor: 'pointer' }} /> */}

                        <p className="text-center">Already Register? Sign In</p>
                        <p className="text-center">By Creating An Account, You Accept Kaas Terms Of Services & Privacy Policy</p>


                        {/* <button className="btn btn-danger form-control mb-2" width="100%" onClick={routeChange} id="submit">
                            Login
                        </button> */}
                        {/* </div> */}
                    </div>
                    <div className="col-md-7">
                        <div className="row">
                            <div className="col-md-2 col-sm-2"></div>
                            <div className="col-md-4 col-sm-2">
                                <h1 className="card-title text-left fw-bolder ft-fm">Sign Up Un-ending Learning!</h1>
                                {/* <h1 className="card-title text-left ft-fm">Your</h1>
                                <h1 className="card-title text-left ft-fm">Learning</h1>
                                <h1 className="card-title text-left ft-fm">World.</h1> */}
                            </div>
                            <div className="col-md-4 col-sm-2">
                                <img alt="" id="headerimg" className="rounded" src={require('../src/images/registermainimg.png')} width="100%" />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        {< img alt="" id="optionalstuff" className="rounded float-end" src={require('../src/images/lower log in page.png')} />}
                    </div>
                </div>
            </form>
        </div>//container-fluid
    )
}

export default RegisterForm;
