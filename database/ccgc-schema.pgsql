CREATE TABLE users (
    username VARCHAR(30) PRIMARY KEY,
    email TEXT NOT NULL CHECK (position('@' IN email) > 1),
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    bio TEXT DEFAULT 'Enthusiastic member of the Contra Costa Golf Club',
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

create TABLE courses (
    handle TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    rating DECIMAL NOT NULL,
    slope INTEGER NOT NULL
);

create TABLE pars (
    course_handle TEXT NOT NULL REFERENCES courses(handle) ON DELETE CASCADE,
    hole1 INTEGER NOT NULL,
    hole2 INTEGER NOT NULL,
    hole3 INTEGER NOT NULL,
    hole4 INTEGER NOT NULL,
    hole5 INTEGER NOT NULL,
    hole6 INTEGER NOT NULL,
    hole7 INTEGER NOT NULL,
    hole8 INTEGER NOT NULL,
    hole9 INTEGER NOT NULL,
    hole10 INTEGER NOT NULL,
    hole11 INTEGER NOT NULL,
    hole12 INTEGER NOT NULL,
    hole13 INTEGER NOT NULL,
    hole14 INTEGER NOT NULL,
    hole15 INTEGER NOT NULL,
    hole16 INTEGER NOT NULL,
    hole17 INTEGER NOT NULL,
    hole18 INTEGER NOT NULL
);

create TABLE handicaps (
    course_handle TEXT NOT NULL REFERENCES courses(handle) ON DELETE CASCADE,
    hole1 INTEGER NOT NULL,
    hole2 INTEGER NOT NULL,
    hole3 INTEGER NOT NULL,
    hole4 INTEGER NOT NULL,
    hole5 INTEGER NOT NULL,
    hole6 INTEGER NOT NULL,
    hole7 INTEGER NOT NULL,
    hole8 INTEGER NOT NULL,
    hole9 INTEGER NOT NULL,
    hole10 INTEGER NOT NULL,
    hole11 INTEGER NOT NULL,
    hole12 INTEGER NOT NULL,
    hole13 INTEGER NOT NULL,
    hole14 INTEGER NOT NULL,
    hole15 INTEGER NOT NULL,
    hole16 INTEGER NOT NULL,
    hole17 INTEGER NOT NULL,
    hole18 INTEGER NOT NULL
);


create TABLE tournaments (
    id SERIAL PRIMARY KEY,
    season_end_year INTEGER NOT NULL,
    date DATE NOT NULL,
    course_name TEXT NOT NULL,
    location TEXT
);

create TABLE rounds (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    username VARCHAR(30) NOT NULL 
      REFERENCES users(username) ON DELETE CASCADE,
    course_handle TEXT NOT NULL REFERENCES courses(handle) ON DELETE CASCADE,
    strokes1 INTEGER NOT NULL,
    strokes2 INTEGER,
    strokes3 INTEGER,
    strokes4 INTEGER,
    strokes5 INTEGER,
    strokes6 INTEGER,
    strokes7 INTEGER,
    strokes8 INTEGER,
    strokes9 INTEGER,
    strokes10 INTEGER,
    strokes11 INTEGER,
    strokes12 INTEGER,
    strokes13 INTEGER,
    strokes14 INTEGER,
    strokes15 INTEGER,
    strokes16 INTEGER,
    strokes17 INTEGER,
    strokes18 INTEGER,
    putts1 INTEGER NOT NULL,
    putts2 INTEGER,
    putts3 INTEGER,
    putts4 INTEGER,
    putts5 INTEGER,
    putts6 INTEGER,
    putts7 INTEGER,
    putts8 INTEGER,
    putts9 INTEGER,
    putts10 INTEGER,
    putts11 INTEGER,
    putts12 INTEGER,
    putts13 INTEGER,
    putts14 INTEGER,
    putts15 INTEGER,
    putts16 INTEGER,
    putts17 INTEGER,
    putts18 INTEGER
);



