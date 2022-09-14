const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete'); // https://www.npmjs.com/package/mongoose-delete

const { Schema } = mongoose; // Schema = mongoose.Schema

const Course = new Schema(
    {
        // _id: { type: Number }, // Thêm 2 dòng này để tự custome lại _id của mongoDB và nó k can thiệp vào -> tuy nhiên k phải lúc nào cũng nên làm như vậy: https://youtu.be/U0dG1GKI054
        name: { type: String, required: true },
        desc: { type: String, maxLength: 600 },
        img: { type: String, maxLength: 255 },
        slug: { type: String, slug: 'name', unique: true }, // phải thêm vào nếu không bị lỗi khi dùng findOne theo slug, update sau: dùng slug generator, thêm unique: true vì nó generate từ name, nếu name trùng thì slug trùng, khi đó nó sẽ luôn dẫn đến bản ghi đc thêm vào trước (bên trên)
        // -> nếu trùng nó sẽ thêm short ID để slug k bao giờ trùng nhau
        videoId: { type: String, required: true }, // nên thêm hết dữ liệu vào nếu k khi add vào bằng mongoose sẽ lỗi vì nó chặt chẽ dữ liệu
        level: { type: String, maxlength: 255, default: 'Cấp độ cơ bản' },
        // deleteAt: { type: Date, maxlength: 255, default: null }, // phải thêm vào nếu k set bằng null soft delete vẫn k đc, để default null vì khi nào xóa mới set time => Tuy nhiên test thôi chứ dùng thư viện và nó tự thêm field deleted: boolean, false là bình thường, true là đã bị xóa mềm

        // createdAt: { type: Date, default: Date.now },
        // updatedAt: { type: Date, default: Date.now },
    },
    {
        // _id: false, // Thêm 2 dòng này để tự custome lại _id của mongoDB và nó k can thiệp vào -> tuy nhiên k phải lúc nào cũng nên làm như vậy: https://youtu.be/U0dG1GKI054
        timestamps: true, // tự thêm createdAt và updatedAt
    }
);

// Add plugin: cái mongoose-delete chú ý vài phương thức: find() ghi đè chỉ tìm những cái chưa bị xóa mềm và xóa hẳn, delete là soft delete, restore là khôi phục lại dạng patch(chỉ sửa deleted: true -> false), và deleteOne là xóa hẳn 1 obj
mongoose.plugin(slug); // sử dụng slug generator: https://www.npmjs.com/package/mongoose-slug-generator
Course.plugin(mongooseDelete, {
    deleteAt: true, // bật xem thời điểm xóa
    overrideMethods: 'all', // add plugin to schema đồng thời override all method để k cần sửa lại find({ deleted: false }) - lấy những bản ghi chưa bị xóa mềm: https://youtu.be/dstdrBsf7ag?t=1136
});

module.exports = mongoose.model('Course', Course); // sang file khác import tên khác vẫn đc
