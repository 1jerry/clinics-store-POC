import React from "react";
import { render } from "react-dom";
import { observer } from "mobx-react-lite";
import { createClinic, createStore } from "./stores";
import data from "./testdata";
const testClinics = data.test3Clinics;
const testServices = data.test4Services;

const App = observer(({ store, clinicStore }) => {
  const onSetClinic = (clinics) => {
    store.loadClinics(clinics);
    clinicStore.setServices(store);
  };
  const onSetServices = (list) => {
    store.loadServices(list);
    // clinicStore.setServices(store);
  };
  let key = 0;
  const ClinicsLoading = observer(() => {
    return clinicStore.state === "loading" && <div>fetching...</div>;
  });
  const ClinicsLoaded = observer(() => {
    return (
      clinicStore.state === "good" && (
        <div>
          <div>{store.count} clinics.</div>
          {[...store.clinics].map((clinic) => (
            <div key={key++}>{clinic}</div>
          ))}
          <hr />
          {/* <div>{clinicStore.count} default services</div>
          {store.clinicsOrder.map((name) => (
            <div key={key++}>{name}</div>
          ))} */}
        </div>
      )
    );
  });

  return (
    <div>
      <div>count: {store.counter}</div>
      <button onClick={() => store.increment()}>+1</button>
      <button onClick={() => onSetClinic(testClinics)}>
        {store.clinicsAdded ? "reset" : "add"} Clinics
      </button>
      <button onClick={() => onSetServices(testServices)}>
        {store.servicesAdded ? "reset" : "add"} Services
      </button>
      <button onClick={() => store.toggleState()}>
        Stores toggle {store.getState}
      </button>
      <hr />
      <ClinicsLoading />
      <ClinicsLoaded />
      <hr />
    </div>
  );
});

render(
  <div>
    <App store={createStore()} clinicStore={createClinic()} />
  </div>,
  document.getElementById("root")
);
