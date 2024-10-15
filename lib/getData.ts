export async function getData(bookName: string) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        bookName,
      )}&key=${process.env.NEXT_PUBLIC_API_KEY}`,
    );

    if (!res.ok) {
      // Non-200 HTTP response
      const errorInfo = await res.json();
      throw new Error(
        `Google Books API error: ${errorInfo.error?.message || res.statusText}`,
      );
    }

    const json = await res.json();

    if (!json.items || json.items.length === 0) {
      // No books found
      return { items: [] };
    }

    return json;
  } catch (error: any) {
    console.error('Error fetching data in getData:', error.message);
    // Throw the error to be handled by the caller
    throw new Error(
      error.message || 'Failed to fetch data from Google Books API',
    );
  }
}

// export async function getData(bookName: string) {
//   try {
//     const res = await fetch(
//       `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=${process.env.NEXT_PUBLIC_API_KEY}`,
//     );
//     const json = await res.json();
//     return json;
//   } catch (error) {
//     console.log(error);

//     return '{Error fetch Data in getData}';
//   }
// }
