

export function calcMintues(start) {
    const MIN = 1000*60;
    const now = Date.now();
    const diff = ( now - start ) /MIN;
    return parseInt(diff);
}

export function convertDollars(val){
    return val * 73;
}
export function convertRublesToDollars(val){
    return val * 0.014;
}

export function getNewCost(val){
    return convertRublesToDollars(val) * 1.25
}

export function timeInRussiaNow() {

  // create Date object for current location
  var d = new Date();

  // convert to msec
  // add local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc + (3600000*3));

  // return time as a string
  return  nd
}
export function timeSince(date) {
    var seconds = Math.floor((timeInRussiaNow() - new Date(date)) / 1000);

    var interval = Math.floor(seconds / 31536000);
  
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " يوم";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " ساعه";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " دقيقة";
    }
    return Math.floor(seconds) + " ثانيه";
  }
  export function timeLeft(date){
    var seconds = Math.floor((new Date(date) - timeInRussiaNow()) / 1000);
    var interval = Math.floor(seconds / 31536000);
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " يوم";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " ساعه";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " دقيقة";
    }
    return Math.floor(seconds) + " ثانيه";
  }