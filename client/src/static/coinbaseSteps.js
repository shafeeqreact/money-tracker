import React from 'react';

const CoinbaseSteps = () => {
    return (
        <div className="mb-3">
            <p><h6>Coinbase CSV import</h6></p>
            <ol>
                <li>Open at coinbase.com the menu option Tools -> Reports (<a href="https://www.coinbase.com/reports" target="_blank">https://www.coinbase.com/reports</a>)</li>
                <li>Click on the Generate Report button. Once your report is ready, download it and upload it here.</li>
            </ol>
            <p className="text-danger">Warning: Please note that the two Coinbase CSVs - Buys,sells and merchant payouts (Transfers-Report) and Transaction history (Transactions-Report) - are not compatible with each other as well as with the API data and will lead to duplicates when imported together.</p>
            <p>Unfortunately Coinbase does not list all trades in one file. You will have to repeat those steps for all your wallets listed in the Account dropdown.</p>
        </div>
    );
}

export default CoinbaseSteps;