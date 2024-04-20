// Add this JavaScript code in a separate .js file, let's say navigation.js

document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('nav a');

  // Add event listener to each navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default link behavior

      // Get the target page URL from the href attribute of the clicked link
      const targetUrl = link.getAttribute('href');

      // Navigate to the target page
      window.location.href = targetUrl;
    });
  });
});
