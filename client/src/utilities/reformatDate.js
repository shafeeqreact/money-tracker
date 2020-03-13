const reformatDate = (date) => {
    const dateArray = date.split('-');
    const year = dateArray[0];
    const month = dateArray[1];
    const yy = `${year.split('')[2]}${year.split('')[3]}`;
    let mmm = '';
    switch(month){
        case '01': mmm = 'Jan'; break;
        case '02': mmm = 'Feb'; break;
        case '03': mmm = 'Mar'; break;
        case '04': mmm = 'Apr'; break;
        case '05': mmm = 'May'; break;
        case '06': mmm = 'Jun'; break;
        case '07': mmm = 'Jul'; break;
        case '08': mmm = 'Aug'; break;
        case '09': mmm = 'Sep'; break;
        case '10': mmm = 'Oct'; break;
        case '11': mmm = 'Nov'; break;
        case '12': mmm = 'Dec'; break;
        default: mmm = 'N/A'; break;
    }
    return `${mmm}'${yy}`;
}
 
export default reformatDate;
