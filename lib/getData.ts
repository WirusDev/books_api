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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching data:', error.message);
      throw error;
    } else {
      console.error('An unexpected error occurred:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}
