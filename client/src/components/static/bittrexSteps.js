import React from 'react';

const BittrexSteps = () => {
    return (
        <div className="mb-3">
            <p><h6>Bittrex CSV import</h6></p>
            <ol>
                <li>Login into your Bittrex Account</li>
                <li>Open "Orders" over the top navigation (<a href="https://bittrex.com/History" target="_blank">https://bittrex.com/History</a>)</li>
                <li>Click on the "Download History" button at the top of the "MY ORDER HISTORY" table.</li>
                <li>Save the CSV file on your PC and upload it here</li>
            </ol>
            <p className="text-danger">Note: Please note, that the Bittrex export data does not include any deposits or withdrawals.<br />
                If you have deposited or withdrawn currencies from or to Bittrex, please enter them manually on the Enter Coins page.</p>
        </div>
    );
}

export default BittrexSteps;