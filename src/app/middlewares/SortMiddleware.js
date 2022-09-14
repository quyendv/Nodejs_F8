// Expression function k cần name nhưng mà đặt vẫn được
module.exports = function SortMiddleware(req, res, next) {
    // res.locals: https://expressjs.com/en/4x/api.html#res.locals, https://youtu.be/MJ7JZSW6seA?t=1098
    // Đặc điểm là scope của nó trong 1 request thôi nên k ảnh hưởng đến request khác, và gọi đc trong phần views với dạng {{_sort}}
    res.locals._sort = {
        enabled: false,
        type: 'default',
    };

    if (req.query.hasOwnProperty('_sort')) {
        // res.locals._sort.enabled = true;
        // res.locals._sort.type = req.query.type;
        // res.locals._sort.column = req.query.column;
        Object.assign(res.locals._sort, {
            enabled: true,
            type: req.query.type,
            column: req.query.column,
        });
    }

    next(); // phải next mới sang đc middleware tiếp theo, nếu k sẽ bị treo
};
