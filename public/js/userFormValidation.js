const submitBtn = document.getElementById('submit-button');

const validate = (e) => {
  e.preventDefault();
  const username = document.getElementById('username');
  const emailAddress = document.getElementById('email');
  const password = document.getElementById('password')

  const alertUsername = document.getElementById('alertUsername')
  const alertEmail = document.getElementById('alertEmail')
  const alertPassword = document.getElementById('alertPassword')

  if (username.value === "") {
    alertUsername.innerHTML = 'Indtast venligst et brugernavn'
    username.focus();
    return false;
  }
    
  if (emailAddress.value === "") {
    alertEmail.innerHTML = 'Indtast venligst din email'
    emailAddress.focus();
    return false;
  }

  if (!emailIsValid(emailAddress.value)) {
    alertEmail.innerHTML = 'Indtast venligst en gyldig email'
    emailAddress.focus();
    return false;
  }
  
  if(password.value === "") {
    alertPassword.innerHTML = 'Indtast venligst et password'
    password.focus();
    return false;
  }
  return true;
}

const emailIsValid = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

submitBtn.addEventListener('click', validate);