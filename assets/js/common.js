$(function() {

    const KEYBOARD_FREQUENCY_DATA = [16.352,17.324,18.354,19.445,20.602,21.827,23.125,24.500,25.957,27.500,29.135,30.868,32.703,34.648,36.708,38.891,41.203,43.654,46.249,48.999,51.913,55.000,58.270,61.735,65.406,69.296,73.416,77.782,82.407,87.307,92.499,97.999,103.83,110.00,116.54,123.47,130.81,138.59,146.83,155.56,164.81,174.61,185.00,196.00,207.65,220.00,233.08,246.94,261.63,277.18,293.66,311.13,329.63,349.23,369.99,392.00,415.30,440.00,466.16,493.88,523.25,554.37,587.33,622.25,659.26,698.46,739.99,783.99,830.61,880.00,932.33,987.77,1046.5,1108.7,1174.7,1244.5,1318.5,1396.9,1480.0,1568.0,1661.2,1760.0,1864.7,1975.5,2093.0,2217.5,2349.3,2489.0,2637.0,2793.8,2960.0,3136.0,3322.4,3520.0,3729.3,3951.1,4186.0,4434.9,4698.6,4978.0,5274.0,5587.7,5919.9,6271.9,6644.9,7040.0,7458.6,7902.1,8372.0,8869.8,9397.3,9956.1,10548,11175,11840,12544,13290,14080,14917,15804];
    const KEYBOARD_LABEL = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    
    var context = new (window.AudioContext || window.webkitAudioContext),
        gain = .5,
        gainNode = context.createGain(),
        mousedown = false,
        oscillator = null;

    function renderKeyboard(freqData, label, container) {
        for (var i = 0; i < freqData.length; i++) {
            container.append(`<div class="key-item" data-freq="${freqData[i]}">${label[i%12]}</div>`);
        }
    }

    function getFreq(e) {
        if ($(e.target).data('freq')) {
            return $(e.target).data('freq');
        }
        else {
            return 0;
        }
    }

    function startSound(e) {
        if (mousedown) stopSound();
        mousedown = true;
        oscillator = context.createOscillator()
        oscillator.type = 'sine';
	oscillator.frequency.setTargetAtTime(getFreq(e), context.currentTime, 0.001);
        oscillator.connect(gainNode);
        oscillator.start(context.currentTime);
    }

    function stopSound() {
        mousedown = false;

        if (oscillator) {
            oscillator.stop(context.currentTime);
            oscillator.disconnect();
        }
    }

    function changeFreq(e) {
        if (mousedown && oscillator) {
            oscillator.frequency.setTargetAtTime(getFreq(e), context.currentTime , 0.001);
        }
    }

    function init() {
        renderKeyboard(KEYBOARD_FREQUENCY_DATA, KEYBOARD_LABEL, $('.keyboard'));
        

        var centerCPosition = $('.key-item').eq(12 * 4).position().left - $('html, body').width() / 2;
        $('.keyboard-container').scrollLeft(centerCPosition);


        gainNode.connect(context.destination);

        document.body.addEventListener('mousedown', function (e) {
            startSound(e);
        });

        document.body.addEventListener('touchstart', function (e) {
            startSound(e);
        });

        document.body.addEventListener('mouseup', function () {
            stopSound();
        });

        document.body.addEventListener('touchend', function () {
            stopSound();
        });

        document.body.addEventListener('mousemove', function (e) {
            changeFreq(e);
        });

        document.body.addEventListener('touchmove', function (e) {
            changeFreq(e);
        });
    }
    
    init();
});
