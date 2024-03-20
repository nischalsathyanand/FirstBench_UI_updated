import { action, observable } from "mobx";

class PositionStore {
  @observable buys = [];
  @action getPosition() {}
}
const positionStore = new PositionStore();
export default positionStore;
