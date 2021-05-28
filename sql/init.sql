CREATE TABLE public.courses (
  id SERIAL,
  name TEXT NOT NULL
);

CREATE TABLE public.homework (
  courseid INTEGER NOT NULL,
  homeworkid INTEGER NOT NULL,
  content TEXT,
  assign DATE,
  due DATE 
);

CREATE TABLE public.discussion(
  courseid INTEGER NOT NULL,
  discussionid SERIAL,
  userid INTEGER NOT NULL,
  createdate DATE,
  theme TEXT
);

CREATE TABLE public.discussionContent(
  discussionid INTEGER NOT NULL,
  postid SERIAL,
  createdate DATE,
  useid INTEGER NOT NULL,
  content TEXT
);

CREATE TABLE public.users (
  id SERIAL,
  name VARCHAR(20) NOT NULL,
  password CHAR(64) NOT NULL,
  identity INTEGER NOT NULL,
  salt CHAR(16) NOT NULL
);

CREATE TABLE public.submission (
  courseid INTEGER NOT NULL,
  homeworkid INTEGER NOT NULL,
  userid INTEGER NOT NULL,
  content TEXT
);

INSERT
  INTO
    public.courses (id, name)
  VALUES
    (DEFAULT, 'Introduction to Computer Systems'),
    (DEFAULT, 'Data Structures and Algorithms');

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
    public.discussion (courseid, discussionid, userid, createdate, theme)
  VALUES 
    (1, DEFAULT, 1, '2021-05-27', 'Cache Coherence'),
    (2, DEFAULT, 2, '2021-05-27', 'Munkre Algorithm');

INSERT
  INTO
    public.discussionContent (discussionid, postid, createdate, useid, content)
  VALUES
    (1, DEFAULT, '2021-05-27', 1, 'What is the difference between cache coherence and memory consistency?');

INSERT
  INTO
    public.users (id, name, password, identity, salt)
  VALUES
    (DEFAULT, 'Yueyang Pan', 'XKxoXQecnkife2E3dPQFM6VdAsD8EF+hqifsaGoJg5aOkWJNipSzDwWSqrBQYqV2',0, 'M2ReP8kdCYkXZ0B4'),
      -- password plaintext: 'pwd of pyy'
    (DEFAULT, 'Ruihan Li', 'w4mI2IGMR3HwieVetUv9AwYW6NdimGFK4usDiloV0KMnV94Yc3bfP17RHD63Jn6j',0, '7Ag90MgNRyHNZkrM');
      -- password plaintext: 'pwd of lrh'

INSERT
  INTO
    public.submission (courseid, homeworkid, userid, content)
  VALUES
    (2, 1, 1, '985');
