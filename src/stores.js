import { makeAutoObservable, autorun, flow, when } from "mobx";

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
export function createClinic() {
  const store = makeAutoObservable({
    state: -1,
    topServices: ["1", "2"],
    get services() {
      return this.topServices;
    },
    setServices: flow(function* (store) {
      console.log(`setServices-1. store.state ${store.state}`);
      this.state = 0;
      yield when(() => store.state === 1);
      console.log(`setServices-2. store.state ${store.state}`);
      this.topServices = store.clinicsOrdered.map((i) => i.name);
      yield sleep(1);
      // setTimeout(() => this.state === 1, 2000);
      this.state = 1;
    }),
    get count() {
      return this.topServices.length;
    }
  });
  autorun(() => {
    console.log("autorun---services is empty?", store.services.length !== 0);
  });
  return store;
}
export function createStore() {
  const store = makeAutoObservable({
    counter: 0,
    state: 0,
    clinics: new Set(),
    clinicsOrdered: [],
    clinicsAdded: false,
    increment() {
      this.counter += 1;
    },
    toggleState() {
      this.state = 0 + !this.state;
    },
    setClinics(clinics) {
      this.clinics.clear();
      this.clinicsOrdered.clear();
      console.log("setClinics run with ", clinics);

      clinics.forEach((item) => {
        console.log("process item ", item);

        this.clinics.add(item.name, {
          name: item.name,
          services: item.services
        });
        this.clinicsOrdered.push(item);
      });
      console.log("clinics =", this.clinics["clinic 1"], this.clinics);
      console.log("clinicsOrdered =", this.clinicsOrdered);
      this.clinicsAdded = true;
    },
    get count() {
      return this.clinicsOrdered.length;
    }
  });
  autorun(() => {
    console.log("autorun---clinics is empty?", store.clinics.length !== 0);
  });
  autorun(() => {
    console.log("autorun--- clinics state", store.state);
  });
  return store;
}
