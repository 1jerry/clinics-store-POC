import React from "react";
import { render } from "react-dom";
import { observer } from "mobx-react-lite";
import { createClinic, createStore } from "./stores";
import data from "./testdata";
const testClinic = data.test3Clinics;

const App = observer(({ store, store2 }) => {
  const onSetClinic = (clinic) => {
    store.setClinics(clinic);
    store2.setServices(store);
  };
  let key = 0;
  const ClinicsFetching2 = observer(() => {
    return store2.state === "loading" && <div>fetching...</div>;
  });
  const ClinicsFetched2 = observer(() => {
    return (
      store2.state === "good" && (
        <div>
          <div>{store.count} clinics</div>
          {store.clinicsOrdered.map((clinic) => (
            <div key={key++}>{clinic.name}</div>
          ))}
          <div>{store2.count} services</div>
          {store2.services.map((name) => (
            <div key={key++}>{name}</div>
          ))}
        </div>
      )
    );
  });

  return (
    <div>
      <div>count: {store.counter}</div>
      <button onClick={() => store.increment()}>+1</button>
      <button onClick={() => onSetClinic(testClinic)}>
        {store.clinicsAdded ? "reset" : "add"} Clinics
      </button>
      <button onClick={() => store.toggleState()}>
        Stores toggle {store.getState}
      </button>
      <hr />
      <ClinicsFetching2 />
      <hr />
      <ClinicsFetched2 />
    </div>
  );
});

render(
  <div>
    <App store={createStore()} store2={createClinic()} />
  </div>,
  document.getElementById("root")
);
