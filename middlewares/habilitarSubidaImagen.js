import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/uploads/perfiles/')
    },
    filename: function(req,file,cb){
        cb(null, Math.random().toString(32).slice(7)+Date.now()+Math.random().toString(32).slice(7)+path.extname(file.originalname))
    }
})

var upload = multer({storage:storage/*,
    fileFilter:function(req,file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null,true);
        }else{
            cb(null,false);
        }
    }*/});

export default upload;
