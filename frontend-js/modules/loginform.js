// import axios from  'axios'

// export default class LoginForm {
//     constructor(){
//         this.loginForm = document.querySelector('#loginForm')
//         this.loginEmail = document.querySelector('#loginEmail')
//         this.loginPassword = document.querySelector('#loginPassword')
 
//         this.events()
//     }

//     events(){
//         this.loginForm.addEventListener("submit", (e)=>{
//             e.preventDefault()
 
//             this.loginHanlder()
            
//         })

//     }

//     loginHanlder(){
//         console.log("loginhandle")
//         axios.post('/login', {email: this.loginEmail.value, password: this.loginPassword.value}).then(result=> console.log(result.data)).catch(error=> console.log(error))


//     }
  

// }