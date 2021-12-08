import { createStore } from "./stores";
import data from "./testdata";
const testClinics = data.test3Clinics;

it("has working methods", () => {
  const store = createStore();
  console.log("test running.........");
  expect(store.counter).toEqual(0);
  expect(store.state).toEqual("good");
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
it("can load clinics", () => {
  const store = createStore();
  store.loadClinics(testClinics);
  expect(store.count).toEqual(3);
  expect(store.clinicsOrder).toEqual([]);
  testClinics.push({
    name: store.defaultClinic,
    "service-list-order": ["3", "4", "1"]
  });
  store.loadClinics(testClinics); // default will now be set
  expect(store.count).toEqual(4);
  expect(store.clinicsOrder).toEqual(["3", "4", "1"]);
});
