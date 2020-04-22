import React from 'react';

const Input = ({ label = '', fieldName = '', value = 0, setValue, type = 'text', editable = true, placeholder = '' }) => {
    return (
        <div className="input-group mb-2">
            <div className="input-group-prepend">
                <span className="input-group-text">{label}</span>
            </div>
            {editable
                ?
                <input onChange={e => setValue(fieldName, e.target.value)} value={value} type={type}
                    className="form-control text-right" aria-describedby={fieldName} placeholder={placeholder} />
                :
                <span className="form-control text-right">{value}</span>
            }
        </div>
    );
}

export default Input;
