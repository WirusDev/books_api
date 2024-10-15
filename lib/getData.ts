// lib/getData.ts
export async function getData(bookName: string) {
  try {
    const res = await fetch(`/api/books?q=${encodeURIComponent(bookName)}`);

    if (!res.ok) {
      const errorInfo = await res.json();
      throw new Error(errorInfo.error || 'Failed to fetch data');
    }

    const json = await res.json();
    return json;
  } catch (error: any) {
    console.error('Error fetching data in getData:', error.message);
    throw new Error(error.message || 'Failed to fetch data from API');
  }
}
