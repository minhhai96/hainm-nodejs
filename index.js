var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

//Mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hainmnode:docthoai123@cluster0-adngt.mongodb.net/Marvels?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, function(err) {
    if (err) {
        console.log("Mongo connect err", err)
    } else {
        console.log("Mongo connect successfull")
    }
});



//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Models
var Marvel = require("./models/marvel");

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.minetype=="image/jpg" || file.minetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("marvelImage");

app.get("/add", function (req, res) {
    res.render("add")
});

app.post("/add", function (req, res) {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.send({"kq": 0, "errMsg": "A Multer error occurred when uploading."})
        } else if (err) {
            res.send({"kq": 0, "errMsg": "An unknown error occurred when uploading."})
        }else{
            // res.send(req.file.filename);
            var marvel = Marvel({
                Name: req.body.txtName,
                Image: req.file.filename,
                Level: req.body.txtLevel
            });
            marvel.save(function(err) {
                if(err) {
                    res.json({"kq": 0, "errMsg": err})
                } else {
                    res.json({"kq": 1})
                }
            })
        }
    });
});

// List

app.get("/list", function (rq, res) {
    Marvel.find(function (err, data) {
        if (err) {
            res.json({"kq": 0, "errMsg": err})
        } else {
            res.render("list", {danhsach: data})
        }
    })
})
