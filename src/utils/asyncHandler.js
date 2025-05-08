const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
    };
};
export default asyncHandler;
// This function takes a function as an argument and returns a new function that handles errors.
// If the function throws an error, it catches it and sends a 500 status code with a message.
// This is useful for handling errors in asynchronous functions in Express.js.
// It allows you to write cleaner code by avoiding try-catch blocks in every route handler.
// This is a common pattern in Express.js to handle errors in a centralized way.
// It helps to keep the code clean and maintainable by avoiding repetitive error handling logic in each route handler.
// const asyncHandler = (fn) => (req, res, next) => {
//     try {
//         return fn(req, res, next);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
