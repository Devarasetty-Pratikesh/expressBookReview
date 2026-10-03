const { getAllBooksAsync, getBookByISBNAsync, getBooksByAuthorAsync, getBooksByTitleAsync } = require('./router/general.js');

async function testAll() {
  console.log("=== Testing Task 10: getAllBooksAsync (async/await) ===");
  const allBooks = await getAllBooksAsync();
  console.log("Total books retrieved:", Object.keys(allBooks).length);
  console.log("First book title:", allBooks["1"].title);

  console.log("\n=== Testing Task 11: getBookByISBNAsync (Promises) ===");
  const bookByISBN = await getBookByISBNAsync("1");
  console.log("Book retrieved by ISBN 1:", bookByISBN.title, "-", bookByISBN.author);

  console.log("\n=== Testing Task 12: getBooksByAuthorAsync (async/await) ===");
  const booksByAuthor = await getBooksByAuthorAsync("Jane Austen");
  console.log("Books retrieved by author 'Jane Austen':", booksByAuthor.length, "book(s)");
  console.log("First match:", booksByAuthor[0].title);

  console.log("\n=== Testing Task 13: getBooksByTitleAsync (async/await) ===");
  const booksByTitle = await getBooksByTitleAsync("Pride and Prejudice");
  console.log("Books retrieved by title 'Pride and Prejudice':", booksByTitle.length, "book(s)");
  console.log("First match author:", booksByTitle[0].author);
}

testAll()
  .then(() => console.log("\nAll Axios-based general.js operations executed successfully!"))
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  });
