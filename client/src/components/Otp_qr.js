import React, { useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import firebase from '../firebase'
import QrScan from 'react-qr-scanner'

import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Otp_qr = () => {

    const [disbutton, setDisbutton] = useState(true);
    const [validqr, setValidQR] = useState(false);
    const [validotp, setValidOtp] = useState(false);
    const [enablecam, setEnableCam] = useState(false);
    //scan qr data
    const [qrscan, setQrscan] = useState('no result');
    // const [file, setFile] = useState();
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    let { phoneNumber, qr } = location.state;
    //from object to string 
    let fix_phoneNumber = JSON.stringify(phoneNumber);
    fix_phoneNumber = fix_phoneNumber.replaceAll(',', '')
    fix_phoneNumber = fix_phoneNumber.replaceAll('"', '')
    fix_phoneNumber = fix_phoneNumber.replaceAll('"', '')
    fix_phoneNumber = fix_phoneNumber.replaceAll('[', '')
    fix_phoneNumber = fix_phoneNumber.replaceAll(']', '')
    phoneNumber = '+84' + fix_phoneNumber

    let fix_qr = JSON.stringify(qr);
    fix_qr = fix_qr.replaceAll(',', '')
    fix_qr = fix_qr.replaceAll('"', '')
    fix_qr = fix_qr.replaceAll('"', '')
    fix_qr = fix_qr.replaceAll('[', '')
    fix_qr = fix_qr.replaceAll(']', '')
    qr = fix_qr
    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        setAuth({});
        this.navigate('/linkpage');
    }
    // const handleChange = (e) => {
    //     // const { name, value } = e.target
    //     // this.setState({
    //     //     [name]: value
    //     // })
    //     setFile(e.target.files[0]);
    //     setQrscan(QrReader.useQrReader(file));
    //     console.log('file ' + qrscan)
    // }
    //Camera
    const handleScan = data => {
        if (data) {
            setQrscan(Object.values(data)[0]);
            if (Object.values(data)[0] === qr) {
                setValidQR(true);

            }
            console.log('QRRRRRRRRR')
        }
    }
    const handleError = err => {
        console.error(err)
    }

    //click  button submit 
    const onSignInSubmit = (e) => {
        e.preventDefault()

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                this.onSignInSubmit();
                console.log("Recaptca varified")
            },
            defaultCountry: "IN"
        });
        console.log(phoneNumber)
        const appVerifier = window.recaptchaVerifier
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                console.log("OTP has been sent")
            }).catch((error) => {
                console.log("SMS not sent")
            });
    }
    const onSubmitOTP = (e) => {
        e.preventDefault()
        const code = document.getElementById("otp").value;
        console.log(code)
        window.confirmationResult.confirm(code).then((result) => {
            const user = result.user;
            //

            console.log(JSON.stringify(user))
            setValidOtp(true)
            // ...
        }).catch((error) => {
        });
    }
    const onSubmit = (e) => {
        // e.preventDefault()
        // const code = document.getElementById("otp").value;
        // console.log(code)
        // window.confirmationResult.confirm(code).then((result) => {
        //     const user = result.user;
        //     //

        //     console.log(JSON.stringify(user))
        //     alert("User is verified")
        //     // ...
        // }).catch((error) => {
        // });
    }
    const enableCam = () => {
        setEnableCam(true)
    }
    return (
        <section>
            <h1>OTP-QR </h1>

            <form onSubmit={onSignInSubmit}>
                <div className="flexGrow">
                    <div id="sign-in-button"></div>
                    <button type="submit">Send OTP</button>
                </div>
            </form>
            <form onSubmit={onSubmitOTP} >
                <label >
                    OTP :
                    <FontAwesomeIcon icon={faCheck} className={validotp ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validotp ? "hide" : "invalid"} />
                </label>
                {/* onChange={onSubmitOTP} */}
                <input type="text" id="otp" name='otp' autoComplete="off" required placeholder="OTP Number" />

                {/* <input type="file" name="file" onChange={handleChange} /> */}


                <button type="submit">Check OTP</button>
            </form>
            <div>

                {
                    enablecam ?
                        <>   <label >
                            QRScan :
                            <FontAwesomeIcon icon={faCheck} className={validqr ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validqr ? "hide" : "invalid"} />
                        </label>
                            <QrScan
                                delay={300}
                                onScan={handleScan}
                                onError={handleError}
                                style={{ height: 240, width: 320 }}
                            />
                        </> :
                        <button type="button" onClick={enableCam}>Scan QR</button>
                }
            </div>
            <button type="button" onClick={enableCam} disabled={!validotp || !validqr}>Next</button>

            <div className="flexGrow">

            </div>
        </section >
    )
}


export default Otp_qr
