import { makeAutoObservable, autorun, flow, when, toJS } from "mobx";

const sleep = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const removeWordsFunction = (words) => (text) =>
  text
    .replace(new RegExp("\\b(" + words + ")\\b", "gi"), " ")
    .replace(/\s{2,}/g, " ")
    .trim();

// returns list of normalized service names in the proper order
const createOrderedList = (services, ids, filters) => {
  let ret = [...new Set(ids.map((id) => services[id]).filter((a) => a))];
  if (filters) {
    console.log("filters ", filters);
    ret = filters.filter((a) => ret.includes(a));
  }
  console.log("creatOrderedList returned ", ret);
  return ret;
};
export const testonly = {
  removeWordsFunction,
  createOrderedList
};
/*
Set manually.  Add a line for each clinic name from Webflow that doesn't match our db
Webflow-clinic-name: ZoomAPI-clinic-name
Also, set the words to remove from service names
*/
const clinicAlias = {
  "clinic 1": "clinic 1a"
};
const normalize = removeWordsFunction("clinic|video|visit");
// done with settings

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
      this.topServices = store.servicesDefaultOrder.map((i) => i.name);
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
    clinics: new Map(),
    servicesDefaultOrder: [], // default service IDs in order
    servicesDefaultNames: [], // normalized service names in order
    clinicsAdded: false,
    servicesAdded: false,
    serviceNames: {}, // map service ids to normalized names
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
    getTopServices(name) {
      const clinic = this.clinics.get(name);
      console.log("getTopServices, clinic = ", name, clinic);
      console.log("ordered list = ", this.servicesDefaultNames.join(", "));

      if (!clinic) return "missing";
      if (clinic.topNames) return clinic.topNames;
      let topNames = [];
      if (clinic.servicesOverride.length === 0) {
        topNames = createOrderedList(
          this.serviceNames,
          clinic.services,
          this.servicesDefaultNames
        );
      } else {
        topNames = createOrderedList(
          this.serviceNames,
          clinic.servicesOverride
        );
      }
      clinic.topNames = topNames;
      return topNames;
    },
    loadServices(serviceLines) {
      this.serviceNames = {};
      if (serviceLines.length) {
        this.setLoading();
        serviceLines.forEach((item) => {
          this.serviceNames[item.value] = normalize(item.caption);
        });
        this.servicesAdded = true;
      } else {
        this.setEmpty();
      }
    },
    loadClinics(clinics) {
      this.clinics.clear();
      this.servicesDefaultOrder.clear();
      console.log("loadClinics run with ", clinics);
      if (clinics.length) {
        this.setLoading();
        clinics.forEach((item) => {
          console.log("process item ", item);
          const clinicItem = {
            name: item.name,
            services: item.services,
            servicesOverride: item["service-list-order"] || []
          };
          this.clinics.set(item.name, clinicItem);
          if (item.name in clinicAlias)
            this.clinics.set(clinicAlias[item.name], clinicItem);
          if (item.name === defaultClinic) {
            this.servicesDefaultOrder.replace(clinicItem.servicesOverride);
            console.log(
              "set default order to ",
              toJS(clinicItem.servicesOverride)
            );
          }
        });
        console.log("servicesDefaultOrder =", toJS(this.servicesDefaultOrder));
        console.log("clinics =", toJS(this.clinics));
        this.clinicsAdded = true;
      } else this.setEmpty();
    },
    get count() {
      return this.clinics.size;
    }
  });
  autorun(() => {
    console.log("autorun--- clinics state", store.state);
    // console.log(store.clinicsAdded, store.servicesAdded);
  });
  when(
    () => store.clinicsAdded && store.servicesAdded,
    () => {
      console.log("'when' reaction run");

      store.servicesDefaultNames = createOrderedList(
        store.serviceNames,
        store.servicesDefaultOrder
      );
      store.setGood();
    }
  );
  return store;
}
