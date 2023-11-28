import React, { useRef, useState } from 'react';
import UserLoanStats from '../UserLoanStats/UserLoanStats';
import './MyLoans.scss';

function MyLoans(props) {
    const {data} = props;
    const loanData = data.item;
    const sli = loanData.student_loan_info;
    console.log(loanData.student_loan_info);
    const unpaidLoans = [];
    const paidLoans = [];
    const [tab, setTab] = useState(true);

    for (let x = 0; x < sli.length; x++) {
        if (sli[x]["current_balance"] === 0) {
            paidLoans.push(sli[x]);
        } else {
            unpaidLoans.push(sli[x]);
        }
    }

    function changeTab(x) {
        setTab(x);
    }

    //creating variables from API data
    if (unpaidLoans.length > 0) {
        
    }
    //Principal
    const principalPaid = parseInt(loanData.loan_aggregate.total_principal_paid);
    const principalPaidRef = useRef(new Intl.NumberFormat().format(principalPaid));
    const totalPrincipal = loanData.loan_aggregate.total_principal;
    const principalRemaining = parseInt(loanData.loan_aggregate.total_principal - loanData.loan_aggregate.total_principal_paid);
    const principalRemainingRef = useRef(new Intl.NumberFormat().format(principalRemaining));
    const paidFlex = (parseInt(loanData.loan_aggregate.total_principal_paid) / totalPrincipal).toFixed(2);
    const paidFlexRemaining = 1 - paidFlex;

    //Interest
    const interestPaid = parseInt(loanData.loan_aggregate.total_interest_paid);
    const interestPaidRef = useRef(new Intl.NumberFormat().format(interestPaid));
    const interestRemaining = parseInt(loanData.loan_aggregate.total_outstanding_interest);
    const interestRemainingRef = useRef(new Intl.NumberFormat().format(interestRemaining));
    const totalInterest = interestPaid + interestRemaining;
    const interestPaidFlex = (interestPaid / totalInterest).toFixed(2);
    const interestRemainingFlex = 1 - interestPaidFlex; 

    const totalDebt = new Intl.NumberFormat().format(totalPrincipal);
    const totalBalance = new Intl.NumberFormat().format(loanData.loan_aggregate.total_loan_debt);
    const avgInterestRate = useRef(loanData.loan_aggregate.average_interest_rate);
    
    if (tab) {
        return (
            <div className="my-loans mr-t30">
                <div>
                    <div className="container-heading text-left mr-t10">My Loans</div>
                    <div className="tabContainer">
                        <div className="tabTile active" onClick={() => changeTab(true)}>
                            <p><strong>Current Loans</strong></p>
                        </div>
                        <div className="tabTile" onClick={() => changeTab(false)}>
                            <p><strong>Paid Off Loans</strong></p>
                        </div>
                    </div>
                    <div className="tile pd-15">
                        <div className="loan-text desktop mr-b10">Loan Summary</div>
                        <div className="display-flex loan-summary">
                            <div style={{ flexGrow: 1 }} className="mr-r20 principal">
                                <div className="text-center loan-heading ls-4 fw-bold">PRINCIPAL</div>
                                <div className="display-flex mr-t15">
                                    <div style={{ flexGrow: paidFlex }} className="paid-text-principal text-center pd-10">
                                        <div className="f-10 desktop">Paid</div>
                                        <div className="f-14 fw-bold">${principalPaidRef.current}</div>
                                    </div>
                                    <div style={{ flexGrow: paidFlexRemaining }} className="remaining-text paid-remaining text-center">
                                        <div className="f-10 desktop">Remaining</div>
                                        <div className="f-14 fw-bold">${principalRemainingRef.current}</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ flexGrow: 0.4 }}>
                                <div style={{ color: '#E0314E' }} className="text-center loan-heading ls-4 fw-bold">INTEREST</div>
                                <div className="display-flex mr-t15">
                                    <div style={{ flexGrow: interestPaidFlex }} className="paid-text-interest text-center pd-10">
                                        <div className="f-10 desktop">Paid</div>
                                        <div className="f-14 fw-bold">${interestPaidRef.current}</div>
                                    </div>
                                    <div style={{ flexGrow: interestRemainingFlex, color: '#E0314E' }} className="remaining-text text-center pd-10">
                                        <div className="f-10 desktop">Remaining</div>
                                        <div className="f-14 fw-bold">${interestRemainingRef.current}</div>
                                        <div className="f-12 desktop">(estimated)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="loan-table mr-t20">
                            <div className="loan-table-head display-flex border-bc8 pd-b10">
                                <div style={{ width: '35%' }}>Loan Provider/Loan</div>
                                <div style={{ width: '12.5%' }}>Balance</div>
                                <div style={{ width: '12.5%' }}>Interest %</div>
                                <div style={{ width: '15%' }} >Progress %</div>
                                <div style={{ width: '25%' }}></div>
                            </div>
                            {unpaidLoans.length > 0 ? <UserLoanStats data={unpaidLoans} isMobile={false} /> : <p>Test</p>}
                            <div className="loan-table-head display-flex pd-t10 pd-b10">
                                <div style={{ width: '35%' }}>Total / Average</div>
                                <div style={{ width: '12.5%' }}>${totalBalance}</div>
                                <div style={{ width: '12.5%' }}>{avgInterestRate.current}%</div>
                                <div style={{ width: '15%' }} >${principalPaidRef.current} / ${totalDebt}</div>
                            </div>
                        </div>
                        <div className="loan-table-mobile">
                            <div className="loan-table-head display-flex border-bc8 mr-t20 pd-b10">
                                <div style={{ width: '50%' }}>Loan Provider</div>
                                <div style={{ width: '30%' }}>Balance</div>
                                <div style={{ width: '20%' }}>Interest</div>
                            </div>
                            {unpaidLoans.length > 0 ? <UserLoanStats data={unpaidLoans} isMobile={true} /> : <p>Test</p>}
                            <div className="loan-table-head display-flex pd-t10 pd-b10">
                                <div style={{ width: '50%' }}>Total / Average</div>
                                <div style={{ width: '30%' }}>${totalBalance}</div>
                                <div style={{ width: '20%' }}>{avgInterestRate.current}%</div>
                            </div>
                            <div className="mr-t20">
                                <button style={{ width: '100%', padding: '20px' }} className="bt bt-primary">Make Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    } else {
        return (
            <div className="my-loans mr-t30">
                <div>
                    <div className="container-heading text-left mr-t10">My Loans</div>
                    <div className="tabContainer">
                        <div className="tabTile" onClick={() => changeTab(true)}>
                            <p><strong>Current Loans</strong></p>
                        </div>
                        <div className="tabTile active" onClick={() => changeTab(false)}>
                            <p><strong>Paid Off Loans</strong></p>
                        </div>
                    </div>
                    <div className="tile pd-15">
                        <div className="loan-text desktop mr-b10">Loan Summary</div>
                        <div className="display-flex loan-summary">
                            <div style={{ flexGrow: 1 }} className="mr-r20 principal">
                                <div className="text-center loan-heading ls-4 fw-bold">PRINCIPAL</div>
                                <div className="display-flex mr-t15">
                                    <div style={{ flexGrow: paidFlex }} className="paid-text-principal text-center pd-10">
                                        <div className="f-10 desktop">Paid</div>
                                        <div className="f-14 fw-bold">${principalPaidRef.current}</div>
                                    </div>
                                    <div style={{ flexGrow: paidFlexRemaining }} className="remaining-text paid-remaining text-center">
                                        <div className="f-10 desktop">Remaining</div>
                                        <div className="f-14 fw-bold">${principalRemainingRef.current}</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ flexGrow: 0.4 }}>
                                <div style={{ color: '#E0314E' }} className="text-center loan-heading ls-4 fw-bold">INTEREST</div>
                                <div className="display-flex mr-t15">
                                    <div style={{ flexGrow: interestPaidFlex }} className="paid-text-interest text-center pd-10">
                                        <div className="f-10 desktop">Paid</div>
                                        <div className="f-14 fw-bold">${interestPaidRef.current}</div>
                                    </div>
                                    <div style={{ flexGrow: interestRemainingFlex, color: '#E0314E' }} className="remaining-text text-center pd-10">
                                        <div className="f-10 desktop">Remaining</div>
                                        <div className="f-14 fw-bold">${interestRemainingRef.current}</div>
                                        <div className="f-12 desktop">(estimated)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="loan-table mr-t20">
                            <div className="loan-table-head display-flex border-bc8 pd-b10">
                                <div style={{ width: '35%' }}>Loan Provider/Loan</div>
                                <div style={{ width: '12.5%' }}>Balance</div>
                                <div style={{ width: '12.5%' }}>Interest %</div>
                                <div style={{ width: '15%' }} >Progress %</div>
                                <div style={{ width: '25%' }}></div>
                            </div>
                            {paidLoans.length > 0 ? <UserLoanStats data={paidLoans} isMobile={false} /> : <p>Test</p>}
                            <div className="loan-table-head display-flex pd-t10 pd-b10">
                                <div style={{ width: '35%' }}>Total / Average</div>
                                <div style={{ width: '12.5%' }}>${totalBalance}</div>
                                <div style={{ width: '12.5%' }}>{avgInterestRate.current}%</div>
                                <div style={{ width: '15%' }} >${principalPaidRef.current} / ${totalDebt}</div>
                            </div>
                        </div>
                        <div className="loan-table-mobile">
                            <div className="loan-table-head display-flex border-bc8 mr-t20 pd-b10">
                                <div style={{ width: '50%' }}>Loan Provider</div>
                                <div style={{ width: '30%' }}>Balance</div>
                                <div style={{ width: '20%' }}>Interest</div>
                            </div>
                            {paidLoans.length > 0 ? <UserLoanStats data={paidLoans} isMobile={true} /> : <p>Test</p>}
                            <div className="loan-table-head display-flex pd-t10 pd-b10">
                                <div style={{ width: '50%' }}>Total / Average</div>
                                <div style={{ width: '30%' }}>${totalBalance}</div>
                                <div style={{ width: '20%' }}>{avgInterestRate.current}%</div>
                            </div>
                            <div className="mr-t20">
                                <button style={{ width: '100%', padding: '20px' }} className="bt bt-primary">Make Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        ); 
    }
}

export default MyLoans;


