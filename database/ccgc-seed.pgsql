--------------------------  USERS TABLE  -----------------------------------------
--- all pre-inserted users passwords start as 'password'

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
       ('lone-tree', 'Lone Tree Golf Course', 69.1, 121),
       ('franklin-canyon', 'Franklin Canyon Golf Course', 69.6, 127),
       ('cypress-lakes', 'Cypress Lakes Golf Course', 71.2, 120),
       ('yocha-dehe', 'Yocha Dehe Golf Club', 71.4, 131),
       ('blue-rock-east', 'Blue Rock Springs (East)', 68.4, 121),
       ('wolf-run', 'Wolf Run Golf Club', 67.3, 122);


INSERT INTO pars (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
VALUES ('paradise-valley', 5,4,3,5,4,4,4,3,4,5,4,3,4,4,3,5,4,4),
       ('wild-horse', 4,4,4,3,5,3,5,4,4,4,4,3,5,3,4,4,5,4),
       ('lone-tree', 4,3,4,5,4,4,4,3,4,3,3,5,4,3,4,5,5,4),
       ('franklin-canyon', 5,3,4,3,4,3,5,4,5,4,3,4,5,4,4,4,3,5),
       ('cypress-lakes', 5,4,3,4,5,4,4,3,4,5,3,4,4,3,4,4,5,4),
       ('yocha-dehe', 4,5,4,3,4,5,3,4,4,5,4,4,3,4,4,3,5,4),
       ('blue-rock-east', 4,3,4,4,5,3,5,3,4,4,3,4,4,5,4,3,4,4),
       ('wolf-run', 4,5,4,4,3,4,3,5,4,4,4,4,4,3,5,4,3,5);

INSERT INTO handicaps (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
VALUES ('paradise-valley', 5,7,17,9,1,3,11,15,13,4,10,18,6,14,16,8,12,2),
       ('wild-horse', 9,15,1,7,3,17,11,5,13,18,16,10,8,14,4,12,6,2),
       ('lone-tree', 1,13,17,9,7,15,3,11,5,16,12,2,4,18,6,8,10,14),
       ('franklin-canyon', 15,11,13,7,17,5,9,1,3,8,2,14,4,10,6,16,12,18),
       ('cypress-lakes', 13,11,17,3,1,7,9,15,5,6,16,14,10,18,12,2,4,8),
       ('yocha-dehe', 5,7,1,15,13,3,11,17,9,6,14,16,10,8,12,18,4,2),
       ('blue-rock-east', 9,17,7,3,1,11,13,15,5,12,16,4,10,18,2,14,6,8),
       ('wolf-run', 9,3,11,1,15,5,17,7,13,14,10,4,8,18,2,16,12,6);

----------------------------TOURNAMENTS TABLE----------------------------------------------------


INSERT INTO tournaments (date, course_handle, season_end_year)
VALUES ('2022-05-15', 'paradise-valley', 2022),
       ('2022-04-10', 'wild-horse', 2022),
       ('2022-03-20', 'lone-tree', 2022),
       ('2022-02-20', 'franklin-canyon', 2022),
       ('2022-01-09', 'paradise-valley', 2022),
       ('2021-12-19', 'cypress-lakes', 2022),
       ('2021-11-20', 'yocha-dehe', 2022),
       ('2021-10-09', 'blue-rock-east', 2022),
       ('2021-09-12', 'wolf-run', 2022);



----------------------- ROUNDS TABLES -------------------------------------


INSERT INTO rounds (id, tournament_date, username)
VALUES (1,'2022-05-15','tom-moore'),
       (2,'2022-05-15','brian-moore'),
       (3,'2022-05-15','dave-pereira'),
       (4,'2022-05-15','dennis-flannery');




-- INSERT INTO strokes (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
-- VALUES (1,  4, 5, 5, 7, 5, 6, 4, 5, 4, 5, 5, 4, 5, 6, 5, 5, 5);


-- INSERT INTO putts (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
-- VALUES (1,  2,2,3,2,4,2,3,2,2,3,2,2,1,4,3,2,2,2);





-----------------------------------------------------------------------------