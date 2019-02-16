import SuperAudioManager from "../SuperAudioManager";
export default class Filter {
  constructor({
    type = Filter.FILTER_TYPE.LOW_PASS_FILTER,
    frequency = null,
    gain = 0,
    Q = 0
  } = {}) {
    this.output = SuperAudioManager.context.createBiquadFilter();
    this.output.type = Filter.FILTER_TYPE[type];
    this.output.Q.value = Q;
    this.output.frequency.value = frequency;
    this.output.gain.value = gain;
  }

  static get FILTER_TYPE() {
    return {
      LOW_PASS_FILTER: "lowpass",
      HIGH_PASS_FILTER: "highpass"
    };
  }
}
