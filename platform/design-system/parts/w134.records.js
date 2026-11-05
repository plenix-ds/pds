/* Plenix · local video and separate-audio playback lab. No network or hardware capture. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P;
  async function sample() {
    if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) throw Error('This browser cannot create the local sample.');
    var canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 180;
    var ctx = canvas.getContext('2d'), colors = getComputedStyle(document.body), stream = canvas.captureStream(20), chunks = [];
    var recorder = new MediaRecorder(stream), started = performance.now(), timer;
    function draw() { ctx.fillStyle = colors.backgroundColor; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = colors.color; ctx.fillRect((performance.now() - started) / 30 % canvas.width, 60, 32, 32); }
    try {
      await new Promise(function (resolve, reject) { recorder.ondataavailable = function (event) { if (event.data.size) chunks.push(event.data); }; recorder.onerror = reject; recorder.onstop = resolve; recorder.start(); draw(); timer = setInterval(draw, 50); setTimeout(function () { if (recorder.state !== 'inactive') recorder.stop(); }, 6000); });
    } finally { clearInterval(timer); stream.getTracks().forEach(function (track) { track.stop(); }); }
    var rate = 8000, frames = rate * 8, wav = new ArrayBuffer(44 + frames * 2), data = new DataView(wav);
    function text(at, value) { for (var i = 0; i < value.length; i++) data.setUint8(at + i, value.charCodeAt(i)); }
    text(0, 'RIFF'); data.setUint32(4, 36 + frames * 2, true); text(8, 'WAVE'); text(12, 'fmt '); data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, 1, true); data.setUint32(24, rate, true); data.setUint32(28, rate * 2, true); data.setUint16(32, 2, true); data.setUint16(34, 16, true); text(36, 'data'); data.setUint32(40, frames * 2, true);
    for (var frame = 0; frame < frames; frame++) data.setInt16(44 + frame * 2, Math.sin(frame / rate * Math.PI * 440) * 1600, true);
    return { video: URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })), audio: URL.createObjectURL(new Blob([wav], { type: 'audio/wav' })) };
  }
  function Demo(props) {
    var urls = React.useState(null), busy = React.useState(false), error = React.useState(''), open = React.useState(false), alive = React.useRef(true);
    React.useEffect(function () { alive.current = true; return function () { alive.current = false; }; }, []);
    React.useEffect(function () { return function () { if (urls[0]) { URL.revokeObjectURL(urls[0].video); URL.revokeObjectURL(urls[0].audio); } }; }, [urls[0]]);
    async function create() {
      busy[1](true); error[1]('');
      try { var next = await sample(); if (alive.current) urls[1](next); else { URL.revokeObjectURL(next.video); URL.revokeObjectURL(next.audio); } }
      catch (reason) { if (alive.current) error[1]('Could not create the sample. Try a browser with MediaRecorder support.'); }
      finally { if (alive.current) busy[1](false); }
    }
    return h(P.Stack, null, h(P.Text, null, 'Create a local silent video and a separate quiet tone. Nothing plays automatically.'), h(P.Button, { onClick: create, loading: busy[0] }, 'Create local sample'),
      error[0] ? h(P.Notice, { tone: 'warning' }, error[0]) : null,
      urls[0] ? props.viewer ? h(React.Fragment, null, h(P.Button, { onClick: function () { open[1](true); } }, 'Open video preview'), h(P.MediaViewer, { open: open[0], onClose: function () { open[1](false); }, defaultIndex: 1, items: [{ src: '../../dam/assets/thumb-10.svg', title: 'Image sample' }, { kind: 'video', src: urls[0].video, audio: urls[0].audio, title: 'Video with separate sound' }] }))
        : h(P.MediaPlayer, { src: urls[0].video, audio: urls[0].audio, label: 'Video with separate sound' }) : null);
  }
  var player = H.record('media-player'), viewer = H.record('media-lightbox');
  if (player) player.examples.push(['Separate sound', function () { return H.box(640, h(Demo, {})); }]);
  if (viewer) viewer.examples.push(['Video items', function () { return H.box(640, h(Demo, { viewer: true })); }]);
  return [];
});
