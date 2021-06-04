DROP VIEW IF EXISTS public.DiscussionWithUser;
DROP TABLE IF EXISTS public.DiscussionContent;
DROP TABLE IF EXISTS public.Discussion;
DROP TABLE IF EXISTS public.HomeworkSubmission;
DROP TABLE IF EXISTS public.Homework;
DROP TABLE IF EXISTS public.Users;
DROP TABLE IF EXISTS public.Courses;

CREATE TABLE public.Courses (
  courseid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  name CHARACTER VARYING(60) NOT NULL,
  PRIMARY KEY (courseid),
  UNIQUE (name),
  CHECK (LENGTH(name) BETWEEN 10 AND 60)
);

INSERT
  INTO
    public.Courses (name)
  VALUES
    ('Introduction to Computer Systems'),
    ('Data Structures and Algorithms');

CREATE TABLE public.Users (
  userid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  name CHARACTER VARYING(20) NOT NULL,
  password CHARACTER VARYING(64) NOT NULL,
  identity INTEGER NOT NULL,
  salt CHARACTER VARYING(16) NOT NULL,
  PRIMARY KEY (userid),
  UNIQUE (name),
  CHECK (LENGTH(name) BETWEEN 5 AND 30),
  CHECK (LENGTH(password) = 64),
  CHECK (identity BETWEEN 0 AND 1),
  CHECK (LENGTH(salt) = 16)
);

INSERT
  INTO
    public.Users (name, password, identity, salt)
  VALUES
    ('Yueyang Pan', 'XKxoXQecnkife2E3dPQFM6VdAsD8EF+hqifsaGoJg5aOkWJNipSzDwWSqrBQYqV2', 0, 'M2ReP8kdCYkXZ0B4'),
      -- password plaintext: 'pwd of pyy'
    ('Ruihan Li', 'w4mI2IGMR3HwieVetUv9AwYW6NdimGFK4usDiloV0KMnV94Yc3bfP17RHD63Jn6j', 0, '7Ag90MgNRyHNZkrM');
      -- password plaintext: 'pwd of lrh'

CREATE TABLE public.Homework (
  courseid INTEGER NOT NULL,
  homeworkid INTEGER NOT NULL,
  content TEXT NOT NULL,
  assign DATE NOT NULL,
  due DATE NOT NULL,
  FOREIGN KEY (courseid)
    REFERENCES public.Courses (courseid)
    ON DELETE CASCADE,
  PRIMARY KEY (courseid, homeworkid),
  CHECK (due >= assign)
);

INSERT 
  INTO
    public.Homework (courseid, homeworkid, content, assign, due)
  VALUES 
    (1, 1, 'Exercise 2.3.3', '2021-05-24', '2021-05-31'),
    (1, 2, 'Exercise 3.4.6', '2021-05-24', '2021-05-31'),
    (2, 1, 'Exercise 7.8.1', '2021-05-24', '2021-05-31'),
    (2, 2, 'Exercise 8.6.2', '2021-05-24', '2021-05-31');

CREATE TABLE public.HomeworkSubmission (
  courseid INTEGER NOT NULL,
  homeworkid INTEGER NOT NULL,
  userid INTEGER NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (courseid)
    REFERENCES public.Courses (courseid)
    ON DELETE CASCADE,
  FOREIGN KEY (courseid, homeworkid)
    REFERENCES public.Homework (courseid, homeworkid)
    ON DELETE CASCADE,
  PRIMARY KEY (courseid, homeworkid, userid),
  FOREIGN KEY (userid)
    REFERENCES public.Users (userid)
    ON DELETE RESTRICT
);

INSERT
  INTO
    public.HomeworkSubmission (courseid, homeworkid, userid, content)
  VALUES
    (2, 1, 1, 'I have discovered a truly marvelous proof of this, which this margin is too narrow to contain.');

CREATE TABLE public.Discussion(
  courseid INTEGER NOT NULL,
  discussionid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  userid INTEGER NOT NULL,
  createdate DATE NOT NULL,
  theme TEXT NOT NULL,
  FOREIGN KEY (courseid)
    REFERENCES public.Courses (courseid)
    ON DELETE CASCADE,
  PRIMARY KEY (discussionid),
  FOREIGN KEY (userid)
    REFERENCES public.Users (userid)
    ON DELETE RESTRICT
);

INSERT
  INTO 
    public.Discussion (courseid, userid, createdate, theme)
  VALUES 
    (1, 1, '2021-05-27', 'Cache Coherence'),
    (2, 2, '2021-05-27', 'Munkre Algorithm');

CREATE TABLE public.DiscussionContent(
  discussionid INTEGER NOT NULL,
  postid INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  createdate DATE,
  userid INTEGER NOT NULL,
  content TEXT,
  FOREIGN KEY (discussionid)
    REFERENCES public.Discussion (discussionid)
    ON DELETE CASCADE,
  PRIMARY KEY (postid),
  FOREIGN KEY (userid)
    REFERENCES public.Users (userid)
    ON DELETE RESTRICT
);

INSERT
  INTO
    public.DiscussionContent (discussionid, createdate, userid, content)
  VALUES
    (1, '2021-05-27', 1, 'What is the difference between cache coherence and memory consistency?');

CREATE VIEW DiscussionWithUser
  AS
    SELECT courseid, discussionid, userid, createdate, theme, name, identity
      FROM Discussion JOIN Users
      USING (userid);
