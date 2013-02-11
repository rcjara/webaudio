//Create a toplevel audio context
var audioCtx;
if (typeof AudioContext !== "undefined") {
    audioCtx = new AudioContext();
    console.log("Using AudioContext");
} else if (typeof webkitAudioContext !== "undefined") {
    audioCtx = new webkitAudioContext();
    console.log("Using webkitAudioContext");
} else {
    throw new Error('AudioContext not supported. :(');
}

var sound = (function() {
  var sources        = {},
      sounds_loaded  = 0,
      sounds_to_load = 0,
      done_loading   = function() {};

  var echo = function(text) {
    $('body').append($('<p>' + text + '</p>'));
  };

  var echo_test = function() {
    echo('Echo test');
    if (audioCtx !== undefined) {
      echo('Audio context exists');
    }
  };

  var multi_sound_test = function() {
    echo('starting multi_sound_test');

    loadSound('beep', 'audio/beep-1.mp3');
    loadSound('hello', 'http://thelab.thingsinjars.com/web-audio-tutorial/hello.mp3');

    done_loading = function() {
      play('hello');
      play('beep');
    }
  };

  var play = function(ident) {
    sources[ident].noteOn(audioCtx.currentTime);
  }

  var loadSound = function(ident, url) {
    echo('starting loadSound');
    sounds_to_load++;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      var audioData = request.response,
          source    = audioCtx.createBufferSource();
          buffer    = audioCtx.createBuffer(audioData, true/*make mono*/);
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      sources[ident] = source;

      sounds_loaded++;

      echo('ident: ' + ident + 'sounds_loaded: ' + sounds_loaded);
      if (sounds_loaded >= sounds_to_load) {
        done_loading();
      }
    }

    request.send();
  };

  var sound_test = function() {
    console.log('starting sound test');
    var request = new XMLHttpRequest();
    request.open("GET", 'audio/beep-1.mp3', true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function() {
        echo('loaded');
        var audioData = request.response,
            soundSource = audioCtx.createBufferSource();
            soundBuffer = audioCtx.createBuffer(audioData, true/*make mono*/);

        soundSource.buffer = soundBuffer;
        soundSource.connect(audioCtx.destination);
        soundSource.noteOn(audioCtx.currentTime);
    };

    request.send();
  };

  return {
    echo_test: echo_test,
    sound_test: sound_test,
    multi_sound_test: multi_sound_test
  }
})();
