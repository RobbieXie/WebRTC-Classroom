import MainApp from "./controllers/MainApp";

let rootElement = document.createElement("div");
document.body.appendChild(rootElement);

new MainApp().$mount(rootElement);