
// this functoin for search with book name or book author and display the data.
function searchAndDisplayBookDetails(bookName) {
  const query = bookName.toLowerCase(); 
  const results = libraryBooks.filter(book => {
      return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
  }
   );

  if (results.length > 0) {
      results.forEach(book => {
    
        console.log("Title:", book.title); 

          console.log("Author:", book.author);

          console.log("Pages:", book.pages);

          console.log("\n");
    }
      );
        } 
  
  else {
      console.log("Book not found.");
  }
    }


// Function to check out a book if available.
function checkOutBook(bookId) {

  const book = libraryBooks.find(book => book.id === bookId);
  if (book) {
      if (book.available) {
          book.available = false;
          console.log("Book checked out successfully.");
      } 
      else {
          console.log("Book is not available for checkout.");
      }
  } 
  
  else {
      console.log("Book not found.");
  }
}


//  and this Function to return a book 
function returnBook(bookId) {

  const book = libraryBooks.find(book => book.id === bookId);

  if (book) {
    if (!book.available) {
         book.available = true;
         console.log("Book returned successfully.");
      } 
    else {
         console.log("Book is already available.");
      }

    }
   else {
      console.log("Book not found.");
     }
} 
 



