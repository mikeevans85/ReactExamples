import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import refinanceNow from './frame49.png';
import './Menu.scss';

function Menu(props) {
    const {data} = props;
    const cookieToken = data.csrfToken;
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const now = new Date();
    const [refnow, setRefNow] = useState({
        expdate: now,
        refCookie: false
    })
    const [csrfToken, setCsrfToken] = useState(cookieToken);

    const showMobileMenuFn = () => {
        setShowMobileMenu(true);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.display = 'none';
        }
    };

    const closeMobileMenu = () => {
        setShowMobileMenu(false);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.display = 'block';
        }
    };

    const logout = () => {
        console.log("logout");
        fetch('/alumsum/logout', {method: 'POST', credentials: 'include',
            headers: {'X-XSRF-TOKEN': csrfToken}}).then(res => res.json())
            .then(response => {
                window.location.href = response.logoutUrl + "?id_token_hint=" +
                    response.idToken + "&post_logout_redirect_uri=" + window.location.origin;
            });
    }

    const setRefinanceCookie = () => {
        const cookies = new Cookies();
        const d = new Date();
        const expirydate = d.setHours(d.getHours(),d.getMinutes()+5,0,0);
        const newexpirydate = new Date(expirydate)
        const cookieCheck = cookies.get('refinanceNow');
        console.log(cookieCheck);
        if (!cookieCheck === 'clicked') {
            cookies.set('refinanceNow', 'clicked', { path: '/', expires: newexpirydate });
            setRefNow({
                expdate: newexpirydate,
                refCookie: true
            })
        }
    }

    if (now > refnow.expdate) {
        setRefNow({
            refCookie: false
        });
    }

    let rc = refnow.refCookie;

    return (
        <div>
            <div className="menu pd-t20">
                <div className="menu-item pd-20 cursor-pointer">
                    <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/beta.svg'} alt="Beta" />
                </div>

                <div className="menu-item pd-20 cursor-pointer">
                    <a href="/alumsum/dashboard">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/HomeS.svg'} alt="Home" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/Home.svg'} alt="Home" />
                        <div className="mr-t5">Home</div>
                    </a>
                </div>
                <div className="menu-item pd-20 cursor-pointer">
                    <a href="/alumsum/dashboard/profile">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Profile.svg'} alt="Profile" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/ProfileH.svg'} alt="Profile" />
                        <div className="mr-t5">Profile</div>
                    </a>
                </div>
                <div className="menu-item pd-20 cursor-pointer refinance-menu-item">
                    <a onClick={setRefinanceCookie} href="/alumsum/dashboard/refinance">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Refinance.svg'} alt="" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/RefinanceH.svg'} alt="" />
                        <div className="mr-t5">Refinance</div>
                    </a>
                    { rc ? <div style={{ display:'none' }}></div> :  <div className="refinanceNow"><img src={refinanceNow}></img></div> }
                </div> 
                <div className="menu-item pd-20 cursor-pointer">
                    <a href="/alumsum/dashboard/loans">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/inactive.svg'} alt="Loans" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/active.svg'} alt="Loans" />
                        <div className="mr-t5">Loans</div>
                    </a>
                </div>
                {/* <div className="menu-item pd-20 cursor-pointer">
                    <a href="https://www.alumsum.com/blog">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Education.svg'} alt="Education" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/EducationH.svg'} alt="Education" />
                        <div className="mr-t5">Education</div>
                    </a>
                </div> */}
                {/* <div className="menu-item pd-20 cursor-pointer">
                    <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Education.svg'} alt="Donate" />
                    <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/EducationH.svg'} alt="Donate" />
                    <div className="mr-t5">Donate</div>
                </div> */}
                <div className="menu-item pd-20 cursor-pointer">
                    <a href="/alumsum/dashboard/payment">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Payment.svg'} alt="Payment" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/PaymentH.svg'} alt="Payment" />
                        <div className="mr-t5">Payment</div>
                    </a>
                </div>
                <div className="menu-item pd-20 cursor-pointer" onClick={() => logout()}>
                    <div onClick={() => logout()}>
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Logout.svg'} alt="Logout" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/LogoutH.svg'} alt="Logout" />
                        <div className="mr-t5">Logout</div>
                    </div>
                </div>
            </div>
            {!showMobileMenu && <div className="menu-mobile display-flex pd-15 justify-content-space-between">
                <div>
                    <img className="cursor-pointer" onClick={() => showMobileMenuFn()} src={process.env.PUBLIC_URL + '/svg/HamBurger.svg'} alt="alumsum logo"></img>
                </div>
                {/* <div>
                    <img src={process.env.PUBLIC_URL + '/svg/AlumSum.svg'} alt="alumsum logo"></img>
                </div> */}
            </div>}
            {showMobileMenu && <div className="menu-mobile-main">
                <div className="pd-20 text-right">
                    <img className="cursor-pointer" onClick={() => closeMobileMenu()} src={process.env.PUBLIC_URL + '/svg/Close.svg'} alt="Close" />
                </div>
                <a href="/">
                    <div className="menu-item pd-20 cursor-pointer">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/HomeS.svg'} alt="Home" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/Home.svg'} alt="Home" />
                        <div className="mr-l15">Home</div>
                    </div>
                </a>
                <a href="/alumsum/dashboard/profile">
                    <div className="menu-item pd-20 cursor-pointer">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Profile.svg'} alt="Profile" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/ProfileH.svg'} alt="Profile" />
                        <div className="mr-l15">Profile</div>
                    </div>
                </a>
                <a href="/alumsum/dashboard/refinance">
                    <div className="menu-item pd-20 cursor-pointer">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Refinance.svg'} alt="" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/RefinanceH.svg'} alt="" />
                        <div className="mr-l15">Refinance</div>
                    </div>
                </a>
                <a href="/alumsum/dashboard/loans">
                    <div className="menu-item pd-20 cursor-pointer">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/inactive.svg'} alt="Loans" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/active.svg'} alt="Loans" />
                        <div className="mr-l15">Loans</div>
                    </div>
                </a>
                {/* <a href="https://www.alumsum.com/blog">
                    <div className="menu-item pd-20 cursor-pointer">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Education.svg'} alt="Education" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/EducationH.svg'} alt="Education" />
                        <div className="mr-l15">Education</div>
                    </div>
                </a> */}
                {/* <div className="menu-item pd-20 cursor-pointer">
                    <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Education.svg'} alt="Donate" />
                    <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/EducationH.svg'} alt="Donate" />
                    <div className="mr-l15">Donate</div>
                </div> */}
                <a href="/alumsum/dashboard/payment">
                    <div className="menu-item pd-20 cursor-pointer">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Payment.svg'} alt="Payment" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/PaymentH.svg'} alt="Payment" />
                        <div className="mr-l15">Payment</div>
                    </div>
                </a>
                <div onClick={() => logout()}>
                    <div className="menu-item pd-20 cursor-pointer">
                        <img className="menu-img" src={process.env.PUBLIC_URL + '/svg/Logout.svg'} alt="Logout" />
                        <img className="menu-img-hover" src={process.env.PUBLIC_URL + '/svg/LogoutH.svg'} alt="Logout" />
                        <div className="mr-l15">Logout</div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default Menu;
