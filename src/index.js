import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || 'SashaKris',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query('CREATE TABLE users (\n' +
    '  id SERIAL PRIMARY KEY,' +
    '  name VARCHAR(30) NOT NULL,' +
    '  date DATE NOT NULL DEFAULT(\'2022-11-14\'));');

  await client.query('CREATE TABLE categories (\n' +
    '  id SERIAL PRIMARY KEY,' +
    '  name VARCHAR(30) NOT NULL);');

  await client.query('CREATE TABLE authors (\n' +
    '  id SERIAL PRIMARY KEY,' +
    '  name VARCHAR(30) NOT NULL);');

  await client.query('CREATE TABLE books (\n' +
    ' id serial PRIMARY KEY NOT NULL,' +
    ' title VARCHAR(30) NOT NULL,' +
    ' userid INTEGER NOT NULL,' +
    ' FOREIGN KEY(userid) REFERENCES users(id)' +
    ' ON DELETE CASCADE,' +
    ' authorid INTEGER NOT NULL,' +
    ' FOREIGN KEY(authorid) REFERENCES authors(id)' +
    ' ON DELETE CASCADE,' +
    ' categoryid INTEGER NOT NULL,' +
    ' FOREIGN KEY(categoryid) REFERENCES categories(id)' +
    ' ON DELETE CASCADE' +
    ');');

  await client.query('CREATE TABLE descriptions (\n' +
    '  id SERIAL PRIMARY KEY,' +
    '  descriptions VARCHAR(10000) NOT NULL,' +
    '  bookid INTEGER  NOT NULL,' +
    '  FOREIGN KEY(bookid) REFERENCES book(id)' +
    '  ON DELETE CASCADE' +
    ');');

  await client.query('CREATE TABLE reviews (\n' +
    '  id SERIAL PRIMARY KEY,' +
    '  message VARCHAR(10000) NOT NULL,' +
    '  userid INTEGER  NOT NULL,' +
    '  FOREIGN KEY(userid) REFERENCES users(id),' +
    '  ON DELETE CASCADE' +
    '  bookid INTEGER  NOT NULL,' +
    '  FOREIGN KEY(bookid) REFERENCES book(id)' +
    '  ON DELETE CASCADE' +
    ');');

   client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query('INSERT INTO users ( name, date) VALUES(\'Mike\', \'2022-10-10\');');
  await client.query('INSERT INTO categories (name) VALUES(\'Thrill\');');
  await client.query('INSERT INTO authors (name) VALUES(\'Shevchenko\');');
  await client.query('INSERT INTO books (title, userid, authorid, categories)' +
    ' VALUES(\'Kobzar\', 1, 1, 1);');
  await client.query('INSERT INTO descriptions (descriptions, bookid) VALUES(\'Some good book about smth\', 1);');
  await client.query('INSERT INTO reviews (message, userid, bookid) VALUES(\'Very cool\', 1, 1);');

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
