import React, {Component} from 'react';
import { withCookies } from 'react-cookie';
import {Button, FormGroup} from 'reactstrap';
import Calendar from '../Calendar/Calendar';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import MyLoans from '../MyLoans/MyLoans';
import QuickStats from '../QuickStats/QuickStats';
import SaveInterest from '../SaveInterest/SaveInterest';
import Menu from '../Menu/Menu';
import './MainContent.scss';
import Modal from 'react-bootstrap/Modal';
import betaLogo from '../Header/alumsumlogobetatm.png';

class MainContent extends Component {
    emptyItem = {
        origdate: '',
        interestrate: null,
        length: null
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            csrfToken: cookies.get('XSRF-TOKEN'),
            isLoaded: false,
            error: false,
            needInfo: false,
            loanName: '',
            item: this.emptyItem,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleInterestChange = this.handleInterestChange.bind(this);
        this.handleLengthChange = this.handleLengthChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.forbearanceCheck = this.forbearanceCheck.bind(this);
        console.log('maincontent', this.state.cookies, this.state.csrfToken);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleInterestChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleLengthChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        let newValue = parseInt(value);
        item[name] = newValue;
        this.setState({item});
    }
    
    showModal = (x) => {
        if (x === true) {
            this.setState({needInfo: true});
        } else {
            this.setState({needInfo: false});
        }
    }

    forbearanceCheck() {
        const loans = this.state.item.student_loan_info;
        for (let i = 0; i < loans.length; i++) {
            if (loans[i].interest_rate === 0) {
                this.setState({needInfo: true, loanName: loans[i].spinwheel_loan.guarantor});
                break;
            } else {
                console.log(loans[i].interest_rate);
            }
            if (i === (loans.length - 1)) {
                this.setState({needInfo: false})
            }
        };
    }

    async handleSubmit(event) {
        const {item} = this.state;
        event.preventDefault();
        let itemInterest = parseFloat(item.interestrate)
        const url = "/fin/recalculate-loans?originationDate=" + item.origdate + "&interestRate=" + itemInterest + "&loanTermInMonths=" + item.length;
        
        await fetch(url)
            .then(async response => {
                const newData = await response.json();
                console.log("NewResponse:", newData);
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (newData && newData.message) || response.status;
                    return Promise.reject(error);
                };
                this.setState({item: newData});
            });
            this.forbearanceCheck();

    }

    async componentDidMount() {
        const {csrfToken} = this.state;
        const requestOptions = {
            method: 'GET',
            headers: { 
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        await fetch('/alumsum/users', {credentials: 'include'})
            .then(async response => response.json())
            .then(data => this.setState({userInfo: data})
        );

        if (this.state.userInfo[0].userEmail === null) {
            window.location.href = '/alumsum/onboarding';
        } else {

            await fetch('/fin/spinwheel-aggregation', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    console.log("RESPONSE RECEIVED(3): ", data);
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                    ;
                    this.setState({item: data, isLoaded: true});
                })
                .catch((err) => {
                    console.log("ERROR: ", err);
                    this.setState({error: true});
                });
        };
        this.forbearanceCheck();
    }

    render() {
        const {isLoaded, error, needInfo, loanName, item} = this.state;
        if (isLoaded) {
            return(    
                <div className="dashboard-container">    
                    <div className="app-content display-flex h-100">
                        <Menu data={this.state}/>
                        <div id="main-content" className="main-container">
                            <Header data={this.state}/>
                            <Modal htmlOpenClassName='ReactModal__Html--open' show={needInfo} onHide={() => this.showModal(false)}>
                                <Modal.Header className="logoHeader" closeButton>
                                    <img className="modalLogo" src={betaLogo} alt="logo" />
                                </Modal.Header>
                                <Modal.Header>
                                    <Modal.Title className="mainModalTitle">
                                        <h3>We noticed that one or more of your loans are under deferment. Due to loan services limiting data during this unique time, and to better help us give you the most accurate information possible, we are asking for your best average estimates for the fields below.</h3>
                                        <div className="forbLoanName">
                                            <h3>{loanName}</h3>
                                        </div>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="formIntake">
                                        <form onSubmit={this.handleSubmit}>
                                            <label for="origdate" className="currentjob">Origination Date of Loan (in YYYY-MM-DD format):</label>
                                            <input required type="text" className="modalInfo" name="origdate" id="origdate" placeholder="YYYY-MM-DD" value={item.origdate || ''} onChange={this.handleChange} />
                                            <label for="interestrate" className="currentjob">Interest Rate:</label>
                                            <input required type="tel" className="modalInfo" name="interestrate" id="interestrate" placeholder="4.25%" value={item.interestrate || null} onChange={this.handleInterestChange} />
                                            <label for="length" className="currentjob">Length of Loan Term (in years):</label>
                                            <input required type="tel" name="length" className="modalInfo" id="length" value={item.length || null} onChange={this.handleLengthChange} />
                                            <FormGroup className="modalsubmit">
                                                <Button type="submit" className="continuebutton">Submit</Button>
                                            </FormGroup>
                                        </form>
                                    </div>
                                </Modal.Body>
                            </Modal>
                            <div className="body-content">
                                <QuickStats data={this.state}/>
                                <MyLoans data={this.state}/>
                                <SaveInterest info={this.state}/>
                                <Calendar data={this.state}/>
                                <Footer data={this.state}/>
                            </div>
                        </div>
                    </div>
                </div>)
        } else if (error) {
            //return (<div className="tempScreen"><h3>An error has occurred.</h3><Button className="tempBtn" href="/">Return to Homepage</Button></div>)
            return(
            <div className="dashboard-container">
                <div className="app-content display-flex h-100">
                    <Menu data={this.state}/>
                    <div id="main-content" className="main-container">
                        <Header data={this.state}/>
                        <div className="body-content">
                            <div className="tempScreen"><h3>We do not have any Student Loan information to display.</h3></div>
                        </div>
                    </div>
                </div>
            </div>)
        } else {
            return (<div className="tempScreen"><h3>Loading...</h3></div>)
        }
    }
}

export default withCookies(MainContent);
