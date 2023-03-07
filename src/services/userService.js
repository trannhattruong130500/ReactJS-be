import db from "../models/index"
import bcrypt from 'bcryptjs';
import { raw } from "body-parser";


const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true,
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = `OK`;
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong Password`;
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `You's email isn't exist in your system. Plz try other email`
            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)

        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}
let createNewUsers = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail === true) {
                resolve({
                    errCode: 1,
                    message: 'Email exist, plz try another email!'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: 'R3',
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let deleteUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let Users = await db.User.findOne({
                where: { id: userId }
            })
            if (!Users) {
                resolve({
                    errCode: 2,
                    message: 'User is not exist!'
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                message: 'Users deleted'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    message: 'Messing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                })
            } else {
                resolve({
                    errCode: 1,
                    message: 'Users Not Found!'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paremeters !'
                })
            } else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUsers: createNewUsers,
    deleteUsers: deleteUsers,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
}