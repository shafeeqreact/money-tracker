import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CoinbaseSteps from '../static/coinbaseSteps';
import CoinbaseProSteps from '../static/coinbaseProSteps';
import BittrexSteps from '../static/bittrexSteps';
import CoinbaseProTransfersSteps from '../static/coinbaseProTransfersSteps';

const FileUpload = () => {
    const [file, setFile] = useState({});
    const [uploadedFile, setUploadedFile] = useState({});
    const [fileType, setFileType] = useState('');
    const [steps, setSteps] = useState(null);

    useEffect(() => {
        switch (fileType) {
            case 'coinbase':
                setSteps(<CoinbaseSteps />);
                break;
            case 'coinbase-pro-fills':
                setSteps(<CoinbaseProSteps />);
                break;
            case 'coinbase-pro-transfers':
                setSteps(<CoinbaseProTransfersSteps />);
                break;
            case 'bittrex-orders':
                setSteps(<BittrexSteps />);
                break;
            default:
                setSteps(null);
        }
    }, [fileType])

    const handleUpload = async () => {
        if (file !== '') {
            const formData = new FormData();
            formData.append('file', file);

            try {
                console.log('fileUpload.js formData - ', formData)
                const resp = await axios.post(`/api/investment/crypto/upload/${fileType}`, formData, {
                    headers: {
                        'Content-Type': 'miltipart/form-data'
                    }
                })
                console.log('resp - ', resp)
                if (resp.status !== 200) {
                    setUploadedFile({ error: resp.msg })
                } else {
                    setFile({})
                    setUploadedFile(resp.data)
                }
            } catch (err) {
                console.log('error - ', err)
                setUploadedFile({ error: err })
            }
        } else {
            console.log('choose file');
        }
    }

    return (
        <>
            <h5>Upload File:</h5>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="inputGroupSelect01">Type</label>
                </div>
                <select value={fileType} onChange={e => setFileType(e.target.value)} className="custom-select" id="inputGroupSelect01" style={{ width: '10%' }}>
                    <option value="">Choose...</option>
                    <option value="coinbase">Coinbase</option>
                    <option value="coinbase-pro-fills">Coinbase Pro - Fills</option>
                    <option value="coinbase-pro-transfers">Coinbase Pro - Transfers</option>
                    <option value="bittrex-orders">Bittrex - Orders</option>
                    <option value="bittrex-transfers">Bittrex - Transfers</option>
                    <option value="history">History</option>
                </select>
                <div className="custom-file ml-1">
                    <input onChange={(e) => setFile(e.target.files[0])}
                        type="file" className="custom-file-input" id="inputGroupFile02" />
                    <label className="custom-file-label" htmlFor="inputGroupFile02" aria-describedby="inputGroupFileAddon02">
                        {file ? file.name : 'Choose file'}
                    </label>
                </div>
                <div className="input-group-append ml-1">
                    <span onClick={handleUpload} className="input-group-text" id="inputGroupFileAddon02">Upload</span>
                </div>
            </div>
            <div className="mb-3">
                <span>{uploadedFile.error ? `Upload failed - ${uploadedFile.error}` :
                    uploadedFile.fileName ? `${uploadedFile.fileName} successfully uploaded.` : ''}</span>
            </div>
            {steps}
        </>
    );
}

export default FileUpload;