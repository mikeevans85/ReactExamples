import React, {Component} from 'react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import './QuickStats.scss';
import Modal from 'react-bootstrap/Modal';

class QuickStats extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    monthArray = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]

    constructor(props) {
        super(props);
        this.state = {
            item: this.props.data,
            user: this.props.data.userInfo,
            payoffDate: '',
            loanDebtModal: false,
            debtFreeModal: false,
            avgIntModal: false
        };
    }

    showLoanDebtModal = (x) => {
        if (x) {this.setState({loanDebtModal: true});
        } else {this.setState({loanDebtModal: false});}
    }

    showDebtFreeModal = (x) => {
        if (x) {this.setState({debtFreeModal: true});
        } else {this.setState({debtFreeModal: false});}
    }

    showAvgIntModal = (x) => {
        if (x) {this.setState({avgIntModal: true});
        } else {this.setState({avgIntModal: false});}
    }

    componentDidMount() {
        const months = parseInt(this.state.item.item.loan_aggregate.estimated_months_to_payoff);
        const d = new Date();
        const payoffDate = new Date(d.setMonth(d.getMonth()+months));
        const monthAsText = this.monthArray[payoffDate.getMonth()];
        const calculatedDate = `${monthAsText} ${payoffDate.getFullYear()}`;
        this.setState({payoffDate: calculatedDate});
        const userDob = new Date(this.state.user[0].userDob);
        const calculatedAge = calculateAge(userDob, payoffDate);
        this.setState({payoffAge: calculatedAge});

        function calculateAge(d1, d2) {        
            var years = (d2.getFullYear() - d1.getFullYear());
        
            if ((d2.getMonth() < d1.getMonth() ||
                d2.getMonth() === d1.getMonth()) && d2.getDate() < d1.getDate()) {
                years--;
            }
            return years;
        }
    }

    render(){
        const loanData = this.state.item.item;
        const {loanDebtModal, debtFreeModal, avgIntModal} = this.state;
        // const principal = parseFloat(loanData.loan_aggregate.total_principal);
        // const principalPaid = parseFloat(loanData.loan_aggregate.total_principal_paid);
        const loanRemaining = parseInt(loanData.loan_aggregate.total_loan_debt);
        const principalDollar = new Intl.NumberFormat().format(loanRemaining);
        const avgIntRate = loanData.loan_aggregate.average_interest_rate;
        return (
            <div className="quick-stats">
                <div>
                    <div className="container-heading text-left">Quick Stats</div>
                    <div className="mr-t5 quick-stats-container">
                        <div style={{ backgroundColor: '#393e46', color: '#ffffff' }} className="tile flex-1 pd-20 text-center">
                            <div className="text-right mr-b5">
                                <img onClick={() => this.showLoanDebtModal(true)} src={process.env.PUBLIC_URL + '/svg/Information.svg'} alt="info" />
                                <Modal htmlOpenClassName='ReactModal__Html--open' show={loanDebtModal} onHide={() => this.showLoanDebtModal(false)}>
                                    <Modal.Body><p>This is how much total principal is left to be paid off, across all your connected student loans.</p></Modal.Body>
                                </Modal>
                            </div>
                            <div className="heading">${principalDollar}</div>
                            <div className="sub-heading mr-t5">Loan debt remaining.</div>
                        </div>
                        <div style={{ backgroundColor: '#C9CAC8', color: '#4C4D4F' }} className="tile flex-1 pd-20 text-center">
                            <div className="text-right mr-b5">
                                <img onClick={() => this.showDebtFreeModal(true)} src={process.env.PUBLIC_URL + '/svg/Information.svg'} alt="info" />
                                <Modal htmlOpenClassName='ReactModal__Html--open' show={debtFreeModal} onHide={() => this.showDebtFreeModal(false)}>
                                    <Modal.Body><p>This is how old you will be by the time you've paid off your student loans.</p></Modal.Body>
                                </Modal>
                            </div>
                            <div className="heading">{this.state.payoffAge} yrs old</div>
                            <div className="sub-heading mr-t5">You'll be debt-free {this.state.payoffDate}.</div>
                        </div>
                        <div style={{ backgroundColor: '#288B6A', color: '#ffffff' }} className="tile flex-1 pd-20 text-center">
                            <div className="text-right mr-b5">
                                <img onClick={() => this.showAvgIntModal(true)} src={process.env.PUBLIC_URL + '/svg/Information.svg'} alt="info" />
                                <Modal htmlOpenClassName='ReactModal__Html--open' show={avgIntModal} onHide={() => this.showAvgIntModal(false)}>
                                    <Modal.Body><p>This is the weighted interest rate across all of your connected student loans.</p></Modal.Body>
                                </Modal>
                            </div>
                            <div className="heading">{avgIntRate}%</div>
                            <div className="sub-heading mr-t5">Average interest rate of your loans.</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

export default withCookies(QuickStats);
