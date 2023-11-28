import React, {useState, useRef} from 'react';
import PayOff from '../PayOff/PayOff';
import {Link} from 'react-router-dom';
import './SaveInterest.scss';

function SaveInterest(props) {
    const {info} = props;
    const loanData = info.item;
    console.log(loanData);
    const [sliderState, setSliderState] = useState(50);
    const amortizeMonths = useRef(0);
    const prevSavings = useRef(0);
    const value = sliderState;
    const extraPayment = sliderState * 10;
    const callback = (sliderNumericalValue) => {
        setSliderState(sliderNumericalValue)
    };
    const loanRemaining = parseInt(loanData.loan_aggregate.total_loan_debt);
    const principalDollar = new Intl.NumberFormat().format(loanRemaining);

    function amortizeLoan(a, b, c, d, e) {
        let timeToRepay = 1;
        let amountFinanced = a - b;
        while (amountFinanced > 0 && timeToRepay < 360) {
            amountFinanced = amountFinanced - d - e;
            amountFinanced = amountFinanced * (1 + c / (12 * 100));
            timeToRepay++;
        };
        return timeToRepay;
    }
    

    //Calculating Extra Interest Savings
    const loans = loanData.loan_aggregate;
    const currentDebt = loans.total_loan_debt;
    const currentInterestRate = loans.average_interest_rate;
    const larger = Math.max(loans.total_actual_monthly_payment, loans.total_min_payment); //compares the larger of two values
    const bip = (larger * loans.estimated_months_to_payoff) - currentDebt; //calculated interest based on monthly payments
    const monthlyInterest = bip /loans.estimated_months_to_payoff;

    let lowerRateExtraPayment = amortizeLoan(currentDebt, 0, currentInterestRate, larger, extraPayment);
    const howmuch = monthlyInterest * lowerRateExtraPayment
    const savings = bip - howmuch;
    let ans = parseInt(savings);
    let wer = new Intl.NumberFormat().format(ans);


    return (
        <div className="save-interest mr-t30 flex-container flex-wrap">
            <div className="flex-interest">
                <div className="container-heading text-left mr-t10">Save on Interest</div>
                <div className="tile">
                    <div className="display-flex interest-text">
                        <div className="paragraph-text">Extra payments add up! For a total balance of ${principalDollar}, an extra ${extraPayment} payment each month can result in</div>
                    </div>
                    <div className="amount-background">
                        <div className="amount-display">
                            <h2 className="amount">${wer}</h2>
                            <h2 className="amount-text">lifetime savings</h2>
                            <div className="interest-button">
                                <Link to={{ pathname: "https://www.alumsum.com/blog/how-current-students-can-save-thousands-in-interest-on-their-student-loans"}} target="_blank"><button style={{ width: '100%', padding: '20px' }} className="btn btn-dashboard btn-secondary">Learn More About Interest</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PayOff onSliderChange={callback} sliderValue={value} loans={info}/>
        </div>
    );
}

export default SaveInterest;