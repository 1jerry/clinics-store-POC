import React, { useState } from "react";
import { render } from "react-dom";
import { observer } from "mobx-react-lite";
import { createStore } from "./stores";
import { observable, toJS, configure } from "mobx";
import data from "./testdata";
const testClinics = data.test3Clinics;
const testServices = data.test4Services;
configure({ enforceActions: "never" });

const App = observer(({ store }) => {
  const onSetClinic = (clinics, list) => {
    store.loadClinics(clinics);
    store.loadServices(list);
  };
  // const [clinicName, selectClinic] = useState("<unknown>");
  const clinics = observable({
    name: "",
    status: "",
    list: []
  });
  const selectClinic = (name) => {
    store.initialize();
    clinics.name = name;
    clinics.status = "";
    clinics.list = store.getTopServices(name);
    if (typeof clinics.list === "string") {
      clinics.status = clinics.list;
      clinics.list = [];
    }
    console.log("selected clinics object: ", toJS(clinics));
  };
  let key = 0;
  const ClinicsLoading = observer(() => {
    return store.state === "loading" && <div>fetching...</div>;
  });
  const ClinicsEmpty = observer(() => {
    return store.state === "empty" && <div>no clinics yet</div>;
  });
  const ClinicsLoaded = observer(() => {
    return (
      store.clinicsAdded && (
        <div>
          <div>{store.count} clinics.</div>
          {[...store.clinics.keys()].map((clinic) => (
            <div key={key++}>
              <button onClick={() => selectClinic(clinic)}>{clinic}</button>
            </div>
          ))}
          <div key={key++}>
            <button onClick={() => selectClinic("bad")}>bad clinic</button>
          </div>
          <hr />
          {/* {!!clinicName &&  */}
          <div>Clinic selected: {clinics.name}</div>
          {clinics.status && <div>{clinics.status}</div>}
          {clinics.list.map((name) => (
            <div key={key++}>{name}</div>
          ))}
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
      <button onClick={() => onSetClinic(testClinics, testServices)}>
        {store.clinicsAdded ? "reset" : "add"} Clinics
      </button>
      <span> Status: {store.getState}</span>
      <hr />
      <ClinicsLoading />
      <ClinicsEmpty />
      <ClinicsLoaded />
      <hr />
    </div>
  );
});

render(
  <div>
    <App store={createStore()} />
  </div>,
  document.getElementById("root")
);
