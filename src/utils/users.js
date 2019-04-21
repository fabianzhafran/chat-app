// Save users on an array
const users = []

// addUsers, removeUser, getUser, getUsersInRoom

const addUsers = ({username, id, roomname}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()

    // validate username and room
    if (!username || !roomname) {
        return {
            error : 'Username and roomname are required.'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return username === user.username && roomname === user.roomname
    })

    // If username already exists in the same room, return error
    if (existingUser) {
        return {
            error : 'Username has already been taken.'
        }
    }

    // Store the user
    const user = {username, id, roomname}
    users.push(user)
    return {user}
}

// Remove User
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    // Index not found, username is not stored on array
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

}

// Get User
const getUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users[index]
    }
}

// Get All User in the same room
const getUsersInRoom = (roomname) => {
    const tempArr = []
    const pushUser = users.find((user) => {
        if (user.roomname === roomname.trim().toLowerCase()) {
            tempArr.push(user)
        }
    })
    return tempArr
}

module.exports = {
    addUsers,
    removeUser,
    getUser,
    getUsersInRoom,
    users
}


