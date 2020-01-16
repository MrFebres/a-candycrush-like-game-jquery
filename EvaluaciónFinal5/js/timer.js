

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;


        if (--timer < 0) {
            timer = duration;
        }
        if(minutes+seconds=='0000'){
            Juego.finJuego();
        }
    }, 1000);
}

function timerUp() {
    var fiveMinutes = 60 * parseInt(2),
        display = document.querySelector('#timer')
    var time = startTimer(fiveMinutes, display);
};
