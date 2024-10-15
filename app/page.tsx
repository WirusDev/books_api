'use client';

import { getData } from '@/lib/getData';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  interface Book {
    volumeInfo: {
      title?: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        smallThumbnail?: string;
      };
      language?: string;
      infoLink?: string;
    };
    id: string;
  }

  interface BooksResponse {
    items: Book[];
  }

  const [books, setBooks] = useState<BooksResponse>({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setBooks({ items: [] });
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    try {
      const response = await getData(data.Search as string);
      setBooks(response);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function truncateString(str: string, maxLength: number) {
    if (!str) {
      return '';
    }
    return str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;
  }
  return (
    <section className=" min-h-screen w-screen ">
      <h1 className=" content-center text-4xl text-left mx-4 py-2">
        Search a Book
      </h1>
      <form method="get" onSubmit={onSubmit}>
        <label className="input input-bordered flex items-center w-96 gap-2 mx-4">
          <input
            type="text"
            name="Search"
            className="grow"
            placeholder="Search"
          />
          {loading && (
            <div className="h-4 w-4 opacity-70">
              <span className="loading loading-spinner text-accent "></span>
            </div>
          )}
          {!loading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </label>
      </form>

      {error && (
        <div className="text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}
      {!error && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
          {books.items.map((book: Book) => (
            <div
              className="card card-side  bg-gray-100 w-full shadow-xl"
              key={book.id}
            >
              <figure className="">
                {book.volumeInfo.imageLinks?.smallThumbnail ? (
                  <Image
                    width={300}
                    height={600}
                    src={book.volumeInfo.imageLinks.smallThumbnail}
                    alt={book.volumeInfo.title ?? 'No alt available'}
                    className="h-full w-max rounded-l-lg"
                  />
                ) : (
                  <div className="flex h-[100px] w-[35%]   items-center justify-center ">
                    <span>No Image Available</span>
                  </div>
                )}
              </figure>
              <div className="card-body text-black">
                <h2 className="card-title">
                  {truncateString(
                    book.volumeInfo.title ?? 'No title available',
                    30,
                  )}
                </h2>
                <p>
                  {book.volumeInfo?.authors?.join(', ') || 'Unknown Author'}
                </p>
                <Link
                  className="link link-secondary"
                  href={book.volumeInfo.infoLink ?? 'No Link available'}
                >
                  More info
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {!error && !loading && books.items.length === 0 && (
        <div className="text-center">
          <p>No books found for your search.</p>
        </div>
      )}
    </section>
  );
}
