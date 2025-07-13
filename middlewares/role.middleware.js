function authorize(...roles) {
    return (request, response, next) => {
        const userRole = request.user.role

        if (!roles.includes(userRole)) {
            return response.sendStatus(403);
        }

        next();
    }
}

module.exports = authorize
