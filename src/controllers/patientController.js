import patientService from '../services/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let book = await patientService.postBookAppointment(req.body)
        return res.status(200).json(book)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        });
    }
}

let postVeryfiAppointment = async (req, res) => {
    try {
        let book = await patientService.postVeryfiAppointment(req.body)
        return res.status(200).json(book)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        });
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVeryfiAppointment: postVeryfiAppointment
}