--------------------------  USERS TABLE  -----------------------------------------
--- all pre-inserted users passwords start as 'password'

INSERT INTO users (username, email, password, first_name, last_name, is_admin)
VALUES ('tom-moore','moore.tom@comcast.net', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Tom', 'Moore', FALSE),
       ('brian-moore','bmoore427@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Brian', 'Moore', FALSE),
       ('dennis-flannery', 'dennis2207@me.com.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Dennis', 'Flannery', TRUE),
       ('dave-pereira','davep@tbs.org', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Dave', 'Pereira', TRUE),
       ('matt-pereira','ramchips99@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Matt', 'Pereira', TRUE),
       ('vern-taylor','vernt@tbs.org', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Vern', 'Taylor', FALSE),
       ('carrol-strickland', 'carrmari@sbcglobal.net', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Carrol', 'Strickland', FALSE),
       ('jose-argenal', 'argenalwelding@yahoo.ca', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Jose', 'Argenal', FALSE),
       ('dave-wallace', 'overrks@yahoo.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Dave', 'Wallace', FALSE),
       ('steve-etingoff', 'sjmme@aol.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Steve', 'Etingoff', FALSE),
       ('dean-rogers', 'rogersroofing@comcast.net', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Dean', 'Rogers', FALSE),
       ('tim-corbett', 'tjcorbett@sbcglobal.net', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Tim', 'Corbett', FALSE),
       ('randy-felix', 'RPFelix@att.net', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Randy', 'Felix', FALSE),
       ('jerry-guevara', 'jguevara_1956@yahoo.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Jerry', 'Guevara', FALSE),
       ('mike-p', 'mike@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Mike', 'P', FALSE),
       ('bruce', 'bruce@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Bruce', 'Foobar', FALSE),
       ('charlie', 'charlie@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Charlie', 'Foobar', FALSE),
       ('patrick', 'patrick@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Patrick', 'Foobar', FALSE),
       ('bill', 'bill@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Bill', 'Foobar', FALSE),
       ('fritz', 'fritz@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Fritz', 'Foobar', FALSE),
       ('dan', 'dan@gmail.com', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'Dan', 'Foobar', FALSE)

       ;


----------------------- COURSES TABLES -------------------------------------
INSERT INTO courses (handle, name, rating, slope)
VALUES ('paradise-valley', 'Paradise Valley Golf Course', 70.4, 125),
       ('wild-horse', 'Wild Horse Golf Course', 68.4, 120),
       ('lone-tree', 'Lone Tree Golf Course', 69.1, 121),
       ('franklin-canyon', 'Franklin Canyon Golf Course', 69.6, 127),
       ('cypress-lakes', 'Cypress Lakes Golf Course', 71.2, 120),
       ('yocha-dehe', 'Yocha Dehe Golf Club', 71.4, 131),
       ('blue-rock-east', 'Blue Rock Springs East', 68.4, 121),
       ('wolf-run', 'Wolf Run Golf Club', 67.3, 122);


INSERT INTO pars (course_handle, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18, total)
VALUES ('paradise-valley', 5,4,3,5,4,4,4,3,4,5,4,3,4,4,3,5,4,4,72),
       ('wild-horse', 4,4,4,3,5,3,5,4,4,4,4,3,5,3,4,4,5,4, 72),
       ('lone-tree', 4,3,4,5,4,4,4,3,4,3,3,5,4,3,4,5,5,4, 71),
       ('franklin-canyon', 5,3,4,3,4,3,5,4,5,4,3,4,5,4,4,4,3,5,72),
       ('cypress-lakes', 5,4,3,4,5,4,4,3,4,5,3,4,4,3,4,4,5,4,72),
       ('yocha-dehe', 4,5,4,3,4,5,3,4,4,5,4,4,3,4,4,3,5,4,72),
       ('blue-rock-east', 4,3,4,4,5,3,5,3,4,4,3,4,4,5,4,3,4,4,70),
       ('wolf-run', 4,5,4,4,3,4,3,5,4,4,4,4,4,3,5,4,3,5,72);

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

---------2021-09-12 WOLF RUN-------------------------------------------------------
INSERT INTO rounds (id, tournament_date, username, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap)
VALUES (1,'2021-09-12','tom-moore', 90,78,43,11.6,21.0,13),
       (2,'2021-09-12', 'dave-pereira', 103,88,40,14.7,31.2,16),
       (3,'2021-09-12', 'carrol-strickland', 84,70,35,14.3,15.5,15),
       (4,'2021-09-12', 'jose-argenal', 98,80,41,17.8,27.5,19),
       (5,'2021-09-12', 'dave-wallace', 113,89,37,24.0,40.5,26),
       (6,'2021-09-12', 'steve-etingoff', 95,75,38,20.2,25.7,22),
       (7,'2021-09-12', 'dean-rogers', 89,68,32,21.0,20.1,23),
       (8, '2021-09-12', 'tim-corbett', 88,71,31,16.9,17.3,18),
       (9, '2021-09-12', 'randy-felix', 98,82,33,16.0,26.6,17),
       (10, '2021-09-12', 'jerry-guevara', 82,71,33,10.7,12.7,12),
       (11, '2021-09-12', 'dennis-flannery', 99,85,41,14.3,28.4,15),
       (12, '2021-09-12', 'mike-p', 93,73,36,20.2,23.8,22),
       (13, '2021-09-12', 'brian-moore', 128,101,43,27.3,55.3,29),
       (14, '2021-09-12', 'bruce', 100,84,39,16.2,26.6,17);



INSERT INTO strokes (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-09-12 WOLF RUN-------------------------------------------------------
VALUES (1,  4,5,5,7,5,6,4,5,4,5,5,5,4,5,6,5,5,5),
       (2,  4,5,5,7,5,6,4,5,4,5,5,5,4,5,6,5,5,5),
       (3,  4,5,4,5,4,6,4,5,6,5,5,5,5,4,5,4,3,5),
       (4,  6,6,5,6,4,7,4,6,7,5,5,5,4,4,8,6,5,5),
       (5,  5,7,7,6,4,7,6,5,7,8,5,6,6,4,9,6,6,9),
       (6,  4,6,4,5,3,5,4,6,5,7,5,7,6,5,8,5,4,6),
       (7,  4,7,5,7,3,6,3,6,4,4,5,4,5,4,8,4,5,5),
       (8,  4,4,6,6,3,5,3,5,4,5,5,6,5,5,9,5,3,5),
       (9,  6,5,5,9,4,6,4,6,6,4,5,7,6,4,6,6,3,6),
       (10, 4,5,5,6,3,5,3,6,3,4,5,5,4,3,8,4,3,6),
       (11, 5,6,8,5,4,5,5,4,5,7,6,5,5,5,7,5,6,6),
       (12, 4,6,7,5,3,4,5,5,8,6,3,7,6,4,6,4,3,7),
       (13, 5,7,8,6,6,8,8,8,6,8,8,9,7,5,7,8,6,8),
       (14, 9,7,5,5,3,6,7,4,4,5,7,9,5,3,5,5,4,7);


INSERT INTO putts (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-09-12 WOLF RUN-------------------------------------------------------
VALUES (1,  2,2,3,2,4,2,3,2,2,3,2,2,1,4,3,2,2,2),
       (2,  2,2,3,3,2,2,3,2,3,2,3,2,3,1,2,1,3,1),
       (3,  2,2,2,1,1,2,2,2,2,3,2,2,2,2,2,2,2,2),
       (4,  2,2,2,3,2,3,2,2,3,2,2,2,1,3,3,3,2,2),
       (5,  1,2,2,2,2,3,3,1,2,3,2,2,2,2,1,2,2,3),
       (6,  2,2,1,2,2,2,2,2,1,3,1,2,3,3,3,2,3,2),
       (7,  1,2,2,3,1,2,1,2,1,2,3,1,1,2,3,2,2,1),
       (8,  1,1,2,1,2,2,1,2,1,3,2,2,2,2,2,2,1,2),
       (9,  2,1,2,3,1,2,2,3,1,1,1,2,2,2,2,2,2,2),
       (10, 1,1,2,3,2,2,1,2,1,1,2,2,2,2,3,1,2,3),
       (11, 3,3,2,3,1,2,3,2,2,3,2,2,2,3,2,2,1,3),
       (12, 2,2,2,3,1,1,3,2,2,3,1,2,2,2,2,1,2,3),
       (13, 3,2,3,4,3,3,3,3,1,3,2,2,2,1,2,2,3,1),
       (14, 2,3,2,3,1,2,3,1,1,2,3,3,2,2,2,2,2,3);


------------------END 2021-09-12 WOLF RUN------------------------------------

-----------------------------------------------------------------------------
-----------------------------------------------------------------------------
-----------------------------------------------------------------------------

------------------START 2021-10-09 BLUE ROCK EAST------------------------------------

INSERT INTO rounds (id, tournament_date, username, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap)
---------2021-10-09 BLUE ROCK EAST-------------------------------------------------------
VALUES (15, '2021-10-09', 'dave-pereira', 94,85,35,8.8,22.0,9),
       (16, '2021-10-09', 'carrol-strickland', 98,88,36,10.5,24.8,11),
       (17, '2021-10-09', 'jose-argenal', 96,80,36,15.6,24.8,17),
       (18, '2021-10-09', 'steve-etingoff', 92,76,38,16.5,22.0,18),
       (19, '2021-10-09', 'dean-rogers', 101,80,37,20.7,29.5,22),
       (20, '2021-10-09', 'tim-corbett', 84,71,28,12.9,13.6,14),
       (21, '2021-10-09', 'randy-felix', 84,69,34,15.3,14.6,16),
       (22, '2021-10-09', 'dennis-flannery', 87,73,35,14.2,17.4,15),
       (23, '2021-10-09', 'vern-taylor', 96,78,36,17.8,24.8,19),
       (24, '2021-10-09', 'mike-p', 90,74,34,16.5,20.2,18),
       (25, '2021-10-09', 'charlie', 89,68,37,20.7,19.2,22),
       (26, '2021-10-09', 'matt-pereira', 91,77,34,14.0,20.2,15)
       ;


INSERT INTO strokes (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-10-09 BLUE ROCK EAST-------------------------------------------------------
VALUES (15, 6,5,4,5,5,4,5,5,5,5,3,6,6,6,6,4,7,7),
       (16, 7,3,5,5,8,4,7,3,6,5,5,6,6,6,6,4,5,5),
       (17, 7,3,5,5,8,4,7,3,6,5,5,6,6,6,6,4,5,5),
       (18, 6,4,5,6,7,4,6,4,6,6,3,6,5,6,5,4,5,4),
       (19, 5,3,5,8,8,5,8,5,7,5,3,6,5,5,9,4,6,4),
       (20, 5,3,4,4,5,3,7,4,8,5,4,4,5,6,4,4,5,4),
       (21, 5,3,5,5,6,4,5,4,5,6,4,4,4,6,5,3,4,6),
       (22, 4,5,6,6,5,3,6,5,4,4,5,4,5,5,6,4,5,5),
       (23, 5,3,7,8,7,3,6,3,6,6,4,5,6,6,7,4,6,4),
       (24, 6,4,4,5,5,5,7,4,7,4,4,7,5,5,5,5,4,4),
       (25, 4,5,5,6,5,5,6,4,5,5,3,4,5,7,6,5,4,5),
       (26, 7,4,5,5,5,4,8,4,5,6,4,6,3,6,5,6,4,4)
       ;


INSERT INTO putts (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-10-09 BLUE ROCK EAST-------------------------------------------------------
VALUES (15, 3,2,2,1,1,2,2,1,2,2,1,2,2,2,3,2,3,2),
       (16, 2,2,2,2,3,2,2,1,2,2,2,2,2,1,1,2,3,3),
       (17, 2,2,2,2,3,2,2,1,2,2,2,2,2,1,1,2,3,3),
       (18, 3,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,3,1),
       (19, 2,1,2,3,2,2,2,2,3,1,1,2,2,2,4,1,3,2),
       (20, 2,2,1,2,1,1,0,2,2,2,2,1,2,1,1,2,3,1),
       (21, 2,2,1,2,2,2,2,2,2,3,2,2,1,2,2,1,2,2),
       (22, 1,3,3,3,2,1,3,1,1,1,2,1,2,2,2,2,3,2),
       (23, 1,1,2,3,3,1,1,2,2,3,2,2,3,3,1,3,2,1),
       (24, 3,2,2,2,2,3,1,2,1,2,2,2,1,2,2,2,2,1),
       (25, 2,3,2,3,2,2,1,2,2,2,2,2,2,2,3,2,2,1),
       (26, 3,2,1,2,1,2,2,3,2,3,2,1,1,2,2,1,2,2)
       ;


------------------END 2021-10-09 BLUE ROCK EAST------------------------------------

-----------------------------------------------------------------------------
-----------------------------------------------------------------------------
-----------------------------------------------------------------------------

------------------ START 2021-11-20 YOCHA DEHE ------------------------------------

INSERT INTO rounds (id, tournament_date, username, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap)
---------2021-11-20 YOCHA DEHE-------------------------------------------------------
VALUES (27, '2021-11-20', 'tom-moore', 92,82,37,10.5,17.4,12),
       (28, '2021-11-20', 'dave-pereira', 90,81,36,8.8,16.5,10),
       (29, '2021-11-20', 'carrol-strickland', 92,85,38,7.3,16.5,8),
       (30, '2021-11-20', 'jose-argenal', 99,81,38,18.0,25.5,20),
       (31, '2021-11-20', 'dave-wallace', 132,107,39,25.3,47.0,28),
       (32, '2021-11-20', 'steve-etingoff', 90,73,35,17.0,18.3,19),
       (33, '2021-11-20', 'dean-rogers', 91,70,37,20.7,19.2,23),
       (34, '2021-11-20', 'randy-felix', 94,79,35,14.6,21.9,16),
       (35, '2021-11-20', 'dennis-flannery', 86,70,32,15.8,14.7,18),
       (36, '2021-11-20', 'vern-taylor', 101,77,38,24.3,27.3,27),
       (37, '2021-11-20', 'patrick', 106,90,36,15.6,30.9,17),
       (38, '2021-11-20', 'mike-p', 103,87,44,16.5,29.1,18),
       (39, '2021-11-20', 'charlie', 95,75,35,20.0,22.8,22),
       (40, '2021-11-20', 'matt-pereira', 95,81,35,14.0,21.9,16)
       ;


INSERT INTO strokes (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-11-20 YOCHA DEHE-------------------------------------------------------
VALUES (27, 6,5,6,3,5,6,4,4,4,9,5,5,4,5,5,3,8,5),
       (28, 4,5,5,4,5,6,3,4,5,6,4,5,4,5,7,4,7,7),
       (29, 5,5,4,4,3,5,6,4,5,7,5,5,5,5,5,4,10,5),
       (30, 8,6,7,5,4,6,5,4,6,5,5,7,4,6,5,4,7,5),
       (31, 7,7,10,4,6,9,9,6,7,9,9,10,4,8,6,3,9,9),
       (32, 6,6,5,4,6,6,4,5,6,6,4,5,3,5,5,4,6,4),
       (33, 5,5,4,5,5,6,4,5,7,6,5,5,4,5,5,5,5,5),
       (34, 6,7,4,4,4,7,4,6,7,6,5,5,3,6,5,6,5,4),
       (35, 4,6,4,4,6,5,4,3,4,6,5,6,3,4,6,3,6,7),
       (36, 5,6,9,7,7,5,5,5,5,6,7,5,3,7,4,4,4,7),
       (37, 5,7,7,4,7,5,4,5,6,6,7,7,5,6,5,5,9,6),
       (38, 6,5,6,6,4,6,5,6,6,6,7,6,5,5,4,6,8,6),
       (39, 5,4,7,4,5,6,4,3,6,6,8,7,3,5,6,5,6,5),
       (40, 7,6,5,5,4,4,3,4,5,5,8,7,5,5,5,5,5,7)
       ;


INSERT INTO putts (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-11-20 YOCHA DEHE-------------------------------------------------------
VALUES (27, 2,2,3,1,1,3,3,2,1,3,2,2,2,3,2,1,3,1),
       (28, 1,2,2,2,2,2,2,1,2,3,1,1,3,3,2,3,2,2),
       (29, 2,2,2,2,1,1,3,1,2,3,2,2,4,2,2,2,3,2),
       (30, 3,2,2,2,1,2,3,2,2,2,2,3,2,2,2,1,3,2),
       (31, 3,2,3,1,2,2,1,2,2,3,3,2,2,2,1,2,3,3),
       (32, 1,3,2,2,1,2,2,2,2,3,1,2,2,2,2,2,2,2),
       (33, 2,2,1,2,2,3,2,2,4,2,2,2,3,2,1,2,1,2),
       (34, 2,3,1,2,1,2,2,3,3,3,2,1,1,1,1,4,2,1),
       (35, 2,2,1,2,2,2,2,1,2,3,2,2,1,2,2,2,1,1),
       (36, 2,2,4,3,1,2,3,2,2,3,3,2,1,3,1,1,1,2),
       (37, 2,2,2,2,1,2,1,2,1,3,1,3,3,2,1,3,2,3),
       (38, 2,2,3,3,2,3,3,2,3,3,2,2,2,2,2,2,3,3),
       (39, 2,1,4,2,1,2,1,1,2,3,3,3,1,2,2,2,2,1),
       (40, 2,2,1,1,2,2,2,1,2,2,3,3,1,2,3,2,2,2)
       ;



------------------2021-11-20 YOCHA DEHE------------------------------------

-------------------------------------------------------
-------------------------------------------------------
-------------------------------------------------------



------------------ START 2021-12-19 CYPRESS LAKES ------------------------------------

INSERT INTO rounds (id, tournament_date, username, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap)
---------2021-12-19 CYPRESS LAKES-------------------------------------------------------
VALUES (41, '2021-12-19', 'dave-pereira', 94,81,35,13.1,21.9,15),
       (42, '2021-12-19', 'dave-wallace', 114,84,38,29.7,39.8,33),
       (43, '2021-12-19', 'steve-etingoff', 89,70,31,19.1,17.4,21),
       (44, '2021-12-19', 'dean-rogers', 94,75,33,18.8,21.0,21),
       (45, '2021-12-19', 'randy-felix', 106,91,36,14.6,30.9,16),
       (46, '2021-12-19', 'dennis-flannery', 88,74,29,14.5,16.5,16),
       (47, '2021-12-19', 'brian-moore', 102,54,35,48.2,29.1,54),
       (48, '2021-12-19', 'mike-p', 95,77,34,18.1,22.8,20),
       (49, '2021-12-19', 'bruce', 94,80,34,14.3,21.0,16),
       (50, '2021-12-19', 'bill', 94,80,34,14.3,21.0,16)
       ;


INSERT INTO strokes (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-12-19 CYPRESS LAKES-------------------------------------------------------
VALUES (41, 7,5,5,6,5,4,5,4,6,6,6,4,6,3,5,5,5,7),
       (42, 7,9,5,5,8,6,7,4,9,6,4,6,9,4,5,6,8,6),
       (43, 7,4,5,4,6,4,4,4,6,8,4,5,5,4,5,4,5,5),
       (44, 5,7,4,5,6,5,5,3,6,6,3,5,6,4,6,4,6,8),
       (45, 7,6,4,6,9,5,6,5,7,7,4,6,5,3,6,7,7,6),
       (46, 5,5,3,4,6,6,3,4,5,7,3,5,6,5,5,5,6,5),
       (47, 5,5,4,7,7,6,7,4,5,6,4,6,5,5,6,8,7,5),
       (48, 5,5,6,5,6,4,6,5,5,6,3,5,7,3,5,6,7,6),
       (49, 6,4,5,4,6,4,5,4,6,6,4,6,6,4,4,6,8,6),
       (50, 5,5,3,5,6,4,5,3,6,7,3,6,5,4,5,6,6,5)
       ;


INSERT INTO putts (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2021-12-19 CYPRESS LAKES-------------------------------------------------------
VALUES (41, 1,2,3,2,1,2,1,1,4,2,2,2,3,2,1,1,2,3),
       (42, 2,1,3,1,3,1,3,2,3,2,2,2,3,2,2,2,3,1),
       (43, 2,2,1,0,1,2,1,2,3,2,2,2,2,2,2,2,1,2),
       (44, 1,2,2,2,1,2,1,2,2,2,1,2,2,3,2,1,2,3),
       (45, 1,3,2,1,2,2,2,2,2,3,3,2,1,1,2,2,2,3),
       (46, 2,2,0,2,1,2,2,2,2,1,2,1,1,2,3,1,2,1),
       (47, 2,3,2,0,3,2,2,2,2,1,2,2,1,3,2,3,2,1),
       (48, 1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2),
       (49, 2,1,2,1,2,2,2,1,2,2,3,2,2,2,1,2,3,2),
       (50, 1,2,1,1,1,1,2,1,2,2,2,2,2,2,1,2,1,1)
       ;



-- ---------------------- 2022-01-09 PARADISE VALLEY START-----------------------------

INSERT INTO rounds (id, tournament_date, username, total_strokes, net_strokes, total_putts, player_index, score_differential, course_handicap)
---------2022-01-09 PARADISE VALLEY-------------------------------------------------------
VALUES (51, '2022-01-09','tom-moore', 88,76.1,34,11.9,15.9,13),
       (52, '2022-01-09','dave-pereira', 97,78.6,38,18.4,23.1,20),
       (53, '2022-01-09','carrol-strickland', 94,82.8,29,11.2,18.6,12),
       (54, '2022-01-09','jose-argenal', 105,81.9,34,23.1,31.3,25),
       (55, '2022-01-09','dave-wallace', 100,64,37,36.0,26.8,40),
       (56, '2022-01-09','dean-rogers', 92,73.2,28,18.8,16.8,21),
       (57, '2022-01-09','dennis-flannery', 92,77,37,15.0,19.5,16),
       (58, '2022-01-09','patrick', 92,77.2,38,14.8,19.5,16),
       (59, '2022-01-09','brian-moore', 108,76.8,39,31.2,34.1,34),
       (60, '2022-01-09','bruce', 107,92.7,35,14.3,30.4,16),
       (61, '2022-01-09','fritz', 93,77.8,32,15.2,20.4,17),
       (62, '2022-01-09','dan', 98,76,36,22.0,24.1,24)
       ;


INSERT INTO strokes (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2022-01-09 PARADISE VALLEY-------------------------------------------------------
VALUES (51, 6,4,4,6,6,5,4,5,4,5,4,2,7,6,4,5,5,6),
       (52, 8,5,4,5,5,5,6,5,4,7,7,4,6,5,4,7,5,5),
       (53, 6,6,4,5,5,4,5,3,5,7,5,4,5,5,4,5,6,10),
       (54, 8,8,7,7,6,5,4,4,6,6,5,3,5,7,6,6,6,6),
       (55, 7,4,4,6,6,7,7,4,5,8,6,4,7,5,5,6,5,4),
       (56, 6,5,4,9,5,4,4,3,4,5,5,5,8,5,3,6,6,5),
       (57, 6,5,4,6,6,4,5,3,5,5,6,6,5,5,3,7,6,5),
       (58, 6,5,4,6,5,4,4,5,6,6,6,5,5,5,5,4,6,5),
       (59, 6,8,6,8,5,7,7,4,4,8,6,6,6,6,4,7,5,5),
       (60, 7,7,6,5,6,7,6,5,6,6,6,4,7,6,3,10,6,4),
       (61, 7,7,6,6,6,5,5,2,5,6,3,4,6,5,4,5,6,5),
       (62, 6,6,3,6,7,7,5,4,5,9,6,4,4,7,4,5,5,5)
       ;


INSERT INTO putts (round_id, hole1, hole2, hole3, hole4, hole5, hole6, hole7, hole8, hole9, hole10, hole11, hole12, hole13, hole14, hole15, hole16, hole17, hole18)
---------2022-01-09 PARADISE VALLEY-------------------------------------------------------
VALUES (51, 1,2,2,2,2,2,2,2,1,2,1,1,2,4,3,1,1,3),
       (52, 4,1,3,1,2,2,1,2,2,2,3,2,3,2,2,2,2,2),
       (53, 2,2,1,1,1,1,2,1,2,3,2,2,2,1,2,1,2,1),
       (54, 3,1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,1),
       (55, 2,1,2,3,2,2,3,2,2,2,2,2,3,2,3,2,1,1),
       (56, 1,0,2,3,1,1,1,1,1,2,2,3,2,2,1,1,2,2),
       (57, 2,2,2,2,2,1,3,1,2,2,2,3,3,2,2,2,2,2),
       (58, 2,1,3,2,3,2,2,1,4,2,2,3,2,2,3,1,1,2),
       (59, 2,2,1,2,2,3,3,2,2,3,1,3,1,2,2,2,4,2),
       (60, 1,3,3,1,0,1,4,1,2,2,2,2,3,1,2,4,2,1),
       (61, 3,1,3,2,1,2,2,1,1,3,1,2,2,1,2,1,2,2),
       (62, 2,2,2,3,1,2,3,2,2,3,2,2,1,3,2,1,1,2)
       ;