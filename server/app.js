const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const async = require('async');
const fsPromises = fs.promises;
const app = express();
const bodyParser = require('body-parser');
const  multipart  =  require('connect-multiparty');  
const  multipartMiddleware  =  multipart();
var formidable = require('formidable');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
pathToDir = 'home';
var multer = require('multer');
var upload = multer({dest: 'home'})
app.use(express.static(__dirname + '/home')); // special local resources


async function getFiles (dirPath, callback) {
    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);

        var filePaths = [];
        let inc = 0;
        async.eachSeries(files, function (fileName, eachCallback) {
            var filePath = path.join(dirPath, fileName);
            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                    getFiles(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });

                } else {
                    var info = {};
                    info['name'] = fileName;
                    info['size'] = stat["size"];
                    info['modification'] = stat["mtime"];
                    info['path'] = 'http://localhost:3000/' + fileName;

                    let ext = path.extname(fileName);
                    if(['.svg', '.png', '.jpg', '.bmp', '.gif'].some(elem => elem == ext)) {
                        info['img'] = true;
                    } else {
                        info['img'] = false;
                    }

                    filePaths.push(info);
                    inc++;
                    eachCallback(null);
                }
            });
        }, function (err) {
            callback(err, filePaths);
        });
    });
}
app.post('/api/files/addFile',  (req, res) => {  

    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/home/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    return res.status(200).json({
        status: 'success'
    });
});

app.post('/api/files/remove', (req, res) => { 
    fs.unlink(pathToDir + '\\' + req.body.name, function(err){
        if(err) return console.log(err);
        return res.status(200).json({
            status: 'deleted'
        });
    });
});

app.post('/api/files/getAllFiles', async (req, res) => {  
    await getFiles(pathToDir, function (err, files) {      
        return res.status(200).json({
            status: 'success',
            data: files
        });
    })    
})

app.listen(3000, () => console.log('Server has been planted on port 3000'))
