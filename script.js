// Book Class: Represents a book
class Book {
  constructor(title, category, author) {
    this.title = title;
    this.category = category;
    this.author = author;
  }
}

// UI Class: Handle UI Tasks (display, delete, edit)
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.category}</td>
      <td>${book.author}</td>
      <td>
        <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
        <a href="#" class="btn btn-primary btn-sm edit">Edit</a>
      </td>`;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static editBook(el) {
    const row = el.parentElement.parentElement;
    const cells = row.querySelectorAll("td:not(:last-child)"); // Exclude last cell with buttons

    cells.forEach((cell) => {
      const text = cell.textContent;
      cell.innerHTML = `<input type="text" value="${text}">`;
    });

    el.textContent = "Save";
    el.classList.remove("edit");
    el.classList.add("save");
  }

  static saveBook(el) {
    const row = el.parentElement.parentElement;
    const cells = row.querySelectorAll("td:not(:last-child)"); // Exclude last cell with buttons

    cells.forEach((cell) => {
      const newValue = cell.querySelector("input").value;
      cell.innerHTML = newValue;
    });

    el.textContent = "Edit";
    el.classList.remove("save");
    el.classList.add("edit");

    const updatedBook = {
      title: cells[0].textContent,
      category: cells[1].textContent,
      author: cells[2].textContent,
    };

    const rowIndex = row.rowIndex - 1; // Adjust index for header row
    const books = Store.getBooks();
    books[rowIndex] = updatedBook;
    localStorage.setItem("books", JSON.stringify(books));
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#author").value = "";
  }
}

// Store Class: Handles Local Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(author) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.author === author) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event : Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector("#title").value;
  const category = document.querySelector("#category").value; // Update this line
  const author = document.querySelector("#author").value;

  // Validate
  if (title === "" || category === "" || author === "") {
    // Update this line
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instantiate book
    const book = new Book(title, category, author); // Update this line

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert("Book Added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book or Edit a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show success message for book deletion
    UI.showAlert("Book Removed", "success");
  } else if (e.target.classList.contains("edit")) {
    // Edit book
    UI.editBook(e.target);
  } else if (e.target.classList.contains("save")) {
    // Save edited book
    UI.saveBook(e.target);
  }
});

//Form validations
function validateForm() {
  var fullname = document.getElementById("fullname").value;
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  // Resetting error messages
  var x = document.querySelectorAll(".error");
  x.forEach(function (el) {
    el.innerHTML = "";
  });

  var isValid = true;

  // Validate full name
  if (fullname.trim() === "") {
    document.getElementById("fullname-error").innerHTML =
      "Please enter your full name";
    isValid = false;
  } else if (!validateFullname(fullname)) {
    document.getElementById("fullname-error").innerHTML =
      "Please enter your first and last name";
    isValid = false;
  }

  // Validate username
  if (username.trim() === "") {
    document.getElementById("username-error").innerHTML =
      "Please enter a username";
    isValid = false;
  } else if (!validateUsername(username)) {
    document.getElementById("username-error").innerHTML =
      "Username must be between 3 and 20 characters long and can only contain letters, digits, and underscores";
    isValid = false;
  }

  // Validate email
  if (email.trim() === "") {
    document.getElementById("email-error").innerHTML =
      "Please enter your email";
    isValid = false;
  } else if (!validateEmail(email)) {
    document.getElementById("email-error").innerHTML =
      "Please enter a valid email address";
    isValid = false;
  }

  // Validate password
  if (password.trim() === "") {
    document.getElementById("password-error").innerHTML =
      "Please enter a password";
    isValid = false;
  }
  // Validate password confirmation
  if (confirmPassword.trim() === "") {
    document.getElementById("confirmPassword-error").innerHTML =
      "Please confirm your password";
    isValid = false;
  } else if (password !== confirmPassword) {
    document.getElementById("confirmPassword-error").innerHTML =
      "Passwords do not match";
    isValid = false;
  } else {
    if (password.length < 8) {
      document.getElementById("password-error").innerHTML =
        "Password must be at least 8 characters long";
      isValid = false;
    } else if (password.length > 14) {
      document.getElementById("password-error").innerHTML =
        "Password must be at most 14 characters long";
      isValid = false;
    } else if (!validatePasswordComplexity(password)) {
      document.getElementById("password-error").innerHTML =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      isValid = false;
    }
  }

  return isValid;
}

// Function to validate the full name
function validateFullname(fullname) {
  var regFullname = /^[a-zA-Z]+ [a-zA-Z]+$/;
  return regFullname.test(fullname);
}

// Function to validate email format
function validateEmail(email) {
  var regEmail =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  return regEmail.test(email);
}

function validateUsername(username) {
  var regUsername = /^(?=.{3,50}$)[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$/;
  return regUsername.test(username);
}

function validatePasswordComplexity(password) {
  var hasUppercase = /[A-Z]/.test(password);
  var hasLowercase = /[a-z]/.test(password);
  var hasNumber = /\d/.test(password);
  var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

function resetForm() {
  document.getElementById("form").reset();
  document.getElementById("fullname-error").innerHTML = "";
  document.getElementById("username-error").innerHTML = "";
  document.getElementById("email-error").innerHTML = "";
  document.getElementById("password-error").innerHTML = "";
  document.getElementById("confirmPassword-error").innerHTML = "";
}

function validateFullNameInput() {
  var fullname = document.getElementById("fullname").value.trim();
  var fullnameError = document.getElementById("fullname-error");
  if (fullname === "") {
    fullnameError.textContent = "Please enter your full name";
  } else if (!validateFullname(fullname)) {
    fullnameError.textContent = "Please enter your first and last name";
  } else {
    fullnameError.textContent = "";
  }
}

function validateUsernameInput() {
  var username = document.getElementById("username").value.trim();
  var usernameError = document.getElementById("username-error");
  if (username === "") {
    usernameError.textContent = "Please enter a username";
  } else if (!validateUsername(username)) {
    usernameError.textContent =
      "Username must be between 3 and 20 characters long and can only contain letters, digits, and underscores";
  } else {
    usernameError.textContent = "";
  }
}

function validateEmailInput() {
  var email = document.getElementById("email").value.trim();
  var emailError = document.getElementById("email-error");
  if (email === "") {
    emailError.textContent = "Please enter your email";
  } else if (!validateEmail(email)) {
    emailError.textContent = "Please enter a valid email address";
  } else {
    emailError.textContent = "";
  }
}

function validatePasswordInput() {
  var password = document.getElementById("password").value.trim();
  var passwordError = document.getElementById("password-error");
  if (password === "") {
    passwordError.textContent = "Please enter a password";
  } else if (!validatePasswordComplexity(password)) {
    passwordError.textContent =
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  } else if (password.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters long";
  } else if (password.length > 14) {
    passwordError.textContent = "Password must be at most 14 characters long";
  } else {
    passwordError.textContent = "";
  }
}

function validateConfirmPasswordInput() {
  var confirmPassword = document.getElementById("confirmPassword").value.trim();
  var password = document.getElementById("password").value.trim();
  var confirmPasswordError = document.getElementById("confirmPassword-error");
  if (confirmPassword === "") {
    confirmPasswordError.textContent = "Please confirm your password";
  } else if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match";
  } else {
    confirmPasswordError.textContent = "";
  }
}
function handleSignupFormSubmission() {
  var isValid = validateForm(); // Perform form validation

  if (isValid) {
    var fullname = document.getElementById("fullname").value.trim();
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var isAdmin = document.getElementById("is_admin").checked; // Check if admin checkbox is checked

    // Create a user object
    var user = {
      fullname: fullname,
      username: username,
      email: email,
      password: password,
    };

    // Store the user object in local storage based on admin status
    if (isAdmin) {
      localStorage.setItem("admin", JSON.stringify(user)); // Store as admin
    } else {
      localStorage.setItem("user", JSON.stringify(user)); // Store as regular user
    }

    // Optionally, you can redirect the user to the login page after signup
    window.location.href = "Login.html";
  }

  // Ensure the form submission is prevented if validation fails
  return isValid;
}

function handleLogin(userType) {
  var enteredUsername = document.getElementById("username-bar").value.trim();
  var enteredPassword = document.getElementById("password-bar").value.trim();

  // Check if the entered credentials match with user credentials
  if (userType === "user") {
    var user = JSON.parse(localStorage.getItem("user"));
    if (
      user &&
      enteredUsername === user.username &&
      enteredPassword === user.password
    ) {
      alert("Login as user successful!");
      window.location.href = "index.html"; // Redirect to user page
      return;
    }
  }

  // Check if the entered credentials match with admin credentials
  if (userType === "admin") {
    var admin = JSON.parse(localStorage.getItem("admin"));
    if (
      admin &&
      enteredUsername === admin.username &&
      enteredPassword === admin.password
    ) {
      alert("Login as admin successful!");
      window.location.href = "admin/adminhomepage.html"; // Redirect to admin page
      return;
    }
  }

  // If no user or admin found or invalid credentials
  else {
    alert("Check the user type , password or username");
  }
}
