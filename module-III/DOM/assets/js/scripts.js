const h1 = document.getElementById('page-title')
const footer = document.getElementsByTagName('footer')[0]
const body = document.getElementsByTagName('body')[0]
const button = document.getElementById('mode-selector')

button.addEventListener('click', function(){
    h1.classList.toggle('dark-mode')
    footer.classList.toggle('dark-mode')
    body.classList.toggle('dark-mode')
    button.classList.toggle('dark-mode')
    if(body.classList.contains('dark-mode')){
        button.innerHTML = 'Light Mode'
        h1.innerHTML = 'Dark Mode ON'
    } else {
        button.innerHTML = 'Dark Mode'
        h1.innerHTML = 'Light Mode ON'
    }
})