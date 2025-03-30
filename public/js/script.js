document.querySelector("#showPassword").addEventListener("click", () => {
    let input = document.querySelector("#password")
    if (input.type === "password") {
      input.type = "text"
    } else {
      input.type = "password"
    }
  })