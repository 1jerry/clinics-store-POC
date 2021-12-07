import { makeAutoObservable, autorun, flow, when } from "mobx";

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
export function createClinic() {
  const store = makeAutoObservable({
    state: "",
    topServices: ["1", "2"],
    get getState() {
      return this.state;
    },
    setLoading() {
      this.state = "loading";
    },
    setError() {
      this.state = "error";
    },
    setEmpty() {
      this.state = "empty";
    },
    setGood() {
      this.state = "good";
    },
    get services() {
      return this.topServices;
    },
    setServices: flow(function* (store) {
      console.log(`setServices-1. store.state ${store.state}`);
      this.setLoading();
      yield when(() => store.getState === "good");
      console.log(`setServices-2. store.state ${store.state}`);
      this.topServices = store.clinicsOrdered.map((i) => i.name);
      yield sleep(1);
      this.setGood();
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
  const states = "loading, error, empty, good".split(", ");
  const store = makeAutoObservable({
    counter: 0,
    state: "start",
    stateNum: -1,
    clinics: new Set(),
    clinicsOrdered: [],
    clinicsAdded: false,
    increment() {
      this.counter += 1;
    },
    toggleState() {
      // for interactive testing
      this.state = states[++this.stateNum];
    },
    get getState() {
      return this.state;
    },
    setLoading() {
      this.state = "loading";
      this.stateNum = 0;
    },
    setError() {
      this.state = "error";
      this.stateNum = 1;
    },
    setEmpty() {
      this.state = "empty";
      this.stateNum = 2;
    },
    setGood() {
      this.state = "good";
      this.stateNum = 3;
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
    console.log("autorun--- clinics state", store.state);
  });
  return store;
}
