import React from 'react';
// Or import the input component
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './Calendar.scss';

function Calendar(props) {
    const {data} = props;
    const loanData = data.item;
    const calendarStyles = [
        {
            color: 'white',
            backgroundColor: '#288B6A',
            backgroundClip: 'content-box'
        },
        {
            color: 'black',
            backgroundColor: '#9B9B9B',
            backgroundClip: 'content-box'
        },
        {
            color: 'white',
            backgroundColor: '#232931',
            backgroundClip: 'content-box'
        }
    ]

    // function to sort loans by institution name
    function compare (a, b) {
        const intA = a.servicer_name.toUpperCase();
        const intB = b.servicer_name.toUpperCase();
          
        let comparison = 0;
        if (intA > intB) {
            comparison = 1;
        } else if (intA < intB) {
            comparison = -1;
        };
        return comparison;
    }
    // adjust timezone to Chicago
    function changeTimezone(date, tz) {
        var invdate = new Date(date.toLocaleString('en-US', {
          timeZone: tz
        }));
        var diff = date.getTime() - invdate.getTime();
        return new Date(date.getTime() - diff); 
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
    
    const loans = loanData.student_loan_info;
    const sortedLoanData = loans.sort(compare);
    const brokenSortedLoanData = sortedLoanData.groupBy("servicer_id");
    let loanDates = {};
    let loanDateStyles = {};
    let loanLenderNames = [];
    let array = [];
    let formattedLoanDate = "";
    let total = 0;

    for (let i = 0; i < brokenSortedLoanData.length; i++) {
        loanDates[i] = changeTimezone(new Date(brokenSortedLoanData[i][0]["next_payment_date"]), "UTC");
        let style = {};
        if (i < 3) {
            style = calendarStyles[i];
        } else {
            style = calendarStyles[i % 3];
        };
        formattedLoanDate = new Date(brokenSortedLoanData[i][0]["next_payment_date"]).toLocaleDateString('en-US', {timeZone: 'UTC'});
        if(formattedLoanDate.valueOf()==="Invalid Date"){
            formattedLoanDate = brokenSortedLoanData[i][0]["next_payment_date"];
        }
        //sums monthly payments if multiple loans under one provider
        if(brokenSortedLoanData[i].length > 1) {
            for (let a = 0; a < brokenSortedLoanData[i].length; a++) {
                total += brokenSortedLoanData[i][a]["monthly_payment"];
            };
        } else {
            total = brokenSortedLoanData[i][0]["monthly_payment"];
        };
        let newTotal = total.toFixed(2);
        loanDateStyles[i] = style;
        loanLenderNames.push(brokenSortedLoanData[i][0]["servicer_name"]);
        array.push(
            <div key={i} className="table display-flex pd-10 justify-content-space-between">
                <div className="display-flex" style={{ width: '40%' }}>
                    <div style={{ backgroundColor: style.backgroundColor }} className="dot mr-r10"></div>
                    <div>{loanLenderNames[i]}</div>
                </div>
                {brokenSortedLoanData[i][0]["next_payment_date"] === "Under Forbearance" ? <div style={{ width: '30%' }}></div> : <div style={{ width: '30%' }}>${newTotal}</div> }
                <div style={{ width: '30%' }}>{formattedLoanDate}</div>
            </div>
        )
    }

    return (
        <div className="alumsum-calender mr-t30">
            <div className="container-heading text-left mr-t10">Calendar</div>
            <div className="tile pd-15">
                <div className="display-flex justify-content-space-between flex-wrap">
                    <div style={{ flexGrow: 1 }} className="mr-r20">
                        {/* <Calendar calendarType="US" allowPartialRange="true" value={[new Date(2021, 1, 2), new Date(2021, 1, 5)]} /> */}
                        <DayPicker
                            month={new Date()}
                            modifiers={loanDates}
                            modifiersStyles={loanDateStyles}
                        />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                        <div className="table table-head display-flex border-bc8 pd-10">
                            <div style={{ width: '40%' }}>Provider</div>
                            <div style={{ width: '30%' }}>Amount</div>
                            <div style={{ width: '30%' }}>Due Date</div>
                        </div>
                        {array}
                        <div className="mr-t20">
                            <button style={{ width: '100%', padding: '20px' }} className="btn btn-dashboard btn-secondary">Set Reminders</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default Calendar;
