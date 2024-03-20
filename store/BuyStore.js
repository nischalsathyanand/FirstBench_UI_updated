import { action, observable } from "mobx";

class BuyStore {
  @observable orders = [];
  @action getOrders() {}
  @action clearOrders() {
    this.orders = [];
  }
}
const buyStore = new BuyStore();
export default buyStore;
