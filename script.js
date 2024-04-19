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
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
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
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static editBook(el) {
    const row = el.parentElement.parentElement;
    const cells = row.querySelectorAll('td:not(:last-child)'); // Exclude last cell with buttons

    cells.forEach((cell) => {
      const text = cell.textContent;
      cell.innerHTML = `<input type="text" value="${text}">`;
    });

    el.textContent = 'Save';
    el.classList.remove('edit');
    el.classList.add('save');
  }

  static saveBook(el) {
    const row = el.parentElement.parentElement;
    const cells = row.querySelectorAll('td:not(:last-child)'); // Exclude last cell with buttons

    cells.forEach((cell) => {
      const newValue = cell.querySelector('input').value;
      cell.innerHTML = newValue;
    });

    el.textContent = 'Edit';
    el.classList.remove('save');
    el.classList.add('edit');

    const updatedBook = {
      title: cells[0].textContent,
      category: cells[1].textContent,
      author: cells[2].textContent
    };

    const rowIndex = row.rowIndex - 1; // Adjust index for header row
    const books = Store.getBooks();
    books[rowIndex] = updatedBook;
    localStorage.setItem('books', JSON.stringify(books));
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#category').value = '';
    document.querySelector('#author').value = '';
  }
}



// Store Class: Handles Local Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(author) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.author === author) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}


// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const category = document.querySelector('#category').value; // Update this line
  const author = document.querySelector('#author').value;

  // Validate
  if (title === '' || category === '' || author === '') { // Update this line
    UI.showAlert('Please fill in all fields', 'danger');
  } else {
    // Instantiate book
    const book = new Book(title, category, author); // Update this line

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});



// Event: Remove a Book or Edit a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show success message for book deletion
    UI.showAlert('Book Removed', 'success');
  } else if (e.target.classList.contains('edit')) {
    // Edit book
    UI.editBook(e.target);
  } else if (e.target.classList.contains('save')) {
    // Save edited book
    UI.saveBook(e.target);
  }
});