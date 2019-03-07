import SuperAudioManager from "./SuperAudioManager";
export default class SuperAudio {
  constructor({
    volume = 1,
    loop = false,
    retrig = false,
    url = null,
    playbackRate = 1,
    destination = null,
    name = null,
    loadGroup = null
  } = {}) {
    this.loaded = false;
    this.playing = false;
    this.volume = volume;
    this.loop = loop;
    this.retrig = retrig;
    this.source = SuperAudioManager.context.createBufferSource();
    this.source.loop = loop;
    this.url = url;
    this.name = name;
    this.source.buffer = SuperAudioManager.audios[this.name].buffer;
    this.loadGroup = loadGroup;
    this.playbackRate = playbackRate;

    this.gainOutput = SuperAudioManager.context.createGain();
    this.destinationOutput = destination;

    this.addEvents();
  }

  connect() {
    this.source.connect(this.gainOutput);
    this.gainOutput.connect(this.destinationOutput);
  }

  disconnect() {
    this.gainOutput.disconnect(this.destinationOutput);
  }

  static async loadBuffer(audioName) {
    //do this in webworker
    return new Promise((resolve, reject) => {
      fetch(SuperAudioManager.audios[audioName].url)
        .then(res => res.arrayBuffer())
        .then(buffer => SuperAudioManager.context.decodeAudioData(buffer))
        .then(data => {
          SuperAudioManager.audios[audioName].buffer = data;
          SuperAudioManager.audios[audioName].loaded = true;
          resolve();
        })
        .catch(e => console.log(e));
    });
  }

  async start(time = 0) {
    if (!SuperAudioManager.audios[this.name].loaded) {
      await this.loadBuffer();
    }

    this.connect();

    this.source.start(time);
  }

  stop(time = 0) {
    this.source.stop(time);
  }

  onEnded() {
    this.removeEvents();
    this.disconnect();
    clearTimeout(this.inTimeout);
    clearTimeout(this.outTimeout);
    //todo nullify the object to free memory
  }

  addEvents() {
    this.source.addEventListener("ended", this.onEnded.bind(this));
  }

  removeEvents() {
    this.source.removeEventListener("ended", this.onEnded.bind(this));
  }

  fadeOutAndStop({ duration = 4, delay = 0 } = {}) {
    this.outTimeout = setTimeout(() => {
      this.gainOutput.gain.linearRampToValueAtTime(
        0,
        SuperAudioManager.context.currentTime + duration
      );

      this.stop(SuperAudioManager.context.currentTime + duration);
      console.log("STOPED " + this.name);
      clearTimeout(this.outTimeout);
    }, delay * 1000);
  }

  fadeInAndStart({ duration = 4, delay = 0 } = {}) {
    this.inTimeout = setTimeout(() => {
      this.gainOutput.gain.setValueAtTime(
        0,
        SuperAudioManager.context.currentTime
      );
      this.gainOutput.gain.linearRampToValueAtTime(
        this.volume,
        SuperAudioManager.context.currentTime + duration
      );
      this.start();
      clearTimeout(this.inTimeout);
    }, delay * 1000);
  }
}
