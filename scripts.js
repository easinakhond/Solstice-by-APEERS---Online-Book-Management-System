// Global variables to store inventory and sales report data
        let inventory = []; // Array to store inventory data
        let salesReport = ''; // String to store sales report data

        // Function to update the inventory file display
        function updateInventoryFile() {
            let inventoryContent = "ISBN,Title,Author,Quantity,Price\n"; // CSV header
            inventory.forEach(book => { // Loop through inventory array
                inventoryContent += `${book.ISBN},${book.Title},${book.Author},${book.Quantity},${book.Price}\n`; // Append book details to CSV content
            });
            let blob = new Blob([inventoryContent], { type: "text/plain" }); // Create a Blob with inventory data
            let url = URL.createObjectURL(blob); // Create a URL for the Blob
            document.getElementById("inventory-embed").src = url; // Set the source of the inventory embed element
        }

        // Function to update the sales report file display
        function updateSalesReportFile() {
            let blob = new Blob([salesReport], { type: "text/plain" }); // Create a Blob with sales report data
            let url = URL.createObjectURL(blob); // Create a URL for the Blob
            document.getElementById("sales-report-embed").src = url; // Set the source of the sales report embed element
        }

        // Function to read and display the inventory
        function readInventory() {
            if (inventory.length === 0) { // Check if inventory is empty
                document.getElementById("output").innerHTML = "<p>No books in inventory.</p>"; // Display message if inventory is empty
                return; // Exit function
            }

            let output = "<h2>Inventory</h2>"; // Heading for inventory section
            output += "<table>"; // Start of table
            output += "<tr><th>ISBN</th><th>Title</th><th>Author</th><th>Quantity</th><th>Price</th></tr>"; // Table header row
            inventory.forEach(book => { // Loop through inventory array
                let formattedISBN = book.ISBN.replace(/(\d{3})(\d{1,5})(\d{1,7})(\d{1})/, '$1-$2-$3-$4'); // Format ISBN with hyphens
                output += "<tr>"; // Start of table row
                output += `<td>${formattedISBN}</td>`; // ISBN column
                output += `<td>${book.Title}</td>`; // Title column
                output += `<td>${book.Author}</td>`; // Author column
                output += `<td>${book.Quantity}</td>`; // Quantity column
                output += `<td>${book.Price}</td>`; // Price column
                output += "</tr>"; // End of table row
            });
            output += "</table>"; // End of table
            document.getElementById("output").innerHTML = output; // Display inventory table

            // Update inventory content
            updateInventoryFile();
        }

        // Function to show form for adding a new book
        function showAddBookForm() {
            let form = `
                <h2>Add New Book</h2>
                <form onsubmit="addBook(event)">
                    <label for="isbn">ISBN:</label>
                    <input type="text" id="isbn" required><br>
                    <label for="title">Title:</label>
                    <input type="text" id="title" required><br>
                    <label for="author">Author:</label>
                    <input type="text" id="author" required><br>
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" required><br>
                    <label for="price">Price:</label>
                    <input type="number" step="0.01" id="price" required><br>
                    <input type="submit" value="Add Book">
                </form>
            `;
            document.getElementById("output").innerHTML = form; // Display add book form
        }

        // Function to add a new book to inventory
        function addBook(event) {
            event.preventDefault(); // Prevent form submission
            let isbn = document.getElementById("isbn").value; // Get ISBN input value
            isbn = formatISBN(isbn); // Format the entered ISBN with hyphens
            if (!validateISBN(isbn)) { // Check if ISBN is valid
                alert("Invalid ISBN format."); // Show error message
                return; // Exit function
            }
            if (inventory.some(book => book.ISBN === isbn)) { // Check if book with same ISBN already exists
                alert("Book with this ISBN already exists. Please enter a unique ISBN."); // Show error message
                return; // Exit function
            }
            let title = document.getElementById("title").value; // Get title input value
            let author = document.getElementById("author").value; // Get author input value
            let quantity = parseInt(document.getElementById("quantity").value); // Get quantity input value
            let price = parseFloat(document.getElementById("price").value); // Get price input value
            inventory.push({ ISBN: isbn, Title: title, Author: author, Quantity: quantity, Price: price }); // Add book to inventory array
            readInventory(); // Display updated inventory

            // Show inventory link after adding book
            document.getElementById("inventory-link").style.display = "block";
        }

        // Function to show form for updating inventory
        function showUpdateForm() {
            let form = `
                <h2>Update Inventory</h2>
                <form onsubmit="updateInventory(event)">
                    <label for="isbn">ISBN:</label>
                    <input type="text" id="isbn" required><br>
                    <label for="quantity">New Quantity:</label>
                    <input type="number" id="newQuantity" required><br>
                    <input type="submit" value="Update Inventory">
                </form>
            `;
            document.getElementById("output").innerHTML = form; // Display update inventory form
        }

        // Function to update inventory quantity
        function updateInventory(event) {
            event.preventDefault(); // Prevent form submission
            let isbn = document.getElementById("isbn").value; // Get ISBN input value
            isbn = formatISBN(isbn); // Format the entered ISBN with hyphens
            let newQuantity = parseInt(document.getElementById("newQuantity").value); // Get new quantity input value
            let bookIndex = inventory.findIndex(book => book.ISBN === isbn); // Find index of book in inventory array
            if (bookIndex === -1) { // Check if book not found
                alert("Book with this ISBN not found in inventory."); // Show error message
                return; // Exit function
            }
            inventory[bookIndex].Quantity = newQuantity; // Update quantity of the book
            readInventory(); // Display updated inventory
        }

        // Function to show form for searching a book
        function showSearchForm() {
            let form = `
                <h2>Search Book</h2>
                <form onsubmit="searchBook(event)">
                    <label for="searchIsbn">ISBN:</label>
                    <input type="text" id="searchIsbn" required><br>
                    <input type="submit" value="Search">
                </form>
            `;
            document.getElementById("output").innerHTML = form; // Display search book form
        }

        // Function to search for a book in inventory
        function searchBook(event) {
            event.preventDefault(); // Prevent form submission
            let isbn = document.getElementById("searchIsbn").value; // Get ISBN input value
            isbn = formatISBN(isbn); // Format the entered ISBN with hyphens
            let book = inventory.find(book => book.ISBN === isbn); // Find book in inventory array
            if (book) { // Check if book found
                let output = `
                    <h2>Book Information</h2>
                    <table>
                        <tr><th>ISBN</th><th>Title</th><th>Author</th><th>Quantity</th><th>Price</th></tr>
                        <tr>
                            <td>${book.ISBN}</td>
                            <td>${book.Title}</td>
                            <td>${book.Author}</td>
                            <td>${book.Quantity}</td>
                            <td>${book.Price}</td>
                        </tr>
                    </table>
                `;
                document.getElementById("output").innerHTML = output; // Display book information
            } else {
                alert("Book with this ISBN not found in inventory."); // Show error message
            }
        }

        // Function to calculate total inventory value
        function calculateTotalValue() {
            let totalValue = inventory.reduce((acc, book) => acc + (book.Quantity * book.Price), 0); // Calculate total value of inventory
            let output = `<h2>Total Inventory Value: $${totalValue.toFixed(2)}</h2>`; // Display total value
            output += `<h3>Breakdown:</h3>`; // Breakdown heading
            output += `<ul>`; // Start of list
            inventory.forEach(book => { // Loop through inventory array
                let bookValue = book.Quantity * book.Price; // Calculate value of each book
                output += `<li>${book.Title} (ISBN: ${book.ISBN}): $${bookValue.toFixed(2)}</li>`; // Display book value
            });
            output += `</ul>`; // End of list
            document.getElementById("output").innerHTML = output; // Display total value breakdown
        }

        // Function to generate sales report form
        function generateSalesReportForm() {
            let form = `
                <h2>Generate Sales Report</h2>
                <form onsubmit="generateSalesReport(event)">
                    <label for="salesIsbn">ISBN:</label>
                    <input type="text" id="salesIsbn" required><br>
                    <label for="quantitySold">Quantity Sold:</label>
                    <input type="number" id="quantitySold" required><br>
                    <input type="submit" value="Generate Report">
                </form>
            `;
            document.getElementById("output").innerHTML = form; // Display generate sales report form
        }

        // Function to generate sales report
        function generateSalesReport(event) {
            event.preventDefault(); // Prevent form submission
            let isbn = document.getElementById("salesIsbn").value; // Get ISBN input value
            isbn = formatISBN(isbn); // Format the entered ISBN with hyphens
            let quantitySold = parseInt(document.getElementById("quantitySold").value); // Get quantity sold input value
            let bookIndex = inventory.findIndex(book => book.ISBN === isbn); // Find index of book in inventory array
            if (bookIndex === -1) { // Check if book not found
                alert("Book with this ISBN not found in inventory."); // Show error message
                return; // Exit function
            }
            if (inventory[bookIndex].Quantity < quantitySold) { // Check if enough quantity available
                alert("Not enough quantity available for sale."); // Show error message
                return; // Exit function
            }
            inventory[bookIndex].Quantity -= quantitySold; // Reduce quantity in inventory
            salesReport += `ISBN: ${isbn}, Quantity Sold: ${quantitySold}\n`; // Add sales report entry
            updateSalesReportFile(); // Update sales report file
            readInventory(); // Update inventory immediately after generating sales report

            // Show sales report link after generating report
            document.getElementById("sales-report-link").style.display = "block";
        }

        // Function to validate ISBN format
        function validateISBN(isbn) {
            // Remove hyphens to count only digits
            const isbnDigits = isbn.replace(/-/g, '');
            // Validate if ISBN consists of exactly 10 or 13 digits
            return /^\d{10}$/.test(isbnDigits) || /^\d{13}$/.test(isbnDigits);
        }

        // Function to format ISBN with hyphens
        function formatISBN(isbn) {
            // Remove non-digit characters
            isbn = isbn.replace(/[^\d]/g, '');
            // Add hyphens based on ISBN length
            if (isbn.length === 10) {
                return isbn.replace(/(\d{3})(\d{1,5})(\d{1,7})(\d{1})/, '$1-$2-$3-$4');
            } else if (isbn.length === 13) {
                return isbn.replace(/(\d{3})(\d{1,5})(\d{1,7})(\d{1})(\d{1})/, '$1-$2-$3-$4-$5');
            }
            return isbn; // Return as is if not 10 or 13 digits
        }

        // Function to toggle display of inventory and sales report
        function toggleContent(type) {
            let inventoryContent = document.getElementById("inventory-content");
            let salesContent = document.getElementById("sales-report-content");

            if (type === 'inventory') {
                if (inventoryContent.style.display === "none") {
                    inventoryContent.style.display = "block"; // Open inventory content
                    salesContent.style.display = "none"; // Close sales report content
                } else {
                    inventoryContent.style.display = "none"; // Close inventory content
                }
            } else if (type === 'sales') {
                if (salesContent.style.display === "none") {
                    salesContent.style.display = "block"; // Open sales report content
                    inventoryContent.style.display = "none"; // Close inventory content
                } else {
                    salesContent.style.display = "none"; // Close sales report content
                }
            }
        }
