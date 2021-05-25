CREATE TABLE public.courses (
  id integer NOT NULL,
  name text
);

INSERT
  INTO
    public.courses (id, name)
  VALUES
    (1, 'Introduction to Computer Systems'),
    (2, 'Data Structures and Algorithms');
