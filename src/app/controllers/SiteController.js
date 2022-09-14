const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    // [GET] /
    index(req, res, next) {
        // Course.find({}, function (err, course) {
        //     if (!err) {
        //         res.json(course);
        //     } else {
        //         next(err);
        //         // res.status(400).json({ error: 'Error!' });
        //     }
        // });

        Course.find({})
            .then(courses => {
                // Object được tạo thông thường obj = {} khác với obj được trả về từ mongoose (thuộc tính trong prototype nên k this.prop được), phải convert
                // cách 1: model.find({}).lean().then(...).catch(...)
                // cách 2: {{this._doc.name}} {{this._doc.image}} ...
                // cách 3:
                // courses = courses.map(course => course.toObject());
                res.render('home', { courses: multipleMongooseToObject(courses) }); // res.json(course)
            })
            .catch(err => next(err)); // hoặc .catch(next);

        // res.render('home');
    }

    // [GET] /search
    search(req, res) {
        res.send('search');
    }
}

module.exports = new SiteController();
