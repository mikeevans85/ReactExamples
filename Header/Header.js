import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import betaLogo from './alumsumlogobetatm.png';
import './Header.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.data.userInfo
        };
    }

    render() {
        return (
            <div className="header text-center mr-t40 mr-b30 wd-100">
                <Link to='/'><img src={betaLogo} alt="logo" /></Link>
        <div className="welcome-text mr-t30">Welcome to your student dashboard, <span className="country-name">{this.state.user[0].firstName}</span></div>
            </div>
        )
    }
}

export default Header;
