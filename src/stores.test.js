import { createStore, testonly } from "./stores";
import data from "./testdata";
const testClinics = data.test3Clinics;
const testServices = data.test4Services;
const sleep = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

it.only("has working functions", () => {
  const rwfn = testonly.removeWordsFunction("a|the|is|test");
  expect(rwfn("this is a test of the american ")).toBe("this of american");
  const kvs = {
    1: "one",
    2: "two",
    3: "three",
    31: "one",
    4: "four",
    5: "five",
    6: "six",
    7: "seven"
  };
  const defaultOrder = [4, 11, 1, 2, 31];
  const clinicServiceIds = [7, 11, 2, 3, 45, 4, 5, 6, 7];
  const expected = ["four", "one", "two"];
  const filtered = ["four", "two"];
  const defaultList = testonly.createOrderedList(kvs, defaultOrder);
  // test one-time list from default ids list -or- override ids from service-list-order
  expect(defaultList).toEqual(expected);
  // test filtering the default name list with a list of service ids (from one clinic)
  expect(
    testonly.createOrderedList(kvs, clinicServiceIds, defaultList)
  ).toEqual(filtered);
});
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
  store.loadClinics(testClinics.slice(0, 3));
  expect(store.count).toEqual(4); // clinic 1 has an alias, which adds another item
  expect(store.servicesDefaultOrder).toEqual([]);
  store.loadClinics(testClinics); // default will now be set
  expect(store.count).toEqual(5);
  expect(store.servicesDefaultOrder).toEqual(["3", "4", "1", "2"]);
});
it("can load services", async () => {
  const store = createStore();
  store.loadClinics(testClinics); // default will now be set
  expect(store.count).toEqual(5);
  expect(store.servicesDefaultOrder).toEqual(["3", "4", "1", "2"]);
  expect(store.servicesDefaultNames.length).toBe(0);
  expect(store.getState).toBe("loading");
  // load services
  store.loadServices(testServices);
  expect(store.servicesDefaultOrder.length).toBe(4);
  await sleep(1);
  expect(store.getState).toBe("good");
  expect(store.servicesDefaultNames.length).toBe(2);
  expect(store.servicesDefaultNames[0]).toBe("Flu shot");
  expect(store.serviceNames["4"]).toBe("Flu shot");
});
it("can load services BEFORE clinics too", async () => {
  const store = createStore();
  // load services
  console.log(store.servicesAdded);
  expect(store.servicesDefaultNames.length).toBe(0);
  store.loadServices(testServices);
  expect(Object.keys(store.serviceNames).length).toBe(4);
  expect(store.servicesAdded).toBeTruthy();
  // load clinics
  store.loadClinics(testClinics); // default will now be set
  // expect(store.getState).toBe("loading");
  expect(store.count).toEqual(5);
  expect(store.servicesDefaultOrder).toEqual(["3", "4", "1", "2"]);
  await sleep(1);
  expect(store.getState).toBe("good");
  expect(store.servicesDefaultNames.length).toBe(2);
  expect(store.servicesDefaultNames[0]).toBe("Flu shot");
  expect(store.serviceNames["4"]).toBe("Flu shot");
});
/*
get specific clinic services in order
 */
describe.only("retrieving services list", () => {
  const store = createStore();
  it("cannot find a service before loaded", () => {
    expect(store.getTopServices("clinic 1")).toEqual("missing");
  });
  it("can find a service after loaded", () => {
    store.loadServices(testServices);
    store.loadClinics(testClinics); // default will now be set
    const sdn = store.servicesDefaultNames;
    expect(store.getTopServices("clinic 1")).toEqual([sdn[1]]);
    expect(store.getTopServices("clinic 3")).toEqual(sdn.slice(0, 2));
    expect(store.getTopServices("clinic 3")).toEqual(sdn.slice(0, 2)); // 2nd time still works
    expect(store.getTopServices("clinic 2")).toEqual([
      store.serviceNames["9"],
      sdn[1]
    ]);
  });
});
