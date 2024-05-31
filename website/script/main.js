const LoginForm = document.getElementById('login-form-id');
const signUpForm = document.getElementById('sign-up-form-id');
const logoutBtn = document.getElementById('logout-button');

// submit account to db
const onCreateUser = (e) => {
  e.preventDefault();
  const fn = document.querySelector('#sign-up-form-id #first-name');
  const ln = document.querySelector('#sign-up-form-id #last-name');
  const un = document.querySelector('#sign-up-form-id #username');
  const pw = document.querySelector('#sign-up-form-id #password');
  const regex = /^[a-zA-Z]+$/;
  if (regex.test(fn.value) && regex.test(ln.value)) {
    const arr1 = getUsersFromStorage().length;
    if (checkIfUserExist(un.value)) {
      alert('This username is exist!');
    } else {
      addUserToStorage({
        fullName: `${fn.value} ${ln.value}`,
        username: un.value,
        password: pw.value,
      });
      console.log(getUsersFromStorage());
    }
    const arr2 = getUsersFromStorage().length;
    if (arr1 !== arr2) {
      window.location.href = 'login.html';
    }
  } else {
    alert('Enter your name in letters from a to z or A to Z');
  }
};

// Get all users from storage
const getUsersFromStorage = () => {
  let usersFromStorage;

  localStorage.getItem('users') === null
    ? (usersFromStorage = [])
    : (usersFromStorage = JSON.parse(localStorage.getItem('users')));

  return usersFromStorage;
};

// Add user to storage
const addUserToStorage = (user) => {
  const usersFromStorage = getUsersFromStorage();

  // Add new user to arry
  usersFromStorage.push(user);

  // Convert to JSON string and set to local storage
  localStorage.setItem('users', JSON.stringify(usersFromStorage));
};

// Check if user exist
const checkIfUserExist = (un) => {
  const arr = [];
  getUsersFromStorage().forEach((u) => {
    arr.push(u.username);
  });
  if (arr.includes(un)) {
    return true;
  }
};

// validate if user exist
const validateUnAndPw = (un, pw) => {
  const arrUn = [];
  const arrPw = [];
  getUsersFromStorage().forEach((u) => {
    arrUn.push(u.username);
    arrPw.push(u.password);
  });
  if (arrUn.includes(un) && arrPw.includes(pw)) {
    return true;
  }
};

const checkLoginLs = () => {
  let loginStatus;

  localStorage.getItem('isLogin') === null
    ? (loginStatus = false)
    : (loginStatus = JSON.parse(localStorage.getItem('isLogin')));
  return loginStatus;
};
const checkLoginSs = () => {
  let loginStatus;

  sessionStorage.getItem('isLogin') === null
    ? (loginStatus = false)
    : (loginStatus = JSON.parse(sessionStorage.getItem('isLogin')));
  return loginStatus;
};

const getFullName = (un) => {
  const arr = getUsersFromStorage();
  for (const u of arr) {
    if (u.username === un) {
      return u.fullName;
    }
  }
};

// Redirect user to dashboard
const redirect = (e) => {
  e.preventDefault();
  const loginUn = document.querySelector('#login-form-id #username');
  const loginPw = document.querySelector('#login-form-id #password');
  if (validateUnAndPw(loginUn.value, loginPw.value)) {
    if (document.querySelector('#remember').checked) {
      localStorage.setItem('isLogin', JSON.stringify({ status: true }));
    } else {
      sessionStorage.setItem('isLogin', JSON.stringify({ status: true }));
    }
    let currentUser = getFullName(loginUn.value);
    console.log(currentUser);
    localStorage.setItem(
      'currentLog',
      JSON.stringify({ fullName: currentUser })
    );
    window.location.href = 'content-page.html';
  } else {
    alert('Please enter valid username and password!');
    return;
  }
};
const logoutFn = (e) => {
  e.preventDefault();
  localStorage.removeItem('isLogin');
  localStorage.removeItem('currentLog');
  sessionStorage.removeItem('isLogin');
  window.location.href = 'login.html';
};

const myForm = document.querySelector('[data-page]');
const init = () => {
  switch (myForm.dataset.page) {
    case 'login':
      document.addEventListener('DOMContentLoaded', () => {
        (checkLoginSs() || checkLoginLs()) &&
          (window.location.href = 'content-page.html');
      });
      LoginForm.addEventListener('submit', redirect);
      break;
    case 'sign-up':
      signUpForm.addEventListener('submit', onCreateUser);
      break;
    case 'content-page':
      document.addEventListener('DOMContentLoaded', () => {
        !(checkLoginLs() || checkLoginSs()) &&
          (window.location.href = 'login.html');
      });
      const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem('currentLog')).fullName;
      };
      document.querySelector(
        '#content-page h1'
      ).innerText = `Welcome ${getCurrentUser()} to your profile!`;
      logoutBtn.addEventListener('click', logoutFn);
      break;
    case 'home':
      document.addEventListener('DOMContentLoaded', () => {
        (checkLoginSs() || checkLoginLs())&&
          (document
            .querySelectorAll('.nav-item , .page')
            .forEach((el) => el.classList.toggle('hide')));
      });
  }
};

init();
