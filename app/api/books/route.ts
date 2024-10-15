import { NextResponse, NextRequest } from 'next/server';

export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || typeof q !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid query parameter' },
      { status: 400 },
    );
  }

  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    console.log('API Key is defined:', !!apiKey);

    if (!apiKey) {
      console.error('GOOGLE_BOOKS_API_KEY is not defined');
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        q,
      )}&key=${apiKey}`,
    );

    if (!response.ok) {
      const errorInfo = await response.json();
      return NextResponse.json(
        { error: errorInfo.error?.message || 'Error fetching data' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data from Google Books API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
