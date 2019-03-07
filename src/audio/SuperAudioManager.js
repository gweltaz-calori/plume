import SuperAudio from "./SuperAudio";
import SuperChannel from "./SuperChannel";
import MasterChannel from "./MasterChannel";
export default class SuperAudioManager {
    static trigger(audioName, fadeInOptions = null) {
        if (void 0 === SuperAudioManager.audios[audioName]) {
            throw new Error(`"${audioName}" audio not found`);
        }
        const clip = new SuperAudio({
            ...SuperAudioManager.audios[audioName],
            name: audioName
        });

        console.log('TRIGGER SOUND '+audioName)

        if (null !== fadeInOptions) {
            clip.fadeInAndStart(fadeInOptions);
        } else {
            clip.start();
        }

        return clip;
    }

    static getChannel(channelName) {
        const channel = SuperAudioManager.channels.find(
            channel => channel.name === channelName
        );

        return channel || null;
    }

    static init(config) {
        if (!SuperAudioManager.context) {
            throw "You must start before calling init";
        }
        const masterChannel = new MasterChannel(config.master);
        masterChannel.name = "master";
        SuperAudioManager.channels.push(masterChannel);
        for (let i = 0; i < config.channels.length; i++) {
            const channel = config.channels[i];

            SuperAudioManager.channels.push(
                new SuperChannel({
                    ...channel,
                    destination: masterChannel.gainOutput
                })
            );
        }
    }
    //preload a given list of groups
    static async load({
        groups = [],
        onProgress = null,
        onComplete = null
    } = {}) {
        const promises = [];

        let progress = 0;

        for (let audioName in SuperAudioManager.audios) {
            const audio = SuperAudioManager.audios[audioName];
            const hasGroup = groups.includes(audio.loadGroup);
            if (hasGroup) {
                const bufferLoaded = SuperAudio.loadBuffer(audioName);
                promises.push(bufferLoaded);
                bufferLoaded.then(() => {
                    progress++;
                    onProgress && onProgress(progress / promises.length);
                });
            }
        }

        return await Promise.all(promises).then(() => {
            onComplete && onComplete();
        });
    }

    static start() {
        SuperAudioManager.context = new AudioContext();
    }
}

SuperAudioManager.channels = [];
SuperAudioManager.audios = {};
