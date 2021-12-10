export default {
  test3Clinics: [
    { name: "clinic 1", services: ["1", "2"], garbage: "this will be ignored" },
    { name: "clinic 2", services: ["1", "2"] },
    { name: "clinic 3", services: ["1", "2", "3", "4"] },
    {
      name: "default",
      services: [],
      "service-list-order": ["3", "4", "1", "2"]
    }
  ],
  test4Services: [
    { caption: "illness/injury clinic visit", value: "1" },
    { caption: "illness/injury video visit", value: "2" },
    { caption: "Flu shot clinic visit", value: "4" },
    { caption: "pet scan", value: "9" }
  ]
};
