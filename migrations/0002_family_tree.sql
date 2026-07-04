CREATE TABLE IF NOT EXISTS persons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender TEXT CHECK(gender IN ('male', 'female', 'unknown')) DEFAULT 'unknown',
  birth_date TEXT,
  death_date TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS parent_links (
  child_id INTEGER NOT NULL,
  parent_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('father', 'mother')),
  PRIMARY KEY (child_id, role),
  FOREIGN KEY (child_id) REFERENCES persons(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES persons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS spouse_links (
  person_a_id INTEGER NOT NULL,
  person_b_id INTEGER NOT NULL,
  married_at TEXT,
  PRIMARY KEY (person_a_id, person_b_id),
  FOREIGN KEY (person_a_id) REFERENCES persons(id) ON DELETE CASCADE,
  FOREIGN KEY (person_b_id) REFERENCES persons(id) ON DELETE CASCADE,
  CHECK(person_a_id < person_b_id)
);

-- 示例三代数据（便于本地验证布局）
INSERT INTO persons (id, name, gender, birth_date, death_date, bio) VALUES
  (1, '张大山', 'male', '1940', '2015', '家族第一代'),
  (2, '李秀英', 'female', '1945', NULL, NULL),
  (3, '张建国', 'male', '1968', NULL, NULL),
  (4, '王芳', 'female', '1970', NULL, NULL),
  (5, '张明', 'male', '1995', NULL, NULL),
  (6, '张丽', 'female', '1998', NULL, NULL);

INSERT INTO parent_links (child_id, parent_id, role) VALUES
  (3, 1, 'father'),
  (3, 2, 'mother'),
  (5, 3, 'father'),
  (5, 4, 'mother'),
  (6, 3, 'father'),
  (6, 4, 'mother');

INSERT INTO spouse_links (person_a_id, person_b_id) VALUES
  (1, 2),
  (3, 4);
