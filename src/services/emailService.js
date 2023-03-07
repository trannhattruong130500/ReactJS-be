require('dotenv').config();
import nodemailer from 'nodemailer'

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // hostname
        secure: false, // use SSL
        port: 587, // port for secure SMTP
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let info = await transporter.sendMail({
        from: '"Hỏi dân IT 👻" <truongtran130500@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin Chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email đặt lịch khám bệnh online từ Hỏi dân IT</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <p>Nếu thông tin này là thật vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You are got email set the history of online from HoidanIT</p>
        <p>Information to schedule an appointment:</p>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <div><b>Time: ${dataSend.time}</b></div>
        <p>If this information is true, please click on the link below to complete the procedure to book an appointment</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Thank you very much!</div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", // hostname
                secure: false, // use SSL
                port: 587, // port for secure SMTP
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            let info = await transporter.sendMail({
                from: '"Hỏi dân IT 👻" <truongtran130500@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin Chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email đặt lịch khám bệnh online từ Hỏi dân IT</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <p>Nếu thông tin này là thật vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Hello ${dataSend.patientName}</h3>
        <p>You are got email set the history of online from HoidanIT</p>
        <p>Information to schedule an appointment:</p>
        <p>If this information is true, please click on the link below to complete the procedure to book an appointment</p>
        <div>Thank you very much!</div>
        `
    }
    return result;
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}