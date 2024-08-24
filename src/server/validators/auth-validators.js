const z = require("zod");

const signupValidator = z.object({
    username : z
    .string({required_error : "Username is required"})
    .min(4, {message : "username must be atleast 4 characters long"})
    .trim(),
    password : z
    .string({required_error : "Password is required"})
    .min(6,{message : "password must be atleast 6 characters long"})
    .trim(),
    email : z
    .string({required_error : "Email is required"})
    .email({message : "Invalid email format"})
    .trim(),
})

const loginValidator = z.object({
    email : z
    .string({required_error : "Email is required"})
    .email({message : "Invalid email format"})
    .trim(),
    password : z
    .string({required_error : "Password is required"})
    .min(6,{message : "password must be atleast 6 characters long"})
    .trim(),
})

module.exports = {signupValidator,loginValidator};