class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
   err.message = err.message || "Internal Server Error";
   err.statusCode = err.statusCode || 500;

   if (err.code === 11000) {
       const message = "Duplicate key error";
       err = new ErrorHandler(message, 400);
   }
   if (err.name === "jsonWebTokenError"){
         const message = "Invalid token. Please log in again.";
         err = new ErrorHandler(message, 401);
   }
   if(err.name === "TokenExpiredError"){          
        const message = "Your token has expired. Please log in again."; 
        err = new ErrorHandler(message, 401);
   }

   const errorMessage = err.errors 
   ? Object.values(err.errors)
           .map((error) => error.message)
           .join(" ")
    : err.message;
    
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
}
export default ErrorHandler;
