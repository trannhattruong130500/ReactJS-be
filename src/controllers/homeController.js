import db from "../models/index.js"
import CRUDService from "../services/CRUDService"

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render(`homePage.ejs`, {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }
}
let getAboutMe = (req, res) => {
    return res.render('test/about.ejs');
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    console.log(message)
    return res.send('post crud from server')
}
let displayGetCRUD = async (req, res) =>{
    let data= await CRUDService.getAllUser();
 
    return res.render('displayCRUD.ejs', {
        dataTable : data
    })
}
let editGetCRUD = async (req, res) => {
    let userId= req.query.id;
    if (userId){
        let userData = await CRUDService.getUserInfoId(userId)

        return res.render('editCRUD.ejs',{
            user : userData
        })
    }else{
        return res.send('User not found')
    }

}
let putCRUD = async (req, res) => {
    let data = req.body
    let allUsers = await CRUDService.updateUserData(data)
    return res.render('displayCRUD.ejs', {
        dataTable : allUsers
    })
}
let deleteCRUD = async (req, res) =>{
    let id = req.query.id;
    await CRUDService.deleteUserId(id)
    if(id){
        await CRUDService.deleteUserId(id)
        return res.send("Delete users success!!")
    }
    else{
        return res.send("User not found!")
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutMe: getAboutMe,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editGetCRUD: editGetCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}