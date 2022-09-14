require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
// const morgan = require('morgan');
const path = require('path');
const { engine } = require('express-handlebars');
const route = require('./routes'); // ./routes/index.js
const db = require('./config/db');

const SortMiddleware = require('./app/middlewares/SortMiddleware');

// Connect to DB:
db.connect();

const app = express();
const port = process.env;

app.use(express.static(path.join(__dirname, 'public'))); // http://localhost:3000/img/f8-icon-logo.png
app.use(express.urlencoded({ extended: true })); // xử lý cho form data .body k bị undefined nữa, còn fetch, xmlhttprequest, ... dùng express.json()
app.use(express.json());
// đọc thêm về .urlencode và .json: https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded

// methodOverride: dùng trong form, file courses/edit.hbs
app.use(methodOverride('_method'));

// Middlware: nên xem kĩ video này https://fullstack.edu.vn/learning/nodejs?id=9e718206-9a55-483d-804b-e088129bc75e
// -> có thể dứng dụng app.use('/new-paths', bacBaoVe) để luôn xác thực cho phần mở rộng có /new-paths/... hoặc chỉ app.use(bacBaoVe) thì sẽ check cho tất cả đường dẫn -> dùng cho xác thực (authentication - và login là 1 phần) và phân quyền (authorization)
app.use(SortMiddleware);

// HTTP logger
// app.use(morgan('combined'));

// Template engine: https://www.npmjs.com/package/express-handlebars
// app.engine('handlebars', engine());
// .hbs hay hbs đều được hết, đối số đầu lệnh này với đối số sau lệnh dưới phải giống nhau
app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        // https://www.npmjs.com/package/express-handlebars: phần helpers của express-handlebars core từ handlebarsjs
        helpers: {
            // Các hàm này đều tự chạy khi render lại (chứ k bắt sự kiện, kể cả phần sort là do bấm vào nó render lại page)
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                // Hàm này tự chạy khi render, nên nó chạy hết tất cả các field mỗi lần chứ k phải chỉ field đc click (khi click thì nó cũng lại render lại page và chạy hàm ỏ all field tiếp tuy nhiên chỉ click mới render lại)
                // Hàm này chạy lần đầu khi đến trang (vào Khóa học của tôi) thì tất cả đều là default và tạo các thẻ a chứa thẻ i (icon) lên page
                // Sau khi click vào 1 field (thực chất là 1 thẻ a) nó sẽ chạy hàm và điều hướng url theo query của href + set icon field đó (các field khác cũng chạy hàm nhưng k khớp với query trên url nên thành default hết)
                // Có 1 điều khó để ý là thẻ a chứa icon đang asc thì link hiện tại của nó là desc để lần tới bấm nó thành desc
                const sortType = field === sort.column ? sort.type : 'default';

                const icons = {
                    default: 'fas fa-regular fa-sort',
                    asc: 'fas fa-duotone fa-sort-down',
                    desc: 'fas fa-duotone fa-sort-up',
                };
                // toggle icon: click để đổi kiểu, hay vl k cần tới event luôn, đang ở dạng nào bấm tự đổi sang dạng mong muốn
                const types = {
                    default: 'asc',
                    asc: 'desc',
                    desc: 'asc',
                };

                const icon = icons[sortType];
                const type = types[sortType];
                return `<a href="?_sort&column=${field}&type=${type}"><i class="${icon}"></i></a>`;
            },
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views')); // dirname: D:\VSCode\blog\src -> join: D:\VSCode\blog\src\resources\views -> hoặc path.join(__dirname, 'resources', 'views')

// Routes init
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
