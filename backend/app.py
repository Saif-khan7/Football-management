from flask import Flask, request, jsonify, g
from flask_cors import CORS
from db import get_db, init_db, query_db

app = Flask(__name__)
CORS(app)
init_db(app)

@app.teardown_appcontext
def close_connection(exception):
    """
    Closes the database connection at the end of the request.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def calculate_net(revenue, wages, spend):
    """
    Safely convert inputs to floats and compute net profit.
    """
    rev = float(revenue)
    w  = float(wages)
    s  = float(spend)
    return rev - (w + s)

@app.route('/clubs', methods=['POST'])
def add_club():
    data = request.json
    # Parse and convert inputs
    club_name     = data['club_name']
    total_budget  = float(data['total_budget'])
    player_wages  = float(data['player_wages'])
    transfer_spend= float(data['transfer_spend'])
    revenue       = float(data['revenue'])
    net           = calculate_net(revenue, player_wages, transfer_spend)

    db = get_db()
    db.execute(
        """
        INSERT INTO clubs 
          (club_name, total_budget, player_wages, transfer_spend, revenue, net_profit)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (club_name, total_budget, player_wages, transfer_spend, revenue, net)
    )
    db.commit()
    return jsonify({'message': 'Club added'}), 201

@app.route('/clubs', methods=['GET'])
def get_clubs():
    rows = query_db("SELECT * FROM clubs ORDER BY id DESC")
    clubs = [dict(r) for r in rows]
    return jsonify(clubs)

@app.route('/clubs/<int:club_id>', methods=['GET'])
def get_club(club_id):
    row = query_db("SELECT * FROM clubs WHERE id = ?", (club_id,), one=True)
    if row is None:
        return jsonify({'error': 'Club not found'}), 404
    return jsonify(dict(row))

@app.route('/clubs/<int:club_id>', methods=['PUT'])
def update_club(club_id):
    data = request.json
    # Parse and convert inputs
    club_name     = data['club_name']
    total_budget  = float(data['total_budget'])
    player_wages  = float(data['player_wages'])
    transfer_spend= float(data['transfer_spend'])
    revenue       = float(data['revenue'])
    net           = calculate_net(revenue, player_wages, transfer_spend)

    db = get_db()
    db.execute(
        """
        UPDATE clubs
        SET club_name=?, total_budget=?, player_wages=?, transfer_spend=?, revenue=?, net_profit=?
        WHERE id=?
        """,
        (club_name, total_budget, player_wages, transfer_spend, revenue, net, club_id)
    )
    db.commit()
    return jsonify({'message': 'Club updated'})

@app.route('/clubs/<int:club_id>', methods=['DELETE'])
def delete_club(club_id):
    db = get_db()
    db.execute("DELETE FROM clubs WHERE id = ?", (club_id,))
    db.commit()
    return jsonify({'message': 'Club deleted'})

if __name__ == '__main__':
    # Starts the Flask dev server on http://localhost:5000
    app.run(debug=True)
