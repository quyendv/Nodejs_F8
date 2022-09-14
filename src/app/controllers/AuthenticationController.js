const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../../config/authentication/jwtsecret');

// Ban đầu định đặt trong class, nhưng mà gọi method trong method của class cần this, mà this trong findOne rồi lean, then, ... các thứ nó k còn là class đó nữa, thử _this cũng k đc nên phải để ngoài class
// Sau này nên để riêng ra phần khác: util, app/config (k hợp lắm), hoặc tạo thư mục riêng, ...
function encodedToken(userId) {
    return jwt.sign(
        {
            iss: 'Quyen', // issuer
            sub: userId, // thông tin phân biệt các user, email hoặc id nhưng email là thông tin nhạy cảm,
            iat: new Date().getTime(), // tgian tạo
            exp: new Date().setDate(new Date().getDate + 3), // tgian hết hạn: Expiration
        },
        JWT_SECRET
    );
}

class AuthenticationController {
    // [GET] /authentication/login
    login(req, res, next) {
        // res.json({ message: 'Login' });
        res.render('authentication/login');
    }

    // [POST] /authentication/login
    loginAction(req, res, next) {
        res.json({ message: 'Login Action' });
    }

    // [GET] /authentication/register
    register(req, res, next) {
        res.json({ message: 'Register' });
    }

    // [POST] /authentication/login
    registerAction(req, res, next) {
        // res.json({ message: 'Register Action' });
        const data = req.body;
        // const foundUser = await User.findOne({ email: data.email }); // nếu findOnr rồi xuống dưới xử lý thì phải dùng async/await mới k lỗi, hoặc k phải xử lý code trong findOne

        // res.json({ data, dataMail: data.email, foundUser: foundUser });
        //     console.log(foundUser);
        //     if (foundUser) {
        //         res.send({ message: 'email is already registered' });
        //     }
        //     const { name, email, password } = data;
        //     const newUser = new User({ name, email, password });
        //     console.log(newUser);
        // }
        User.findOne({ email: data.email })
            .lean()
            .then(user => {
                // simple check duplicate email, add check rules later: add validator to Schema https://mongoosejs.com/docs/validation.html#custom-validators
                // if invalid:

                if (user) res.send({ message: 'email is already registered' });
                else {
                    const newUser = new User(data);
                    const token = encodedToken(newUser._id);
                    newUser.save().then(() => {
                        // res.status(201).json({ sucess: true, token }); // k nên trả về đây mà nên trả về header
                        res.setHeader('Authorization', token); // postman vào header để xem
                        res.status(201).json({ sucess: true });
                    }); // k làm gì cũng phải .then() nếu k bị treo
                }
            })
            .catch(next);
    }

    // [GET] /authentication/show
    show(req, res, next) {
        res.json({ message: 'Show' });
    }
}

module.exports = new AuthenticationController();
