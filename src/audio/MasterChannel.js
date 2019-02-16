import SuperChannel from "./SuperChannel";
import SuperAudioManager from "./SuperAudioManager";
export default class MasterChannel extends SuperChannel {
  constructor(props) {
    super({ ...props, destination: SuperAudioManager.context.destination });
  }
}
