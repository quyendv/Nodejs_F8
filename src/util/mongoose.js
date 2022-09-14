module.exports = {
    multipleMongooseToObject: function (arrays) {
        return arrays.map(element => element.toObject());
    },

    mongooseToObject: function (element) {
        return element.toObject();
    },
};
