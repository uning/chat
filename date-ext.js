var monthNames = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                     'August', 'September', 'Oktober', 'November', 'Dezember' ];
var monthNamesShort = [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul',
                        'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ];

function padDatePart(part) {
  return (part < 10 ? '0' + part : part);
}

exports.toReadableDate = function(inputDate, formatType) {
  if (inputDate.constructor != (new Date).constructor)
    return '';
  
  switch (formatType) {
    case 'fullmonth':
      var year = inputDate.getFullYear();
      var month = monthNames[inputDate.getMonth()];
      var day = inputDate.getDate();
      return padDatePart(day) + '. ' + month + ' ' + year;
    case 'datestamp':
      var month = inputDate.getMonth() + 1;
      var day = inputDate.getDate();
      var hour = inputDate.getHours();
      var min = inputDate.getMinutes();
      var sec = inputDate.getSeconds();
      return padDatePart(day) + '.' +
        padDatePart(month) + ' @ ' +
        padDatePart(hour) + ':' +
        padDatePart(min) + ':' +
        padDatePart(sec);
    case 'timestamp':
      var hour = inputDate.getHours();
      var min = inputDate.getMinutes();
      var sec = inputDate.getSeconds();
      return padDatePart(hour) + ':' +
        padDatePart(min) + ':' +
        padDatePart(sec);
  }
};

