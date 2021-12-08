import { makeAutoObservable, autorun, flow, when, toJS } from "mobx";

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
const removeWordsFunction = (words) => (text) =>
  text
    .replace(new RegExp("\\b(" + words + ")\\b", "gi"), " ")
    .replace(/\s{2,}/g, " ")
    .trim();
const clinicAlias = {
  "clinic 1": "clinic 1a"
};
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
      this.topServices = store.clinicsOrder.map((i) => i.name);
      yield sleep(1);
      this.setGood();
    }),
    get count() {
      return this.topServices.length;
    }
  });
  autorun(() => {
    console.log("autorun---services is empty?", store.services.length === 0);
  });
  return store;
}
export function createStore() {
  const states = "loading, error, empty, good".split(", ");
  const defaultClinic = "default";
  const store = makeAutoObservable({
    counter: 0,
    state: "good",
    stateNum: -1,
    clinics: new Set(),
    clinicsOrder: [],
    clinicsAdded: false,
    increment() {
      this.counter += 1;
    },
    get defaultClinic() {
      return defaultClinic;
    },
    toggleState() {
      // for interactive testing. TMP
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
    loadClinics(clinics) {
      this.clinics.clear();
      this.clinicsOrder.clear();
      console.log("loadClinics run with ", clinics);

      clinics.forEach((item) => {
        console.log("process item ", item);
        const clinicItem = {
          name: item.name,
          services: item.services,
          servicesOverride: item["service-list-order"] || []
        };
        this.clinics.add(item.name, clinicItem);
        if (item.name in clinicAlias)
          this.clinics.add(clinicAlias[item.name], clinicItem);
        if (item.name === defaultClinic) {
          this.clinicsOrder.replace(clinicItem.servicesOverride);
          console.log(
            "set default order to ",
            toJS(clinicItem.servicesOverride)
          );
        }
      });
      console.log("clinicsOrder =", toJS(this.clinicsOrder));
      console.log("clinics =", toJS(this.clinics));
      this.clinicsAdded = true;
    },
    get count() {
      return this.clinics.size;
    }
  });
  autorun(() => {
    console.log("autorun--- clinics state", store.state);
  });
  return store;
}
