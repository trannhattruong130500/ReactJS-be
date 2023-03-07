import db from "../models/index";
require('dotenv').config();
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';

let builURLEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType ||
                !data.date || !data.fullName || !data.address ||
                !data.selectedGender || !data.phoneNumber) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    doctorName: data.doctorName,
                    time: data.timeString,
                    language: data.language,
                    redirectLink: builURLEmail(data.doctorId, token)
                })

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        address: data.address,
                        gender: data.selectedGender,
                        firstName: data.fullName,
                        phoneNumber: data.phoneNumber

                    }
                });

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Upload data patient Succeed',
                    exTraMesage: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let postVeryfiAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token && !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment Succeed',
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: ' Appointment has been activated or does not exist',
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVeryfiAppointment: postVeryfiAppointment
}