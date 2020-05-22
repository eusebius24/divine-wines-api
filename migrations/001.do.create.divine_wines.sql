CREATE TABLE wines (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    vintner TEXT,
    varietal TEXT,
    year INTEGER,
    region TEXT,
    tasting_notes TEXT,
    rating INTEGER
)