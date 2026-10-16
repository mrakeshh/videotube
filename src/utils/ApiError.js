class ApiError extends Error {
    constructor(
        statuscode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statuscode
        this.data = null
        //Assignment : What does this data contain? What is it?
        this.message = message
        this.success = false;
        this.errors = errors
 
        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}


//Api error revised
