const io = require('socket.io');
const Document = require('../schemas/document-schema');
const User = require('../schemas/user-schema');
const setupSocketIO = (server) => {
    const socketIO = io(server, {
        cors: {
            origin: ['https://google-docs-clone-9yqk.vercel.app'], // Adjust as needed
            methods: ['GET', 'POST']
        }
    });

    socketIO.on('connection', (socket) => {

        socket.on('get-document', async (documentId) => {
            const delta = await Document.findById(documentId);

            socket.join(documentId);
            socket.emit('load-document',delta.content,delta.title);

            socket.on('send-changes',async (delta,title) => {
                socket.broadcast.to(documentId).emit('receive-changes', delta,title);
            }); 

            socket.on('save-document', async (data,title,user) => {
                const document = await Document.findById(documentId);
    
                // Construct the base update object
                const updateObject = {
                $set: {
                    content: data,
                    lastModified: Date.now(),
                    title: title || 'Untitled',
                },
                };

                // Check if user is provided and not equal to the user who created the document
                if (user && user !== document.userId && !document.sharedWith.includes(user)) {
                // Add the $push operation only if user is unique and not the creator
                updateObject.$push = {
                    sharedWith: user,
                };
                }
                await Document.findByIdAndUpdate(documentId, updateObject);
            });
        });

        

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

  
};

module.exports = setupSocketIO;
