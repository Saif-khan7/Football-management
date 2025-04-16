from flask import Flask, request, jsonify, g
from flask_cors import CORS
from db import get_db, init_db, query_db

app = Flask(__name__)
CORS(app)
init_db(app)

@app.teardown_appcontext
def close_connection(exception):
    """
    Close the DB connection after each request.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def calculate_net(ticket_sales, players_sold, sponsors,
                  stadium_cost, players_bought, player_wages):
    """
    Net Profit = (inflows) - (outflows)
    """
    return (
        (ticket_sales + players_sold + sponsors)
        - (stadium_cost + players_bought + player_wages)
    )

@app.route('/clubs', methods=['POST'])
def add_club():
    data = request.json
    # parse & convert
    club_name      = data['club_name']
    total_budget   = float(data['total_budget'])
    ticket_sales   = float(data['ticket_sales'])
    players_sold   = float(data['players_sold'])
    sponsors       = float(data['sponsors'])
    stadium_cost   = float(data['stadium_cost'])
    players_bought = float(data['players_bought'])
    player_wages   = float(data['player_wages'])
    net = calculate_net(ticket_sales, players_sold, sponsors,
                        stadium_cost, players_bought, player_wages)

    db = get_db()
    db.execute(
        """
        INSERT INTO clubs
          (club_name, total_budget, ticket_sales, players_sold, sponsors,
           stadium_cost, players_bought, player_wages, net_profit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (club_name, total_budget, ticket_sales, players_sold, sponsors,
         stadium_cost, players_bought, player_wages, net)
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
    # parse & convert
    club_name      = data['club_name']
    total_budget   = float(data['total_budget'])
    ticket_sales   = float(data['ticket_sales'])
    players_sold   = float(data['players_sold'])
    sponsors       = float(data['sponsors'])
    stadium_cost   = float(data['stadium_cost'])
    players_bought = float(data['players_bought'])
    player_wages   = float(data['player_wages'])
    net = calculate_net(ticket_sales, players_sold, sponsors,
                        stadium_cost, players_bought, player_wages)

    db = get_db()
    db.execute(
        """
        UPDATE clubs SET
          club_name=?, total_budget=?, ticket_sales=?, players_sold=?, sponsors=?,
          stadium_cost=?, players_bought=?, player_wages=?, net_profit=?
        WHERE id=?
        """,
        (club_name, total_budget, ticket_sales, players_sold, sponsors,
         stadium_cost, players_bought, player_wages, net, club_id)
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
    app.run(debug=True)
