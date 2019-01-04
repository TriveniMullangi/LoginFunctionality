const nodeMailer = require('nodemailer');
var generator = require('random-password');


var mailSent = async (req, res, next) => {
    var transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'thd.project2.0@gmail.com',
            pass: 'thdproject@2.0'
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    var mailOptions = {

        to: 'tmullangi@miraclesoft.com',
        subject: 'Password Changed',
        from: '"THD Project" <thd.project2.0@gmail.com>',
        html: '<h1>Your New Password is :</h1>' + '<b>' + generator(10) + '</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        else {
            console.log(info);
        }

        res.send({ "Info": "Password Changed,Check Your registered Email" });
    });
}
module.exports = {
    mailSent: mailSent
}