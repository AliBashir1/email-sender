// import axios from  'axios'

export default class LoginForm {
  constructor() {
    this.loginForm = document.querySelector("#loginForm")
    this.forgotPassword = document.querySelector("#forgotPassword")
    this.emailRecoveryForm = document.querySelector("#emailRecoveryForm")

    this.events()
  }

  events() {
    this.forgotPassword.addEventListener("click", () => this.showEmailForm())
  }

  // email recovery form
  showEmailForm() {
    this.emailRecoveryForm.classList.toggle("d-none")
    this.loginForm.classList.toggle("d-none")
  }
}
