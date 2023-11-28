import React from 'react';
import './ProgressBar.scss';

function ProgressBar(props) {
    const {percentage} = props;
    return (
        <div className="progressbar pos-rel" style={{ backgroundColor: '#f5f5f5' }}>
            <div data-testid="barcodeProgressBar" style={{ width: `${percentage}%`, top: '-10px', backgroundColor: '#4eCCA3' }} className="progess-active progressbar pos-abs"></div>
        </div>
    );
}

export default ProgressBar;

