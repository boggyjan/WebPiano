const KEYBOARD_FREQUENCY_DATA = [16.352, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125, 24.500, 25.957, 27.500, 29.135, 30.868, 32.703, 34.648, 36.708, 38.891, 41.203, 43.654, 46.249, 48.999, 51.913, 55.000, 58.270, 61.735, 65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.83, 110.00, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.5, 1108.7, 1174.7, 1244.5, 1318.5, 1396.9, 1480.0, 1568.0, 1661.2, 1760.0, 1864.7, 1975.5, 2093.0, 2217.5, 2349.3, 2489.0, 2637.0, 2793.8, 2960.0, 3136.0, 3322.4, 3520.0, 3729.3, 3951.1, 4186.0, 4434.9, 4698.6, 4978.0, 5274.0, 5587.7, 5919.9, 6271.9, 6644.9, 7040.0, 7458.6, 7902.1, 8372.0, 8869.8, 9397.3, 9956.1, 10548, 11175, 11840, 12544, 13290, 14080, 14917, 15804];
const KEYBOARD_LABEL = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function fadecurve(start, end) {
  var count = 100;
  var curve = new Float32Array(count + 1);
  var each = (end - start) / count;
  for (var i = 0; i <= count; i++) {
    curve[i] = start + each * i;
  }
  return curve;
}

class ACItem {
  constructor(ac) {
    this.context = ac;
    this.gainNode = this.context.createGain();
    this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime);
    this.gainNode.connect(this.context.destination);
    this.fadeinInterval = 0;
    this.stopInterval = 0;
  }

  startSound(freq) {
    this.freq = freq;
    this.sustainTime = $('.sustain-time').val();

    if(this.oscillator) {
      clearInterval(this.stopInterval);
      this.oscillator.disconnect();
    }
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = $('.tone-type').val();
    this.oscillator.connect(this.gainNode);
    this.oscillator.start(this.context.currentTime);
    this.oscillator.frequency.setValueAtTime(this.freq, this.context.currentTime);
    this.gainNode.gain.cancelScheduledValues(0);
    this.gainNode.gain.value = 0;
    this.gainNode.gain.setValueCurveAtTime(fadecurve(0, 1), this.context.currentTime, $('.release-time').val() / 1000);
    this.fadeinInterval = setTimeout(()=>{
      this.gainNode.gain.cancelScheduledValues(0);
      this.gainNode.gain.setValueCurveAtTime(fadecurve(1, 0), this.context.currentTime, this.sustainTime / 1000);
    }, $('.release-time').val()); 
  }

  stopSound() {
    clearInterval(this.fadeinInterval);
    var gain = this.gainNode.gain.value;
    this.reverbTime = $('.reverb-time').val();
    this.gainNode.gain.cancelScheduledValues(0);
    this.gainNode.gain.setValueCurveAtTime(fadecurve(gain, 0), this.context.currentTime, this.reverbTime / 1000);
    this.stopInterval = setTimeout(()=>{
      if (this.oscillator) {
        this.oscillator.stop(this.context.currentTime);
        this.oscillator.disconnect();
      }
    }, this.reverbTime);
    
  }
}

$(function() {
  var AC = new (window.AudioContext || window.webkitAudioContext);
  var ACData = [];
  var ACDataLength = 5; //safari max supoort 4 AudioContext
  var CurrentACDataIndex = 0;

  function renderKeyboard(freqData, label, container) {
    for (var i = 0; i < freqData.length; i++) {
      container.append(`<div class="key-item" data-freq="${freqData[i]}">${label[i%12]}</div>`);
    }
  }

  function getFreq(e) {
    if ($(e.target).data('freq')) {
      return $(e.target).data('freq');
    } else {
      return null;
    }
  }

  function startSound(e) {
    var freq = getFreq(e);

    if (freq) {
      ACData[CurrentACDataIndex].startSound(getFreq(e));
      $(e.target).data('acindex', CurrentACDataIndex);
      CurrentACDataIndex = CurrentACDataIndex + 1 < ACData.length ? CurrentACDataIndex + 1 : 0;
    }
  }

  function stopSound(e) {
    if (!isNaN($(e.target).data('acindex'))) {
      ACData[$(e.target).data('acindex')].stopSound();
    }
  }

  function init() {
    for(var i = 0; i < ACDataLength; i++) {
      var acItem = new ACItem(AC);
      ACData.push(acItem);
    }

    renderKeyboard(KEYBOARD_FREQUENCY_DATA, KEYBOARD_LABEL, $('.keyboard'));

    let centerCPosition = $('.key-item').eq(12 * 4).position().left - $('html, body').width() / 2;
    $('.keyboard-container').scrollLeft(centerCPosition);

    $(document)
    .on('mousedown touchstart', function(e) {

      if ($(e.target).hasClass('key-item')) {
        startSound(e);

        $(document)
        .on('mouseover', startSound)
        .on('mouseout', stopSound);
      }
    })
    .on('mouseup touchend', function(e) {
      stopSound(e);
      
      $(document)
      .off('mouseover', startSound)
      .off('mouseout', stopSound);

      if ($(e.target).hasClass('key-item')) {
        e.preventDefault();
      }
    });
  }

  init();
});
