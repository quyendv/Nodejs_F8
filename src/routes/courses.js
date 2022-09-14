const express = require('express');

const router = express.Router();

const coursesController = require('../app/controllers/CoursesControllser');

// Các path khác (nếu cùng method) để bên trên :slug vì nó matches từ trên xuống và nếu matches sẽ k xét nữa -> còn cùng path nhưng method khác nhau (kiểu put với patch, ...) thì k sao
// link của /handle-form-actions để lên trước /:id vì nếu k nó có thể bắt id trước
// link ở router buộc phải có / là đường dẫn rồi
router.get('/create', coursesController.create); // courses/create: trang điền thông tin để tạo khóa học, ấn submit nó ôm data đến courses/store với phương thức post
router.post('/store', coursesController.store); // post đến trang courses/store
router.get('/:id/edit', coursesController.edit); // trang edit thông tin, khi submit ôm data đến trang courses/:id?_method=PUT hoặc gọn là courses/:id (put)

// nhớ để lên trước /:id
router.post('/handle-form-actions', coursesController.handleFormActions); 
router.post('/handle-form-actions-trash', coursesController.handleFormActionsTrash); 
router.put('/:id', coursesController.update); // put (update) đến trang courses/:id với action của form là /courses/:id?_method=PUT
router.patch('/:id/restore', coursesController.restore); // patch trong TH restore (hàm restore của mongoose-delete) chỉ update field delete: true -> false, tuy nhiên, khi put ta cũng courses/:id, delete cũng courses/:id nên restore nên để thêm /restore để phân biệt được
router.delete('/:id', coursesController.delete);
router.delete('/:id/force', coursesController.forceDelete); // xóa vĩnh viễn
router.get('/:slug', coursesController.show);

module.exports = router;
