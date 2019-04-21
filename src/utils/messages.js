const generateMessage = (username, text) => {
    return {
        username,
        text,
        date : new Date().getTime()
    }
}   

module.exports = {
    generateMessage
}