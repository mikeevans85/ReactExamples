import React from 'react';
import {Link} from 'react-router-dom';
import './SaveMoney.scss';

function SaveMoney() {
    return (
        <div className="save-money mr-t30 display-flex">
            <div className="save-money-component">
                <div className="container-heading text-left mr-t10">Save Money By Refinancing</div>
                <div className="tile pd-15">
                    <div className="display-flex flex-wrap">
                        <div className="flex1">Refinancing your student loans allows you to consolidate your student loan into a new, <span style={{ fontWeight: 'bold' }}>single student loan</span> with a lower interest rate.</div>
                        <div className="flex1 text-center">
                            <img src={process.env.PUBLIC_URL + '/svg/SaveMoney.svg'} alt="save money" />
                        </div>
                    </div>
                    <div className="mr-t20">
                        <Link to="/alumsum/dashboard/refinance"><button style={{ width: '100%', padding: '20px' }} className="bt bt-primary">Calculate My New Payment</button></Link>
                    </div>
                </div>
            </div>
            {/* <div className="save-money-component">
                <div className="container-heading text-left mr-t10">Personalize Your Experience</div>
                <div className="tile pd-15">
                    <div className="display-flex flex-wrap">
                        <div className="flex1">
                            <div>Looking for more personalized recommendations?</div>
                            <div className="mr-t15">Complete your 5 minute survey to customized your alumsum experience.</div>
                        </div>
                        <div className="flex1 text-center">
                            <img src={process.env.PUBLIC_URL + '/svg/CardBoard.svg'} alt="save money" />
                        </div>
                    </div>
                    <div className="mr-t20">
                        <button style={{ width: '100%', padding: '20px' }} className="bt bt-primary">Take 5-min Survey</button>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default SaveMoney;
