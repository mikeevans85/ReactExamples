import React from 'react';
import { MDBContainer, MDBFooter } from "mdbreact";
import './Footer.scss';

function Footer() {
    return (
        <div className="fixed-bottom">
        <MDBFooter color="grey" position="sticky" className="footer-privacy text-center">
            <MDBContainer fluid>
                <p className="topFooter">@{new Date().getFullYear()} AlumSum</p>
                <p><a className="footerLink" href={"/alumsum/privacypolicy"}>Privacy Policy</a> | <a className="footerLink" href={"/alumsum/termsofuse"}>Terms of Use</a></p>
            </MDBContainer>
        </MDBFooter>
    </div>
    );
}

export default Footer;
