const {schema , model, Schema} = require('mongoose');
const { datetimeRegex, object } = require('zod');

const Document = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        required: true
    },
    username : {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: 'Untitled'
    },
    content: {
        type: Object,
    },
    lastModified: {
        // should be time
        type : Date,
        default: Date.now
    },
    sharedWith: {
        type: [Schema.Types.ObjectId],
        ref: 'userSchema'
    }
});


module.exports = model('Document', Document);