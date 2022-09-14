const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class CoursesController {
    // [GET] /course/:slug => trang show chi tiết từng khóa học
    show(req, res, next) {
        // res.send(`Course details - ${req.params.slug}`); // Phân biệt với .query, .body

        Course.findOne({ slug: req.params.slug }) // Chú ý 1 lỗi ở file models/Course phải thêm field slug vào mới đc, nếu k chỉ return phần tử đầu trong database??
            // .lean() // cách 1 cho việc convert obj trả về từ mongoose sang doc, xem ở SiteController
            .then(course => {
                // res.json(course); // show ra dạng json trên trang web
                res.render('courses/show', { course: mongooseToObject(course) }); // vì set views đến views rồi (đang đứng ở viewes) -> có thể ./courses/show hoặc chỉ courses/show
            })
            .catch(next);
    }

    // [GET] /courses/create
    create(req, res, next) {
        // res.send('create successfully'); // luôn test thử trước

        res.render('courses/create'); // or ./courses/create tuy nhiên /courses/create lại k đc
    }

    // [POST] /courses/store: click submit form ở file create, thực ra là từ trang courses/create ấn submit thì ôm dữ liệu sang trang courses/store và hiện thông báo (ôm dữ liệu để lưu đối tượng) còn redirect về home cũng đc
    store(req, res, next) {
        // res.json(req.body); // dữ liệu từ form bên client
        // req.body là formData lấy được
        req.body.img = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`; // Thường tự set sẵn theo video, chứ k phải add link ảnh vào
        const newCourse = new Course(req.body); // Lưu ý là name của input trong form phải trùng với models Course nếu k lỗi k add đc input đó vào
        newCourse
            .save() // save vừa sửa cũng vừa tạo đc
            .then(() => {
                res.redirect('/'); // chuyển hướng về trang chủ https://expressjs.com/en/4x/api.html#res.redirect
                // res.send('Saved');
            })
            .catch(next);
    }

    // [GET] /courses/:id/edit => trang edit khóa học thôi
    edit(req, res, next) {
        // Chú ý find, findOne cho slug, findById cho Id (thực chất cũng gọi lại findOne thôi: https://stackoverflow.com/questions/14255603/what-is-the-difference-between-model-findone-model-findbyid-in-mongoose#:~:text=findById%20is%20just%20a%20convenience,the%20findOne%20call%20you%20show.)
        // .query dùng cho search, .params để lấy từ đường dẫn nhé, .body khi post ta lấy dữ liệu formData bằng cách .body.inputName để lấy value input đó
        Course.findById(req.params.id)
            .lean()
            .then(course => res.render('courses/edit', { course }))
            .catch(next);
    }

    // [PUT] /courses/:id => từ file courses/:id/edit ta bấm save thì ôm dữ liệu sang /courses/:id?_method=put để update sau đó redirect về me/stored/courses
    update(req, res, next) {
        // res.json(req.body);
        // update đối tượng: https://mongoosejs.com/docs/queries.html
        // -> ta có thể sửa bằng find/findOne rồi save nó như hàm store kia, có thể findOneAndUpdate, có thể updateOne tùy thôi
        Course.updateOne({ _id: req.params.id }, req.body) // chú ý _id k phải id nhé, nếu k nó cứ sửa element đầu thôi
            .then(() => {
                // trong file controller nhưng hàm này dẫn về home như link html từ localhost ấy, / là k điền gì tức chỉ localhost
                // res.redirect('/');
                res.redirect('/me/stored/courses');
            })
            .catch(next);
    }

    // [DELETE] /courses/:id => thật ra link courses/:id là từ courses/:id?_method=... và link này chỉ chuyển đến khi ôm dữ liệu để edit hoặc xóa, sau đó redirect về thôi
    // ấn xóa từ me/stored/courses rồi xác nhận từ modal sẽ dẫn đến action này, thay vì tạo form rồi nhét thẻ a chứa link vào form (tốn tài nguyên, còn dùng vẫn đc như edit thôi) ta sử dụng bootstrap: https://getbootstrap.com/docs/5.2/components/modal/#varying-modal-content, https://youtu.be/yt8TemGS3aw?t=1159
    delete(req, res, next) {
        // Course.deleteOne({ _id: req.params.id }) // chú ý là _id: nếu k nó cứ thay đổi bản ghi đầu tiên thôi
        Course.delete({ _id: req.params.id }) // Thay vì dùng deleteOne của mongoose ta dùng delete của mongoose-delete
            .then(() => res.redirect('back')) // back quay lại chỗ cũ <=> /me/stored/courses
            .catch(next);
    }

    // [DELETE] /courses/:id/force => bấm nút xóa vĩnh viễn sẽ submit form với action: /courses/:id/force?_method=DELETE
    forceDelete(req, res, next) {
        // Chú ý deleteOne luôn là xóa hẳn kể cả có dùng mongoose-delete
        Course.deleteOne({ _id: req.params.id }) // Thay vì dùng deleteOne của mongoose ta dùng delete của mongoose-delete
            .then(() => res.redirect('back')) // back quay lại chỗ cũ <=> me/trash/courses
            .catch(next);
    }

    // [PATCH] /courses/:id/restore => Bấm nút khôi phục sẽ submit form với action: /courses/:id/restore?_method=PATCH (method của form k quan trọng vì ghi đè) trong file trash-courses => Chú ý đuôi ?_method... phải ở cuối cùng đường dẫn, để ý có đuôi restore nữa tránh copy như put (edit)
    restore(req, res, next) {
        // phương thức của mongoose-delete
        Course.restore({ _id: req.params.id })
            .then(() => {
                res.redirect('back');
            })
            .catch(next);
    }

    // [POST] /courses/handle-form-actions
    handleFormActions(req, res, next) {
        // res.json(req.body); // thường dùng .json này để show thông tin lên web xem
        switch (req.body.action) {
            case 'delete': // nếu là xóa -> thực hiện xóa mềm các id trong courseIds => chú ý nó là mảng nên dùng cách bên dưới { $in: array }
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => {
                        res.redirect('back');
                    })
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid' });
            // break;
        }
    }

    // [POST] /courses/handle-form-actions-trash : tương tự như ở stored-courses (nhưng đây là ở trash-courses), chọn hành động rồi post
    handleFormActionsTrash(req, res, next) {
        // res.json(req.body); // thường dùng .json này để show thông tin lên web xem
        switch (req.body.action) {
            case 'restore': // nếu là xóa -> thực hiện xóa mềm các id trong courseIds => chú ý nó là mảng nên dùng cách bên dưới { $in: array }
                Course.restore({ _id: { $in: req.body.courseIds } })
                    .then(() => {
                        res.redirect('back');
                    })
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid' });
            // break;
        }
    }
}

module.exports = new CoursesController();
