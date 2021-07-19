const express = require('express')

const app = express()

const NodeMediaServer = require('node-media-server');

const http = require('http');

const server = http.createServer(app);

const userRoute = require('./routes/user');

const { Server } = require('socket.io');



const io = new Server(server);




const adminRouter = require('./routes/adminRoute');
const editorRouter = require('./routes/editorRoute')
const testRouter = require('./routes/testRouter');
var dateFormat = require('dateformat');

var saveStream = require('./model/saveStreamModel');

var session = require('express-session');


const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');

var session = require('express-session');


const port = 3000;
console.log(port)

const portserver = 8000;


const mongoose = require('mongoose')
const { MONGODB_URL } = require('./config');
const bodyParser = require('body-parser');
const authToken = require('./middleware/authToken');
const fileUpload = require('express-fileupload');
const fs = require('fs');

var cors = require('cors');

app.use(cors());

app.use(cors({
    origin: '*'
}));


app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to database");

    return server.listen(port)
}).then(() => {

}).catch((err) => {
    console.log(err.message);
})

/***
 * 
 * Managing Routes
 * 
 * 
 *****/

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.use('/mystream', express.static(__dirname + 'data' + '/media'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));



app.use('/admin', adminRouter);
app.use('/editor', editorRouter);

app.use('/test', testRouter);

//api routes
app.use('/api', userRoute);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/assets/myfile.html'))
}
)

//stream video 

app.get('/playVideo', function (req, res) {
    console.log(req.query)


    if (!req.query.streamId) {
        res.status(422).json({ error: "Please provide stream id" });
    }
    var testFolder = path.join(__dirname + 'data', "media/live/" + req.query.streamId);


    var myfilename = fs.readdir(testFolder, (err, files) => {
        if (err) {
            res.status(404).json({ error: "No stream found !" });
        }
        files.forEach(file => {
            console.log(file);
            myfilename = file;


            const myfilepath = testFolder + "/" + myfilename;

            const stat = fs.statSync(myfilepath)
            const fileSize = stat.size
            const range = req.headers.range

            // res.status(200).json({ path: myfilepath });

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize - 1

                const chunksize = (end - start) + 1
                const file = fs.createReadStream(path, { start, end })
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                }

                res.writeHead(206, head)
                file.pipe(res)
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                }
                res.writeHead(200, head)
                fs.createReadStream(myfilepath).pipe(res)
            }
        });
    });


})


app.get('/getfilename', function (req, res) {
    console.log(req.query)


    if (!req.query.streamId) {
        res.status(422).json({ error: "Please provide stream id" });
    }
    var testFolder = path.join(__dirname + 'data', "media/live/" + req.query.streamId);


    var myfilename = fs.readdir(testFolder, (err, files) => {
        if (err) {
            return res.status(200).json({ error: "No stream found !" });
        }
        files.forEach(file => {
            console.log(file);
            myfilename = file;




            return res.status(200).json({ url: myfilename });

        });
    });


})

app.get('/testview', (req, res) => {
    res.render('demoStream');
})

app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
})

/***
 * 
 * Managing Stream Server
 * 
 * 
 *****/

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: portserver,
        mediaroot: path.join(__dirname + 'data', "media"),
        allow_origin: '*'
    },
    trans: {
        ffmpeg: ffmpegPath,
        tasks: [
            {
                app: 'live',
                mp4: true,
                mp4Flags: '[movflags=frag_keyframe+empty_moov]',

            }
        ]
    }
};

var nms = new NodeMediaServer(config)

try {
    nms.run();
    console.log("Initiated Media Server");
} catch (error) {

}


nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
});

nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {

});

nms.on('prePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // // let session = nms.getSession(id);
    // // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('prePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
    var datetime = dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss");
    console.log('[connected time : ] ' + datetime);
    console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // var cod = savestreamtodb(id, StreamPath, datetime);
    // console.log(cod)
});

nms.on('donePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});





/***
 * 
 * Save stream to database 
 * 
 * 
 *****/


function savestreamtodb(id, path, name) {

    var url = "http://localhost:3000/mystream" + path + "/" + name + ".mp4";
    var mystream = new saveStream({
        id, path, url
    });

    try {
        mystream.save();
    } catch (error) {
        console.log("error while saving stream " + error);
    }

    console.log("Saved to database");
    return 0;
}






/***
 * 
 * Managing Socket
 * 
 * 
 *****/

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


/***
 *
 * test routes
 *
 *
 *****/

