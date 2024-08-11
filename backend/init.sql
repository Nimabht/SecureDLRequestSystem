CREATE TABLE requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status TEXT CHECK( status IN ('queued','processing','completed')) NOT NULL DEFAULT 'queued',
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
