const nodemailer = require('nodemailer');
const config = require("../config");


const html = '<div style="background:white; display:flex;">'+
                '<div><img></div>'+
                '<div> '+
             '</div>'



const transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT,
  secure: true,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
});

const sendMail = async(req, res) => {
  console.log(req.body)

  const info = await transporter.sendMail({
    from: config.MAIL_USER, // sender address
    to: "layyagami9@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: html, // html body
  });
}

module.exports = {
  sendMail
}