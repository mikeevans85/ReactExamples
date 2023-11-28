import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from '../ProgressBar/ProgressBar';
import {Link} from 'react-router-dom';
import '../MyLoans/MyLoans.scss';
import './UserLoanStats.scss';


function UserLoanStats(props) {
    const [arrow, setArrow] = useState([37]);
    const [inHover, setHover] = useState(false);
    const handleClose = () => setHover(false);
    const data = props.data;
    let isMobile = props.isMobile;
  
    // function to sort loans by institution name
    function compare (a, b) {
        const intA = a.current_balance;
        const intB = b.current_balance;
      
        let comparison = 0;
        if (intA > intB) {
          comparison = -1;
        } else if (intA < intB) {
          comparison = 1;
        };
        return comparison;
    }
    //splits loans into separate arrays by insititution name
    Array.prototype.groupBy = function(key) {
        return this.reduce(function (r, a, i) {
            if (!i || r[r.length - 1][0][key] !== a[key]) {
                return r.concat([[a]]);
            };
            r[r.length - 1].push(a);
            return r;
        }, []);
    };
    //find loan with highest interest rate
    function findHighestRate(l) {
        let empty = l[0]["interest_rate"];
        let name = l[0]["servicer_name"];
        let balance = l[0]["current_balance"];
        for (let c = 1; c < l.length; c++) {
            if (l[c]["interest_rate"] > empty) {
                empty = l[c]["interest_rate"];
                name = l[c]["servicer_name"];
                balance = l[c]["current_balance"];
            } else if (l[c]["interest_rate"] === empty) {
                if (l[c]["current_balance"] > balance) {
                    empty = l[c]["interest_rate"];
                    name = l[c]["servicer_name"];
                    balance = l[c]["current_balance"];
                }
            }
        };
        return name;
    }

    function handleArrow(int) {
        if (arrow.some((a) => int === a)) {
            setArrow(prevArrow => prevArrow.filter(a => a !== int));
        } else {
            setArrow(prevArrow => [...prevArrow, int])
        }
        console.log(arrow, int);
    }

    //setting up variables for loan rows
    const loanData = data;
    const sortedLoanData = loanData.sort(compare);
    const highestInterest = findHighestRate(sortedLoanData);
    const highestInterestText = highestInterest.replace('Loans', '');
    const brokenSortedLoanData = sortedLoanData.groupBy("servicer_id");

    function createLoanRows() {
        let array = [];
        let recommended = false;
        let accountNumberChildren = [];
        let loanLeftChildren = [];
        let interestRateChildren = [];

        for (let i = 0; i < brokenSortedLoanData.length; i++) {
            if (brokenSortedLoanData[i].length > 1) { // creating rows for providers with multiple loans
                let k = 100;
                let l = 200;
                let m = 300;
                let n = 400;
                if (brokenSortedLoanData[i][0]["servicer_name"] === highestInterest) {
                    recommended = true;
                };
                let principalPaidSum = 0; // total amount of principal paid to provider
                let principalSum = 0; // total amount of loan principals for each provider
                let interestSum = 0; // beginning sum of interest rates to average later
                let balanceSum = 0; // total sum of loan balances for this provider
                let element = brokenSortedLoanData[i];
                for (let z = 0; z < element.length; z++) {
                    principalSum += element[z]["principal"];
                    principalPaidSum += element[z]["principal_paid"];
                    interestSum += element[z]["interest_rate"];
                    balanceSum += element[z]["current_balance"]
                };
                let interestAverage = (interestSum / element.length).toFixed(2); // average interest rate for this provider
                principalPaidSum = Math.round(principalPaidSum);
                let principalPaidSumString = new Intl.NumberFormat().format(principalPaidSum);
                let totalSum = new Intl.NumberFormat().format(principalSum); 
                let paymentsMade = new Intl.NumberFormat().format(balanceSum); // balance remaining to provider
                let slicedElement = element.slice(1);
                for (let j = 0; j < slicedElement.length; j++) { // creating extra rows for all other loans to this provider except for the first one
                    let accountNumberDiv = j === (slicedElement.length - 1) ? <div key={l} className="row-details">Loan ID: {slicedElement[j]["account_number"]}</div> : <div key={l} className="row-detail">Loan ID: {slicedElement[j]["account_number"]}</div>;
                    let loanLeftDiv = j === (slicedElement.length - 1) ? <div key={m} className="row-details">${new Intl.NumberFormat().format(slicedElement[j]["current_balance"])}</div> : <div key={m} className="row-detail">${slicedElement[j]["current_balance"]}</div>;
                    let interestRateDiv = j === (slicedElement.length - 1) ? <div key={n} className="row-details">{slicedElement[j]["interest_rate"]}%</div> : <div key={n} className="row-detail">{slicedElement[j]["interest_rate"]}%</div>;
                    accountNumberChildren.push(accountNumberDiv);
                    loanLeftChildren.push(loanLeftDiv);
                    interestRateChildren.push(interestRateDiv);
                    l++;
                    m++; 
                    n++;
                };
                const percentage = Math.floor((principalPaidSum / principalSum) * 100);
                array.push(
                    <div key={k} className="loan-table-row display-flex pd-t20">
                        <div style={{ width: '35%' }}>
                            { recommended ? <div>{element[0]["servicer_name"]}<button className="btn-recomend mr-l10" onClick={() => setHover(true)}>Recommended
                           <img className="mr-l5" src={process.env.PUBLIC_URL + '/svg/Recommend.svg'} alt="alum" />
                           </button></div> : <div>{element[0]["servicer_name"]}</div>}
                           <Modal htmlOpenClassName='ReactModal__Html--open' show={inHover} onHide={handleClose}>
                               <Modal.Header closeButton>
                                    <Modal.Title className="modalTitle">alumSum's Recommendation</Modal.Title>
                               </Modal.Header>
                               <Modal.Body><p>Based on your profile, you're taking an <span><strong>aggressive</strong></span> approach to paying off your student loans. We recommend making payments towards your <strong>{highestInterestText}</strong> loans, due to high interest rate and low remaining principal.</p><br /><p>To learn more about payoff strategies, read <a href="#">our take</a> on different options alums are using.</p></Modal.Body>
                           </Modal>
                            { arrow.some((a) => k === a) ? null : <div className="row-detail">Loan ID: {element[0]["account_number"]}</div>}
                            { arrow.some((a) => k === a) ? null : accountNumberChildren}
                        </div>
                        <div style={{ width: '12.5%' }}>${paymentsMade}
                            { arrow.some((a) => k === a) ? null : <div className="row-detail">${new Intl.NumberFormat().format(element[0]["current_balance"])}</div>}
                            { arrow.some((a) => k === a) ? null : loanLeftChildren}
                        </div>
                        <div style={{ width: '12.5%' }}>{interestAverage}%
                            { arrow.some((a) => k === a) ? null : <div className="row-detail">{element[0]["interest_rate"]}%</div>}
                            { arrow.some((a) => k === a) ? null : interestRateChildren}
                        </div>
                        <div style={{ width: '15%' }}>
                            <ProgressBar percentage={percentage}/>
                            <div className="progress-text mr-t5">${principalPaidSumString}/${totalSum}</div>
                        </div>
                        <div style={{ width: '25%' }} className="display-flex justify-content-space-between">
                            <Link to="/alumsum/dashboard/payment"><button className="bt-my bt-my-primary">Make Payment</button></Link>
                            <div className="display-flex less-more">
                                { arrow.some((a) => k === a) ? <div onClick={() => handleArrow(k)}>more</div> : 
                                <div onClick={() => handleArrow(k)}>less</div> }
                                <div className="mr-l10 arrow">
                                    { arrow.some((a) => k === a) ? <img src={process.env.PUBLIC_URL + '/svg/ArrowDown.svg'} alt="less" onClick={() => handleArrow(k)}></img> : <img src={process.env.PUBLIC_URL + '/svg/ArrowUp.svg'} alt="less" onClick={() => handleArrow(k)}></img>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
                recommended = false;
            } else { // creating rows for lenders with only one loan present
                let totalOutstanding = Math.round(brokenSortedLoanData[i][0]["principal_paid"]);
                let totalRemaining = Math.round(brokenSortedLoanData[i][0]["principal"]);
                let totalPercentage = Math.floor((totalOutstanding / totalRemaining) * 100);
                let brokenCurrentBalance = new Intl.NumberFormat().format(brokenSortedLoanData[i][0]["current_balance"]);
                if (brokenSortedLoanData[i][0]["servicer_name"] === highestInterest) {
                    recommended = true;
                };
                array.push(
                    <div key={i} className="loan-table-row display-flex pd-t20">
                        <div style={{ width: '35%' }}>
                            { recommended ? <div>{brokenSortedLoanData[i][0]["servicer_name"]}<button className="btn-recomend mr-l10" onClick={() => setHover(true)}>Recommended
                           <img className="mr-l5" src={process.env.PUBLIC_URL + '/svg/Recommend.svg'} alt="alum" />
                           </button></div> : <div>{brokenSortedLoanData[i][0]["servicer_name"]}</div>}
                           <Modal htmlOpenClassName='ReactModal__Html--open' show={inHover} onHide={handleClose}>
                               <Modal.Header closeButton>
                                   <Modal.Title className="modalTitle">alumSum's Recommendation</Modal.Title>
                               </Modal.Header>
                                <Modal.Body><p>Based on your profile, you're taking an <span><strong>aggressive</strong></span> approach to paying off your student loans. We recommend making payments towards your <strong>{highestInterestText}</strong> loans, due to high interest rate and low remaining principal.</p><br /><p>To learn more about payoff strategies, read <a className="ourTakeLink" href="#">our take</a> on different options alums are using.</p></Modal.Body>
                           </Modal>
                            { arrow.some((a) => i === a) ? null : <div className="row-details">Loan ID: {brokenSortedLoanData[i][0]["account_number"]}</div>}
                        </div>
                        <div style={{ width: '12.5%' }}>Balance
                            { arrow.some((a) => i === a) ? null : <div className="row-details">${brokenCurrentBalance}</div>}
                        </div>
                        <div style={{ width: '12.5%' }}>Interest %
                            { arrow.some((a) => i === a) ? null : <div className="row-details">{brokenSortedLoanData[i][0]["interest_rate"]}%</div>}
                        </div>
                        <div style={{ width: '15%' }}>
                            <ProgressBar percentage={totalPercentage}/>
                            <div className="progress-text mr-t5">${totalOutstanding}/${totalRemaining}</div>
                        </div>
                        <div style={{ width: '25%' }} className="display-flex justify-content-space-between">
                            <Link to="/alumsum/dashboard/payment"><button className="bt-my bt-my-primary">Make Payment</button></Link>
                            <div className="display-flex less-more">
                                { arrow.some((a) => i === a) ? <div onClick={() => handleArrow(i)}>more</div> : 
                                <div onClick={() => handleArrow(i)}>less</div> }
                                <div className="mr-l10 arrow">
                                    { arrow.some((a) => i === a) ? <img src={process.env.PUBLIC_URL + '/svg/ArrowDown.svg'} alt="less" onClick={() => handleArrow(i)}></img> : 
                                    <img src={process.env.PUBLIC_URL + '/svg/ArrowUp.svg'} alt="less" onClick={() => handleArrow(i)}></img> }
                                </div>
                            </div>
                        </div>
                    </div>
                );
                recommended = false;
            }
        };
        return array;
    };

    function createMobileLoanRows() {
        //for each provider, need name, total balance, and average interest rate.
        let mobileArray = [];
        let r = 500;
        let s = 600;
        let lastOne = false;
        for (let p = 0; p < brokenSortedLoanData.length; p++) {
            if (p === brokenSortedLoanData.length - 1) {
                lastOne = true;
            }
            if (brokenSortedLoanData[p].length > 1) {
                let mobileBalanceSum = 0;
                let mobileInterestSum = 0;
                let mobileProviderName = brokenSortedLoanData[p][0]["servicer_name"];
                for (let q = 0; q < brokenSortedLoanData[p].length; q++) {
                    mobileBalanceSum += brokenSortedLoanData[p][q]["current_balance"];
                    mobileInterestSum += brokenSortedLoanData[p][q]["interest_rate"];
                };
                let mobileBalance = new Intl.NumberFormat().format(mobileBalanceSum);
                let mobileInterestAverage = (mobileInterestSum / brokenSortedLoanData[p].length).toFixed(2);
                let object = lastOne ?  <div key={r}><div className="loan-table-row display-flex pd-t20 pd-b20 border-bc8"><div style={{ width: '50%' }}><div>{mobileProviderName}</div></div><div style={{ width: '30%' }}>${mobileBalance}</div><div style={{ width: '20%' }}>{mobileInterestAverage}%</div></div></div> : <div key={r}><div className="loan-table-row display-flex pd-t20"><div style={{ width: '50%' }}><div>{mobileProviderName}</div></div><div style={{ width: '30%' }}>${mobileBalance}</div><div style={{ width: '20%' }}>{mobileInterestAverage}%</div></div></div>
                mobileArray.push(object);
                r++;
            } else {
                let mobileSingleName = brokenSortedLoanData[p][0]["servicer_name"];
                let mobileSingleBalance = new Intl.NumberFormat().format(brokenSortedLoanData[p][0]["current_balance"]);
                let mobileSingleInterest = brokenSortedLoanData[p][0]["interest_rate"];
                let singleObject = lastOne ? <div key={s}><div className="loan-table-row display-flex pd-t20 pd-b20 border-bc8"><div style={{ width: '50%' }}><div>{mobileSingleName}</div></div><div style={{ width: '30%' }}>${mobileSingleBalance}</div><div style={{ width: '20%' }}>{mobileSingleInterest}%</div></div></div> : <div key={s}><div className="loan-table-row display-flex pd-t20"><div style={{ width: '50%' }}><div>{mobileSingleName}</div></div><div style={{ width: '30%' }}>${mobileSingleBalance}</div><div style={{ width: '20%' }}>{mobileSingleInterest}%</div></div></div>
                mobileArray.push(singleObject);
                s++;
            };
        };
        return mobileArray;
    }
    
    if (isMobile) {
        return (
            <div>
                {createMobileLoanRows()}
            </div>
        )
    } else {
        return (
            <div>
                {createLoanRows()}
            </div>
        )
    };
}

export default UserLoanStats;