export interface Book {
  id: number;
  title: string;
  genre: string;
  year: number;
  pages: number;
}

export const books: Book[] = [
  { id: 1, title: "1984", genre: "Dystopian", year: 1949, pages: 328 },
  { id: 2, title: "The Hobbit", genre: "Fantasy", year: 1937, pages: 310 },
  {
    id: 3,
    title: "Pride and Prejudice",
    genre: "Romance",
    year: 1813,
    pages: 432,
  },
  { id: 4, title: "Moby Dick", genre: "Adventure", year: 1851, pages: 635 },
];
