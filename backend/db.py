import sqlite3
from flask import g

DB_PATH = 'clubs.db'

def get_db():
    """
    Opens a new database connection if there is none yet for the
    current application context.
    """
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
    return db

def init_db(app):
    """
    Creates the clubs table if it doesn't exist.
    """
    with app.app_context():
        db = get_db()
        db.execute("""
            CREATE TABLE IF NOT EXISTS clubs (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                club_name       TEXT    NOT NULL,
                total_budget    REAL    NOT NULL,
                ticket_sales    REAL    NOT NULL,
                players_sold    REAL    NOT NULL,
                sponsors        REAL    NOT NULL,
                stadium_cost    REAL    NOT NULL,
                players_bought  REAL    NOT NULL,
                player_wages    REAL    NOT NULL,
                net_profit      REAL    NOT NULL
            );
        """)
        db.commit()

def query_db(query, args=(), one=False):
    """
    Helper to query the database and return rows.
    """
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

if __name__ == '__main__':
    # Initialize the DB standalone
    from app import app
    init_db(app)
    print("✅ clubs.db created (or already existed).")
