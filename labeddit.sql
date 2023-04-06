-- Active: 1678568425859@@127.0.0.1@3306

CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    comments INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE 
);

CREATE TABLE comments(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
     FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE likes_dislikes_posts(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE likes_dislikes_comments (
    user_id TEXT NOT NULL,
    comments_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comments_id) REFERENCES comments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DROP TABLE users;
DROP TABLE posts;
DROP TABLE comments;
DROP TABLE likes_dislikes_posts;
DROP TABLE likes_dislikes_comments;


INSERT INTO users(id, name, email, password, role)
VALUES
("a001","Lua", "luazinha@email.com", "155445", "adm"),
("a002", "Linda", "lindinha@email.com", "454544", "usuário");

INSERT INTO posts (id, creator_id, content)
VALUES
("p001", "a001","Meu primeiro dia de trabalho"),
("p002", "a002", "Viagem para Maldivas");

INSERT INTO likes_dislikes_posts(user_id, post_id, like )
VALUES 
("a002", "p001",0), 
("a001", "p002", 1); 

SELECT * FROM users;
SELECT*FROM posts;
SELECT * FROM comments;
SELECT * FROM likes_dislikes_posts;
SELECT * FROM likes_dislikes_comments;

SELECT  
    posts.id ,
    posts.creator_id ,
    posts.content ,
    posts.likes,
    posts.dislikes,
    posts.created_at,
    posts.updated_at,
    users.name As creator_name
    FROM posts
    JOIN users
    ON posts.creator_id = users.id;

