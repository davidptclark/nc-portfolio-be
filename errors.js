exports.error500 = (err, req, res, next) => {
    res.status(500)
        .send({msg: 'server error'})
}


exports.customerrors =(err, req, res, next) => {
    if(err.status) {
        res.status(err.status)
            .send({msg: err.msg})
    }else {

    next(err);

    }
}

exports.psqlerrors = (err,req,res,next) => {
    if (err.code = "22P02") {
        res.status(400)
            .send({msg: "Bad request"})
    }else{
        
        next(err)
    }
}