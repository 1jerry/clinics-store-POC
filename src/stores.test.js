import { createStore } from "./stores";

it("has working methods", () => {
  const store = createStore();
  console.log("test running.........");
  expect(store.counter).toEqual(0);
  expect(store.state).toEqual("start");
  store.setLoading();
  expect(store.state).toEqual("loading");
  expect(store.getState).toEqual("loading");
  store.setError();
  expect(store.state).toEqual("error");
  store.setEmpty();
  expect(store.state).toEqual("empty");
  store.setGood();
  expect(store.state).toEqual("good");
});
//    get getState() {return this.state},
// setLoading() {this.state = 'loading';this.stateNum=0},
// setError() {this.state = 'error';this.stateNum=1},
// setEmpty() {this.state = 'empty';this.stateNum=2},
// setGood() {this.state = 'good';this.stateNum=3},
