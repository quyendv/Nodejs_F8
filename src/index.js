const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { engine } = require("express-handlebars");
const route = require("./routes"); // ./routes/index.js

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public"))); // http://localhost:3000/img/f8-icon-logo.png
app.use(express.urlencoded({ extended: true })); // xử lý cho form data .body k bị undefined nữa, còn fetch, xmlhttprequest, ... dùng express.json()
app.use(express.json());

// HTTP logger
// app.use(morgan('combined'));

// Template engine: https://www.npmjs.com/package/express-handlebars
// app.engine('handlebars', engine());
// .hbs hay hbs đều được hết, đối số đầu lệnh này với đối số sau lệnh dưới phải giống nhau
app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views")); // dirname: D:\VSCode\blog\src -> join: D:\VSCode\blog\src\resources\views

// Routes init
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
