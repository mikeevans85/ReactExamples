import React, { useEffect, useState } from 'react';
import Slider from 'react-input-slider';
import { Line, LineChart, ResponsiveContainer, Text, XAxis, YAxis } from 'recharts';
import './PayOff.scss';

function PayOff(props) {
    const [newCalculatedAge, setNewCalculatedAge] = useState(0);
    const value = props.loans;
    let sliderValue = (props.sliderValue + 1);
    let childSliderState = props.sliderValue * 10;

    //function for calculating user age
    function calculateAge(d1, d2) {        
        var years = (d2.getFullYear() - d1.getFullYear());
    
        if ((d2.getMonth() < d1.getMonth() ||
            d2.getMonth() === d1.getMonth()) && d2.getDate() < d1.getDate()) {
            years--;
        }
        return years;
    };

    // Calculating variables from props
    const userInfo = value.userInfo;
    //for user age
    const userDob = new Date(userInfo[0].userDob);
    let today = new Date();
    const userAge = calculateAge(userDob, today);
    //for age of user at loans payoff
    const months = parseInt(value.item.loan_aggregate.estimated_months_to_payoff);
    const payoffDate = new Date(today.setMonth(today.getMonth()+months));
    const calculatedAge = calculateAge(userDob, payoffDate);

    const loanInfo = value.item;
    const remainingBalance = parseInt(loanInfo.loan_aggregate.total_loan_debt);
    const estMonthPayment = remainingBalance / months;
    const newMonthPayment = estMonthPayment + childSliderState;
    const newMonths = parseInt(remainingBalance / newMonthPayment);
    today = new Date();
    const newPayoffDate = new Date(today.setMonth(today.getMonth()+newMonths));
    const newCalculated = calculateAge(userDob, newPayoffDate);

    useEffect(() => {
        setNewCalculatedAge(newCalculated);
    }, [newCalculated])

    const midGreenDot = (userAge + newCalculatedAge) / 2;
    const midBlackDot = (userAge + calculatedAge) / 2;

    //creating and setting variables for line graph
    const data = [
        {
            "age": userAge,
            "uv": remainingBalance
        },
        {
            "age": midGreenDot,
            "uv": remainingBalance / 1.75
        },
        {
            "age": newCalculatedAge,
            "uv": 0
        }
    ]

    const data2 = [
        {
            "age": userAge,
            "pv": remainingBalance
        },
        {
            "age": midBlackDot,
            "pv": remainingBalance / 1.25
        },
        {
            "age": calculatedAge,
            "pv": 0
        }

    ]
    const xMin = parseInt((data[0]["age"]));
    const xMax = parseInt((data2[2]["age"] + 5));
    const yMax = (remainingBalance + (remainingBalance * 0.2));
    const highDataPoint = data2[0]["pv"];

    class CurrentTrackLabel extends React.Component{
        render() {
            const {x, y, value} = this.props;
            if (value === highDataPoint) {
                return (
                    <Text x={x} y={y} dx={-65} fontSize={20}>{`$${(value / 1000).toFixed(1)}k`}</Text>
                );
            } else if (value === 0) {
                return (
                    <Text x={x} y={y} dy={30} dx={-10} fontSize={20}>{calculatedAge}</Text>
                );
            }

            return null;
        }
    }

    let improvedTrackLabel =({ x, y, value }) => {
        let itL = '';
        if (value === 0) {
            itL = <Text x={x} y={y} dy={30} dx={-10} fill="#4eCCa3" fontSize={20}>{newCalculatedAge}</Text>
            return (
                itL
            )
        }

        return null;
    };

    let itLabel = improvedTrackLabel;

    function handleSliderChange(y) {
        // setChildSliderState(y);
        props.onSliderChange(y);
    }

    return (
        <div className="pay-off">
            <div className="container-heading text-left mr-t10">Payoff Timeline</div>
            <div className="tile payoffTile pd-15">
                <div className="flex-container payoff-container">
                    <div className="drag-text-mobile">Drag the slider to see how increasing your minimum payment shortens your payoff timeline.</div>
                    <div className="payment display-flex">
                        <div className="extra-text mr-b10">${childSliderState}</div>
                        <div className="paymentSlider">
                            <Slider
                                axis="y"
                                ystep="5"
                                yreverse="true"
                                valueLabelDisplay="auto"
                                y={sliderValue} onChange={({ y }) => handleSliderChange(y)}
                                styles={{
                                    track: {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    active: {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    thumb: {
                                        width: 60,
                                        height: 20,
                                        opacity: 1,
                                        border: '2px solid #FFFFFF',
                                        boxShadow: '-5px 0 10px 0 rgba(0,0,0,0.15)',
                                        borderRadius: '11px',
                                        background: '#232931',
                                        fontSize: '10px',
                                        color: '#ffff',
                                        textAlign: 'center',
                                        paddingTop: '2px',
                                        fontWeight: 700
                                    }
                                }}
                            />
                        </div>
                        <div className="paymentSliderMobile">
                            <Slider
                                axis="x"
                                xstep="5"
                                // xreverse="false"
                                valueLabelDisplay="auto"
                                x={sliderValue} onChange={({ x }) => handleSliderChange(x)}
                                styles={{
                                    track: {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    active: {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    thumb: {
                                        width: 60,
                                        height: 20,
                                        opacity: 1,
                                        border: '2px solid #FFFFFF',
                                        boxShadow: '-5px 0 10px 0 rgba(0,0,0,0.15)',
                                        borderRadius: '11px',
                                        background: '#232931',
                                        fontSize: '10px',
                                        color: '#ffff',
                                        textAlign: 'center',
                                        paddingTop: '2px',
                                        fontWeight: 700
                                    }
                                }}
                            />
                        </div>
                        <div className="drag-text mr-t20">Drag the slider to see how increasing your minimum payment shortens your payoff timeline.</div>
                    </div>
                    <div className="paymentChart">
                        <div className="line-graph display-flex justify-content-space-between mr-b10">
                            <div className="text-center remain-graph">
                                <div>Remaining</div>
                                <div>Balance</div>
                            </div>
                            <div className="improved display-flex">
                                <div className="dot"></div>
                                <div>Improved Track</div>
                            </div>
                            <div className="current-text display-flex">
                                <div className="dot"></div>
                                <div>Current Track</div>
                            </div>
                        </div>
                        <ResponsiveContainer height="80%">
                            <LineChart width={400} height={250} data={data}>
                                <XAxis key={childSliderState} type="number" dataKey="age" tick={{ fill: '#E0DFDF'}}domain={[xMin, xMax]} />
                                <YAxis tick={false} domain={[0, yMax]}/>
                                <Line type="monotoneX" data={data} dataKey="uv" isAnimationActive={false} stroke="#4eCCa3" strokeDashArray="4" label={itLabel}/>
                                <Line type="monotoneY" data={data2} dataKey="pv" isAnimationActive={false} stroke="#000" label={<CurrentTrackLabel />}/>
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="age">Your age</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PayOff;

