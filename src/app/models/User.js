const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete'); // https://www.npmjs.com/package/mongoose-delete

const { Schema } = mongoose; // Schema = mongoose.Schema

const User = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true, // tự thêm createdAt và updatedAt
    }
);

// Add plugin: cái mongoose-delete chú ý vài phương thức: find() ghi đè chỉ tìm những cái chưa bị xóa mềm và xóa hẳn, delete là soft delete, restore là khôi phục lại dạng patch(chỉ sửa deleted: true -> false), và deleteOne là xóa hẳn 1 obj
mongoose.plugin(slug); // sử dụng slug generator: https://www.npmjs.com/package/mongoose-slug-generator
User.plugin(mongooseDelete, {
    deleteAt: true, // bật xem thời điểm xóa
    overrideMethods: 'all', // add plugin to schema đồng thời override all method để k cần sửa lại find({ deleted: false }) - lấy những bản ghi chưa bị xóa mềm: https://youtu.be/dstdrBsf7ag?t=1136
});

module.exports = mongoose.model('User', User); // sang file khác import tên khác vẫn đc
