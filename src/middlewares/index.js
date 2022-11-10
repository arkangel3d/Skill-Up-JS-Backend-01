const emailIsUnique = require('./emalIsUnique');
const emailIsValid = require('./emailIsValid');
const firstNameIsValid = require('./firstNameIsValid');
const lastNameIsValid = require('./lastNameIsValid');
const checkUserId = require('./checkUserId');
const checkUserEmail = require('./checkUserEmail');
const passwordIsValid = require('./passwordIsValid');
const tokenIsValid = require('./tokenIsValid');
const isAdmin = require('./isAdmin');
const userHasAccess = require('./userHasAccess');
const profilePictureHandler = require('./profilePictureHandler')

module.exports = {
    emailIsUnique,
    emailIsValid,
    firstNameIsValid,
    lastNameIsValid,
    checkUserId,
    checkUserEmail,
    passwordIsValid,
    tokenIsValid,
    isAdmin,
    userHasAccess,
    profilePictureHandler
}