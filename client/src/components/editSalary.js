import React from 'react';

const EditSalary = (props) => {
    return (
        <div>Edit Salary = {props.match.params.id} </div>
    );
}

export default EditSalary;