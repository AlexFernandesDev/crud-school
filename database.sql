-- Active: 1698785759587@@127.0.0.1@3306
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  semester1 REAL,
  semester2 REAL,
  professor TEXT,
  room_number INTEGER NOT NULL
);

INSERT INTO students (name, age, semester1, semester2, professor, room_number)
VALUES 
('Maria', 21, 9.0, 9.5, 'Prof. Santos', 102),
('Carlos', 19, 7.8, 8.0, 'Prof. Oliveira', 103),
('Ana', 22, 8.0, 7.5, 'Prof. Pereira', 104),
('Lucas', 20, 9.2, 9.8, 'Prof. Costa', 105),
('João', 20, 8.5, 9.0, 'Prof. Silva', 101);




