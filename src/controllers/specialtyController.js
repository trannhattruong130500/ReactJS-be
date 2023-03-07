import specialtyService from '../services/specialtyService'

let createSpecialty = async (req, res) => {
    try {
        let book = await specialtyService.createSpecialty(req.body)
        return res.status(200).json(book)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        });
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let book = await specialtyService.getAllSpecialty()
        return res.status(200).json(book)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        });
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from Server'
        })
    }
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}