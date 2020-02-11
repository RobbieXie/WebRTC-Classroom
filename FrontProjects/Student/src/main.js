import StudentMain from "./controllers/StudentMain";

let app = new StudentMain();
let root = document.createElement("div");
document.body.appendChild(root);
app.$mount(root);