import React from 'react';

const CoinbaseProSteps = () => {
    return (
        <div className="mb-3">
            <p><h6>Coinbase Pro CSV import</h6></p>
            <ol>
                <li>Log in into your Coinbase Pro account, hover the navigation icon and click on My Orders and select Filled (<a href="https://pro.coinbase.com/orders/filled/" target="_blank">https://pro.coinbase.com/orders/filled/</a>)</li>
                <li>Hit Statements</li>
                <li>Select Product orders you want to import</li>
                <li>Choose a Custom Time Range, select CSV instead of PDF and click on Generate</li>
                <li>You will receive your CSV file by email. Save it to your PC and upload it here</li>
            </ol>
        </div>
    );
}

export default CoinbaseProSteps;