// https://github.com/mmckegg/adsr begin

function ADSR(audioContext) {
  var node = audioContext.createGain()

  var voltage = node._voltage = getVoltage(audioContext)
  var value = scale(voltage)
  var startValue = scale(voltage)
  var endValue = scale(voltage)

  node._startAmount = scale(startValue)
  node._endAmount = scale(endValue)

  node._multiplier = scale(value)
  node._multiplier.connect(node)
  node._startAmount.connect(node)
  node._endAmount.connect(node)

  node.value = value.gain
  node.startValue = startValue.gain
  node.endValue = endValue.gain

  node.startValue.value = 0
  node.endValue.value = 0

  Object.defineProperties(node, props)
  return node
}

var props = {

  attack: { value: 0, writable: true },
  decay: { value: 0, writable: true },
  sustain: { value: 1, writable: true },
  release: {value: 0, writable: true },

  getReleaseDuration: {
    value: function() {
      return this.release
    }
  },

  start: {
    value: function(at) {
      var target = this._multiplier.gain
      var startAmount = this._startAmount.gain
      var endAmount = this._endAmount.gain

      this._voltage.start(at)
      this._decayFrom = this._decayFrom = at+this.attack
      this._startedAt = at

      var sustain = this.sustain

      target.cancelScheduledValues(at)
      startAmount.cancelScheduledValues(at)
      endAmount.cancelScheduledValues(at)

      endAmount.setValueAtTime(0, at)

      if (this.attack){
        target.setValueAtTime(0, at)
        target.linearRampToValueAtTime(1, at + this.attack)

        startAmount.setValueAtTime(1, at)
        startAmount.linearRampToValueAtTime(0, at + this.attack)
      } else {
        target.setValueAtTime(1, at)
        startAmount.setValueAtTime(0, at)
      }

      if (this.decay){
        target.setTargetAtTime(sustain, this._decayFrom, getTimeConstant(this.decay))
      }
    }
  },

  stop: {
    value: function(at, isTarget){
      if (isTarget){
        at = at - this.release
      }

      var endTime = at + this.release
      if (this.release){

        var target = this._multiplier.gain
        var startAmount = this._startAmount.gain
        var endAmount = this._endAmount.gain

        target.cancelScheduledValues(at)
        startAmount.cancelScheduledValues(at)
        endAmount.cancelScheduledValues(at)

        var expFalloff = getTimeConstant(this.release)

        // truncate attack (required as linearRamp is removed by cancelScheduledValues)
        if (this.attack && at < this._decayFrom){
          var valueAtTime = getValue(0, 1, this._startedAt, this._decayFrom, at)
          target.linearRampToValueAtTime(valueAtTime, at)
          startAmount.linearRampToValueAtTime(1-valueAtTime, at)
          startAmount.setTargetAtTime(0, at, expFalloff)
        }

        endAmount.setTargetAtTime(1, at, expFalloff)
        target.setTargetAtTime(0, at, expFalloff)
      }

      this._voltage.stop(endTime)
      return endTime
    }
  },

  onended: {
    get: function(){
      return this._voltage.onended
    },
    set: function(value){
      this._voltage.onended = value
    }
  }

}

var flat = new Float32Array([1,1])
function getVoltage(context){
  var voltage = context.createBufferSource()
  var buffer = context.createBuffer(1, 2, context.sampleRate)
  buffer.getChannelData(0).set(flat)
  voltage.buffer = buffer
  voltage.loop = true
  return voltage
}

function scale(node){
  var gain = node.context.createGain()
  node.connect(gain)
  return gain
}

function getTimeConstant(time){
  return Math.log(time+1)/Math.log(100)
}

function getValue(start, end, fromTime, toTime, at){
  var difference = end - start
  var time = toTime - fromTime
  var truncateTime = at - fromTime
  var phase = truncateTime / time
  var value = start + phase * difference

  if (value <= start) {
      value = start
  }
  if (value >= end) {
      value = end
  }

  return value
}

// https://github.com/mmckegg/adsr end




class ACItem {
  constructor(ac) {
    this.context = ac;
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
  }

  startSound(freq, type, attack, decay, sustain, release, startValue, endValue) {
    this.gainNode.gain.value = 0;

    this.adsr = ADSR(this.context);
    this.adsr.attack = parseFloat(attack);
    this.adsr.decay = parseFloat(decay);
    this.adsr.sustain = parseFloat(sustain);
    this.adsr.release = parseFloat(release);
    this.adsr.startValue.value = parseFloat(startValue);
    this.adsr.endValue.value = parseFloat(endValue);
    this.adsr.connect(this.gainNode.gain);
    this.adsr.start(this.context.currentTime);

    this.oscillator = this.context.createOscillator();
    this.oscillator.type = type;
    this.oscillator.frequency.setValueAtTime(freq, this.context.currentTime); // ios 直接.value = 的話會滑音
    this.oscillator.connect(this.gainNode);
    this.oscillator.start(this.context.currentTime);
  }

  stopSound() {
    var endTime = this.adsr.stop(this.context.currentTime);
    this.oscillator.stop(endTime);
  }
}

const KEYBOARD_FREQUENCY_DATA = [16.352, 17.324, 18.354, 19.445, 20.602, 21.827, 23.125, 24.500, 25.957, 27.500, 29.135, 30.868, 32.703, 34.648, 36.708, 38.891, 41.203, 43.654, 46.249, 48.999, 51.913, 55.000, 58.270, 61.735, 65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999, 103.83, 110.00, 116.54, 123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94, 261.625, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88, 523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77, 1046.5, 1108.7, 1174.7, 1244.5, 1318.5, 1396.9, 1480.0, 1568.0, 1661.2, 1760.0, 1864.7, 1975.5, 2093.0, 2217.5, 2349.3, 2489.0, 2637.0, 2793.8, 2960.0, 3136.0, 3322.4, 3520.0, 3729.3, 3951.1, 4186.0, 4434.9, 4698.6, 4978.0, 5274.0, 5587.7, 5919.9, 6271.9, 6644.9, 7040.0, 7458.6, 7902.1, 8372.0, 8869.8, 9397.3, 9956.1, 10548, 11175, 11840, 12544, 13290, 14080, 14917, 15804];
const KEYBOARD_LABEL = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

$(function() {
  var audioContext = new (window.AudioContext || window.webkitAudioContext);
  var acData = [];
  var acDataLength = 5;
  var currentAcDataIndex = 0;

  var attack = document.querySelector('.attack');
  var decay = document.querySelector('.decay');
  var sustain = document.querySelector('.sustain');
  var release = document.querySelector('.release');
  var startValue = document.querySelector('.startValue');
  var endValue = document.querySelector('.endValue');
  var toneType = document.querySelector('.tone-type');

  function renderKeyboard(freqData, label, container) {
    for (var i = 0; i < freqData.length; i++) {
      let text = i == 48 ? '◉' : label[i%12];
      container.append(`<div class="key-item" data-freq="${freqData[i]}">${text}</div>`);
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
    if ($(e.target).data('acindex')) return;

    var freq = getFreq(e);

    if (freq) {
      $(e.target).addClass('active');
      var acItem = new ACItem(audioContext);
      acData.push(acItem);
      acItem.startSound(getFreq(e), toneType.value, attack.value, decay.value, sustain.value, release.value, startValue.value, endValue.value);
      $(e.target).data('acindex', currentAcDataIndex);
      currentAcDataIndex++;
    }
  }

  function stopSound(e) {
    if (!isNaN($(e.target).data('acindex'))) {
      $(e.target).removeClass('active');
      acData[$(e.target).data('acindex')].stopSound();
      $(e.target).data('acindex', null);
    }
  }

  function init() {
    $('.effect-container input').knob({
      width: 75,
      height: 75,
      lineCap: 'round',
      thickness: .15,
      step: 0.01,
      fgColor: 'rgba(255,255,255,.8)',
      bgColor: 'rgba(0,0,0,.75)'
    });

    renderKeyboard(KEYBOARD_FREQUENCY_DATA, KEYBOARD_LABEL, $('.keyboard'));

    let middleC = $('.key-item').eq(48);
    let middleCPosition = middleC.position().left - $('html, body').width() / 2;
    $('.keyboard-container').scrollLeft(middleCPosition);

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
