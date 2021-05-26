CREATE TABLE public.courses (
  id INTEGER NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE public.homework (
  courseid INTEGER NOT NULL,
  homeworkid INTEGER NOT NULL,
  content TEXT,
  assign DATE,
  due DATE 
);

CREATE TABLE public.users (
  id INTEGER NOT NULL,
  name VARCHAR(20) NOT NULL,
  password CHAR(64) NOT NULL,
  salt CHAR(16) NOT NULL
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

INSERT
  INTO
    public.users (id, name, password, salt)
  VALUES
    (1, 'Yueyang Pan', 'XKxoXQecnkife2E3dPQFM6VdAsD8EF+hqifsaGoJg5aOkWJNipSzDwWSqrBQYqV2', 'M2ReP8kdCYkXZ0B4'),
      -- password plaintext: 'pwd of pyy'
    (2, 'Ruihan Li', 'w4mI2IGMR3HwieVetUv9AwYW6NdimGFK4usDiloV0KMnV94Yc3bfP17RHD63Jn6j', '7Ag90MgNRyHNZkrM');
      -- password plaintext: 'pwd of lrh'
