--------------------------  USERS TABLE  -----------------------------------------

INSERT INTO users (username, email, password, first_name, last_name, is_admin)
VALUES ('tom-moore','moore.tom@comcast.net', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Tom', 'Moore', FALSE),
       ('brian-moore','bmoore427@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Brian', 'Moore', FALSE),
       ('dennis-flannery', 'dennis2207@me.com.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Dennis', 'Flannery', FALSE),
       ('dave-pereira','davep@tbs.org', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Dave', 'Pereira', TRUE),
       ('matt-pereira','ramchips99@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Matt', 'Pereira', TRUE),
       ('vern-taylor','vernt@tbs.org', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Vern', 'Taylor', FALSE);


----------------------- COURSES TABLES -------------------------------------
INSERT INTO courses (handle, name, rating, slope)
VALUES ('paradise-valley', 'Paradise Valley Golf Course', 70.4, 125),
       ('wild-horse', 'Wild Horse Golf Course', 68.4, 120),
       ('lone-tree', 'Lone Tree Golf Course', 69.1, 121);


INSERT INTO pars (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
VALUES ('paradise-valley', 5,4,3,5,4,4,4,3,4,5,4,3,4,4,3,5,4,4),
       ('wild-horse', 4,4,4,3,5,3,5,4,4,4,4,3,5,3,4,4,5,4),
       ('lone-tree', 4,3,4,5,4,4,4,3,4,3,3,5,4,3,4,5,5,4);

INSERT INTO handicaps (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
VALUES ('paradise-valley', 5,7,17,9,1,3,11,15,13,4,10,18,6,14,16,8,12,2),
       ('wild-horse', 9,15,1,7,3,17,11,5,13,18,16,10,8,14,4,12,6,2),
       ('lone-tree', 1,13,17,9,7,15,3,11,5,16,12,2,4,18,6,8,10,14);

--------------------------------------------------------------------------------


-- PAY ATTENTION TO TOURNAMENT ID AND SEASON END YEAR -- FINALIZE WHEN ALL COURSES FOR THIS SEASON ARE KNOWN
INSERT INTO tournaments (id, season_end_year, date, course_name, location)
VALUES (1, 2022, '2022-05-15', 'Paradise Valley Golf Course', 'Fairfield, CA'),
       (2, 2022, '2022-04-10', 'Wild Horse Golf Course', 'Davis, CA'),
       (3, 2022, '2022-03-20', 'Lone Tree Golf Course', 'Antioch, CA');



----------------------- ROUNDS TABLES -------------------------------------


-- PAY ATTENTION TO TOURNAMENT ID
INSERT INTO rounds (tournament_id, username, course_handle,
        strokes1, strokes2, strokes3, strokes4, strokes5, strokes6, strokes7, strokes8, strokes9, strokes10, strokes11, strokes12, strokes13, strokes14, strokes15, strokes16, strokes17, strokes18, 
        putts1, putts2, putts3, putts4, putts5, putts6, putts7, putts8, putts9, putts10, putts11, putts12, putts13, putts14, putts15, putts16, putts17, putts18)
VALUES (1,'tom-moore', 'paradise-valley',
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3),
       ( 1, 'brian-moore', 'paradise-valley',
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4),
       ( 1, 'dave-pereira', 'paradise-valley',
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1),
       ( 1, 'dennis-flannery', 'paradise-valley',
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2);

-----------------------------------------------------------------------------