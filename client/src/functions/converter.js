const converter = {
    convertToTimer: (dateStr) => {
        let timeLeft = (new Date(dateStr)).getTime() - (new Date()).getTime();
        let hour = Math.floor(timeLeft/1000/60/60);
        let min = Math.floor((timeLeft - hour*60*60*1000)/1000/60);
        let sec = Math.floor((timeLeft - hour*3600000 - min*60000)/1000);
        if(hour > 0){
        hour = (hour>9)?hour:`0${hour}`;
        min = (min>9)?min:`0${min}`;
        sec = (sec>9)?sec:`0${sec}`;
        } else {
            hour = '00';
            min = '00';
            sec= '00';
        }
        return (hour+':'+min+':'+sec);
    },
    displayAuctionTime: (dateStr) => {
        return dateStr.substring(0,10)+' '+dateStr.substring(11,19);
    },
    checkEndedForSameCateItem: (dateStr) => {
        let timeLeft = (new Date(dateStr)).getTime() - (new Date()).getTime();
        if(timeLeft > 0){
            return false;
        }
        else return true;
    }
}

//console.log(converter.convertToTimer('2020-10-30T17:00:00.000Z'));
export default converter;