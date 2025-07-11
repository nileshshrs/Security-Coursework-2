const catchErrors=(fn) => async (req, res, next) => {
    try{
        await fn(req, res, next);
    }catch(errror){
        next(errror);
    }
}

export default catchErrors;