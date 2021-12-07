import React from "react";
import { render } from "react-dom";
import { observer } from "mobx-react-lite";
import {createClinic, createStore} from "./stores"

const testClinic = [
  { name: "clinic 1", services: ["1", "2"], servicesOverride: [] },
  { name: "clinic 2", services: ["1", "2"], servicesOverride: [] },
  { name: "clinic 3", services: ["1", "2"], servicesOverride: [] }
];

const App = observer(({ store, store2 }) => {
  const onSetClinic = (clinic) => {
    store.setClinics(clinic);
    store2.setServices(store);
  };
  const ClinicsFetching2 = observer(() => {
    return store2.state === 0 && <div>fetching...</div>;
  });
  const ClinicsFetched2 = observer(() => {
    return (
      store2.state === 1 && (
        <div>
          <div>{store.count} clinics</div>
          {store.clinicsOrdered.map((clinic) => (
            <div>{clinic.name}</div>
          ))}
          <div>{store2.count} services</div>
          {store2.services.map((name) => (
            <div>{name}</div>
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
        Stores toggle {store.state}
      </button>
      <hr />
      <ClinicsFetching2 />
      {/* {store2.state === 0 && <ClinicsFetching />} */}
      {/* {store2.state === 1 && <ClinicsFetched store={store} store2={store2} />} */}
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
