import SuperAudioManager from "./SuperAudioManager";
import EffectTypes from "./effects/EffectTypes";
export default class SuperChannel {
    constructor({
        volume = 1,
        name = null,
        effects = [],
        audios = [],
        destination = null
    } = {}) {
        this.volume = volume;
        this.name = name;
        this.effects = [];
        this.gainOutput = SuperAudioManager.context.createGain();
        this.destinationOutput = destination;

        this.audios = audios;

        for (let audioName in audios) {
            SuperAudioManager.audios[audioName] = audios[audioName];
            SuperAudioManager.audios[audioName].loaded = false;
            SuperAudioManager.audios[audioName].destination = this.gainOutput;
        }

        for (let effect of effects) {
            const effectInstance = new EffectTypes[effect.type](effect);
            this.effects.push(effectInstance);
        }

        this.gainOutput.gain.value = this.volume;

        this.connect();
    }

    connect() {
        let input = this.gainOutput;

        for (let effect of this.effects) {
            input.connect(effect.output);
            input = effect.output;
        }
        input.connect(this.destinationOutput);
    }

    disconnect() {
        this.gainOutput.disconnect(this.destinationOutput);
    }

    solo() {
        for (let i = 0; i < SuperAudioManager.channels.length; i++) {
            const channel = SuperAudioManager.channels[i];

            if (channel !== this) {
                channel.mute();
            } else {
                this.unmute();
            }
        }
    }

    unmute() {
        this.gainOutput.gain.value = this.volume;
    }

    mute() {
        this.gainOutput.gain.value = 0;
    }

    toggleMute() {
        if (this.gainOutput.gain.value === 0) {
            this.unmute();
        } else {
            this.mute();
        }
    }
}
