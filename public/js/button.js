const btns = ['SignUp', 'SignIn'];

const navbar_nav = document.querySelector('.navbar_nav');

const submitButtons = () => {
    btns.map((curElem) => {
        navbar_nav.insertAdjacentHTML('afterbegin', `
       
        `);
    })
}

submitButtons();