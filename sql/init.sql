CREATE TABLE public.courses (
  id integer NOT NULL,
  name text
);
CREATE TABLE public.homework (
  courseid INTEGER NOT NULL,
  homeworkid INTEGER NOT NULL,
  content TEXT,
  assign DATE,
  due DATE 
);

INSERT
  INTO
    public.courses (id, name)
  VALUES
    (1, 'Introduction to Computer Systems'),
    (2, 'Data Structures and Algorithms');

INSERT 
  INTO
    public.homework (courseid, homeworkid, content, assign, due)
  VALUES 
    (1, 1, 'Exercise 2.3.3', '2021-05-24','2021-05-31'),
    (1, 2, 'Exercise 3.4.6', '2021-05-24','2021-05-31'),
    (2, 1, 'Exercise 7.8.1', '2021-05-24','2021-05-31'),
    (2, 2, 'Exercise 8.6.2', '2021-05-24','2021-05-31');