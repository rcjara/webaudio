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
  var echo = function(text) {
    $('body').append($('<p>' + text + '</p>'));
  };

  var echo_test = function() {
    echo('Echo test');
    if (audioCtx !== undefined) {
      echo('Audio context exists');
    }
  };

  var str2ab = function(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  var request = new XMLHttpRequest();

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
    sound_test: sound_test
  }
})();
