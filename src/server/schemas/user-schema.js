const {Schema,model} = require('mongoose');

const {createHmac, randomBytes} = require('crypto');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    salt: {
        type: String,
        },
    profileImage: {
        type: String,
        default: 'https://www.gravatar.com/avatar/000?d=mp'
    },
    
},{timestamps:true});

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static("matchPassword", async function(email, password){
    try{
        const user = await this.findOne({email});
        if(!user){
            const error = new Error('User Not Found');
            error.statusCode = 404;
            throw error;
        }
        const salt = user.salt;
        const hashedPassword = user.password;
        const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex");
        if(hashedPassword !== userProvidedHash){
            const error = new Error('Password is not matched');
            error.statusCode = 401;
            throw error;
        }
        return user;
    }
    catch(err){
        throw err;
    }
});

module.exports = model('userSchema',userSchema);