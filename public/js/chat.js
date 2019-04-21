const socket = io()

// DOMs
const plusButton = document.querySelector("#plusButton")
const messageBar = document.querySelector("form") // Form tag in the html page
const $messageVal = messageBar.querySelector("input") // Message value from the message input
const $messageButton = messageBar.querySelector("button") // Button to send message from the form
const $sendLoc = document.querySelector("#location")
const $messages = document.querySelector("#messages")
const $sidebar = document.querySelector("#sidebar")

// Template
const messageTemplate = document.querySelector("#message-template").innerHTML // Message template
const locationTemplate = document.querySelector("#location-template").innerHTML // location template
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML // Sidebar template

// Options
// Parse the query string
const {username, roomname} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild
    
    // Height of the last message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight
    console.log(newMessageMargin)

    // Visible Height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far are the client scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// Send text messages
socket.on('messageContent', (msg) => {
    const htmlTxt = Mustache.render(messageTemplate, {
        username : msg.username,
        messageValue : msg.text,
        dateSent : moment(msg.date).format("H:mm")
    })
    $messages.insertAdjacentHTML("beforeend", htmlTxt)
    autoscroll()
})

// Send location
socket.on('locationContent', (loc) => {
    const htmlLoc = Mustache.render(locationTemplate, {
        username : loc.username,
        locationValue : loc.text,
        dateSent : moment(loc.date).format("H:mm")
    })
    $messages.insertAdjacentHTML("beforeend", htmlLoc)
    autoscroll()
})

// Render Room Name and Users In Room sidebar
socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})


messageBar.addEventListener('submit', (e) => {
    e.preventDefault()
    const msgmsg = e.target.elements.msg.value
    socket.emit('sendMessage', msgmsg, (badWordsCheck, responseMsg) => {
        if (badWordsCheck) { // badWordsCheck is filled if backend detects bad words
            const html = Mustache.render(messageTemplate, {
                username : badWordsCheck.username,
                messageValue : badWordsCheck.text,
                dateSent : moment(badWordsCheck.date).format("H:mm")
            })
            $messages.insertAdjacentHTML("beforeend", html)
        } else {
            console.log(responseMsg)
        }
    })
    e.target.elements.msg.value = "" // Remove input after message has been submitted
})

$sendLoc.addEventListener('click', () => {
    $sendLoc.setAttribute('disabled', 'disabled') // When client sends location, the button gets disabled until location has either arrived at client or dropped
    if (!navigator.geolocation) {
        return console.log("Geolocation is not supported by your browser.")
        $sendLoc.removeAttribute('disabled') 
    }
    navigator.geolocation.getCurrentPosition((position) => {
        $sendLoc.removeAttribute('disabled')
        socket.emit('sendLocation', `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`, (error, responseLoc) => {
            if (error) {
                console.log(error)
            } else {
                console.log(responseLoc)
            }
        })
    })
})

socket.emit('join', {username, roomname}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})


