var names = ['Little Elephant', 'Snake', 'Alex', 'Bhadwa', 'Gendew', 'Shoot Ka', 'Leyendu'];


function naamNikaalo(){
    return names[Math.floor(Math.random() * 7)];
}

function dateNikaalo(){
var currentTime = new Date();
var month = currentTime.getMonth() + 1;
var day = currentTime.getDate();
var year = currentTime.getFullYear();
var date = day + "/" + month + "/" + year;

var ghante = currentTime.getHours();
var mints = currentTime.getMinutes();

date = date + `  ${ghante}:${mints}`;

    return date;
}



module.exports.naamNikaalo = naamNikaalo;
module.exports.dateNikaalo = dateNikaalo;