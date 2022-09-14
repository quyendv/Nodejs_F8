const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {
    // [GET] me/stored/courses => bổ sung phần soft delete sẽ thêm deleteAt bằng null (hoặc k có) là chưa bị xóa, còn ở dạng Date có ngày tháng rồi tức là đã bị xóa mềm (soft delete)
    // Thêm {deleteAt: null} vào find() để demo chứ ta dùng thư viện mongoose-delete
    storedCourses(req, res, next) {
        // Phần soft middleware: https://youtu.be/MJ7JZSW6seA?t=869
        let courseQuery = Course.find({}); // tạo biến, để sort xong truyền vào phần bên dưới, chứ nếu gọi lại Course.find({}) thì như k
        if (req.query.hasOwnProperty('_sort')) {
            // sort của mongoose, có thể dùng gán courseQuery = courseQuery.sort... cũng dc
            courseQuery.sort({
                [req.query.column]: req.query.type, // Phải có ngoặc vuông trong object: https://youtu.be/orIXdOPFWeM?t=376
            });
        }

        // Course.find({})
        //     .lean()
        //     .then(courses => {
        //         /* file controllers link đến views nên k để / ở đầu còn lại đều được: ./me/... hoặc me/... */
        //         res.render('./me/stored-courses', {
        //             courses,
        //         });
        //     })
        //     .catch(next);

        // Course.countDocumentsDeleted()
        //     .then(deletedCount => console.log(deletedCount))
        //     .catch(next);

        // -> gộp cả đếm obj đã xóa
        Promise.all([courseQuery, Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => {
                res.render('me/stored-courses', {
                    deletedCount,
                    courses: multipleMongooseToObject(courses), // k .lean được nên dùng tạm, cơ mà sao nó k lỗi file stored-courses nhỉ -> sau each là key của object?
                });
            })
            .catch(next);
    }

    trashCourses(req, res, next) {
        // Tìm các khóa học đã soft delete: findDeleted
        Course.findDeleted({})
            .lean()
            .then(courses => {
                res.render('./me/trash-courses', {
                    courses,
                });
            })
            .catch(next);
    }
}

module.exports = new MeController();
