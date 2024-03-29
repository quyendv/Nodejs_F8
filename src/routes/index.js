const newsRouter = require('./news');
const siteRouter = require('./site');
const coursesRouter = require('./courses');
const meRouter = require('./me');
const authenticationRouter = require('./authentication');

function route(app) {
    // method(path, callback) cb: request & response, ...
    // app.get('/', (req, res) => {
    //     // res.send('<h1>Hello World</h1>');
    //     res.render('home'); // bố cục chính ở layouts/main.handlebars, nội dung trong {{{body}}} lấy ở home
    //     // res.render('news'); // lấy ở new.handlebars
    // });

    // app.get('/news', (req, res) => {
    //     // console.log(req.query);
    //     res.render('search');
    // });

    app.use('/authentication', authenticationRouter);
    app.use('/news', newsRouter); // https://expressjs.com/en/4x/api.html#router.use
    app.use('/courses', coursesRouter);
    app.use('/me', meRouter);
    app.use('/', siteRouter); // cái này để cuối vì nó luôn matches từ trên xuống và matches rồi k xét bên dưới nữa

    // app.get("/search", (req, res) => {
    //     // console.log(req.query); // http://localhost:3000/search?q=f8&ref=mycv&author=sondn query ra sẽ có thông tin, tuy nhiên khi post sẽ dạng formdata và phải .body chứ k phải query
    //     res.render("search");
    // });

    // // -> tạo lắng nghe post thì form method="post" mới đc
    // app.post("/search", (req, res) => {
    //     console.log(req.body); // undefined, do middleware nữa
    //     res.render("search");
    // });
}

module.exports = route;
