const updateButton = (form_id, button_id) => {
    const form = document.querySelector(`#${form_id}`)
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector(`#${button_id}`)
      updateBtn.removeAttribute("disabled")
    })
  }
  
  updateButton("updateAccountForm", "updateAccountButton")
  updateButton("changePasswordForm", "changePasswordButton")