const joinText = document.querySelector("#jointext")
const centeredForm = document.querySelector(".centered-form")
const centeredFormBox = document.querySelector(".centered-form__box")
const backgroundIMG = document.querySelector("#join-page")

joinText.style.opacity = '0.0'
centeredForm.style.opacity = '0.0'
centeredFormBox.style.opacity = '0.0'
    
let initialOpacity = -0.7
let finalOpacity = 1.0
let temp = ''

const textAnim = setInterval(() => {
    initialOpacity = initialOpacity + 0.015
    joinText.style.opacity = '' + initialOpacity
    centeredForm.style.opacity = '' + initialOpacity
    centeredFormBox.style.opacity = '' + initialOpacity
    finalOpacity = finalOpacity - 0.004
    backgroundIMG.style.backgroundImage = "linear-gradient(to right, rgba(0,0,0,"+ finalOpacity +"), rgba(0,0,0,"+ finalOpacity +")), url('../img/join-page.jpeg')";
    console.log(initialOpacity)
}, 7)

setInterval(() => {
    clearInterval(textAnim)
}, 1000)




