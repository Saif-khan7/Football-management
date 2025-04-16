from flask import Flask, request, jsonify, g
from db import get_db, init_db, query_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   
init_db(app)

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def calculate_net(revenue, wages, spend):
    return revenue - (wages + spend)

@app.route('/clubs', methods=['POST'])
def add_club():
    data = request.json
    net = calculate_net(data['revenue'], data['player_wages'], data['transfer_spend'])
    db = get_db()
    db.execute(
        "INSERT INTO clubs (club_name, total_budget, player_wages, transfer_spend, revenue, net_profit) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (data['club_name'], data['total_budget'], data['player_wages'], data['transfer_spend'], data['revenue'], net)
    )
    db.commit()
    return jsonify({'message': 'Club added'}), 201

@app.route('/clubs', methods=['GET'])
def get_clubs():
    rows = query_db("SELECT * FROM clubs")
    clubs = [dict(r) for r in rows]
    return jsonify(clubs)

@app.route('/clubs/<int:club_id>', methods=['GET'])
def get_club(club_id):
    row = query_db("SELECT * FROM clubs WHERE id = ?", (club_id,), one=True)
    if not row:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(dict(row))

@app.route('/clubs/<int:club_id>', methods=['PUT'])
def update_club(club_id):
    data = request.json
    net = calculate_net(data['revenue'], data['player_wages'], data['transfer_spend'])
    db = get_db()
    db.execute(
        "UPDATE clubs SET club_name=?, total_budget=?, player_wages=?, transfer_spend=?, revenue=?, net_profit=? "
        "WHERE id=?",
        (data['club_name'], data['total_budget'], data['player_wages'], data['transfer_spend'], data['revenue'], net, club_id)
    )
    db.commit()
    return jsonify({'message': 'Club updated'})

@app.route('/clubs/<int:club_id>', methods=['DELETE'])
def delete_club(club_id):
    db = get_db()
    db.execute("DELETE FROM clubs WHERE id=?", (club_id,))
    db.commit()
    return jsonify({'message': 'Club deleted'})

if __name__ == '__main__':
    app.run(debug=True)
