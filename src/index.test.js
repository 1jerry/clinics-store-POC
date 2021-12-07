import { createStore } from "./index";

it("can create clinids list", () => {
  const store = createStore();
  console.log("test running.........");

  expect(store.counter).toEqual(0);
});
