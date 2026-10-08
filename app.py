import json
import os
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

SCORES_FILE = os.path.join(os.path.dirname(__file__), 'scores.json')

def load_scores():
    if not os.path.exists(SCORES_FILE):
        default_scores = [
            {"player_name": "CazadorAlfa", "score": 7500, "kills": 32, "defeated_boss": True, "date": "2026-10-08"},
            {"player_name": "SombraNocturna", "score": 5400, "kills": 24, "defeated_boss": True, "date": "2026-10-08"},
            {"player_name": "DesertRanger", "score": 4800, "kills": 20, "defeated_boss": False, "date": "2026-10-08"},
            {"player_name": "PistoleroCyber", "score": 3200, "kills": 15, "defeated_boss": False, "date": "2026-10-08"},
            {"player_name": "Novato", "score": 1500, "kills": 7, "defeated_boss": False, "date": "2026-10-08"}
        ]
        save_scores(default_scores)
        return default_scores
    try:
        with open(SCORES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_scores(scores):
    try:
        with open(SCORES_FILE, 'w', encoding='utf-8') as f:
            json.dump(scores, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving scores: {e}")

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return jsonify({"error": "Not found"}), 404

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "game": "Cazador del Desierto Nocturno: El Monstruo de 3 Ojos",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/scores', methods=['GET'])
def get_scores():
    scores = load_scores()
    scores.sort(key=lambda x: x.get('score', 0), reverse=True)
    return jsonify(scores[:10])

@app.route('/api/scores', methods=['POST'])
def add_score():
    data = request.get_json() or {}
    player_name = str(data.get('player_name', 'Cazador')).strip()[:15] or 'Cazador'
    score = int(data.get('score', 0))
    kills = int(data.get('kills', 0))
    defeated_boss = bool(data.get('defeated_boss', False))

    new_entry = {
        "player_name": player_name,
        "score": score,
        "kills": kills,
        "defeated_boss": defeated_boss,
        "date": datetime.now().strftime('%Y-%m-%d %H:%M')
    }

    scores = load_scores()
    scores.append(new_entry)
    scores.sort(key=lambda x: x.get('score', 0), reverse=True)
    scores = scores[:25] # Guardar top 25
    save_scores(scores)

    return jsonify({"message": "Puntuación guardada con éxito", "entry": new_entry, "top_scores": scores[:10]}), 201

if __name__ == '__main__':
    print("Iniciando servidor Flask de Cazador Nocturno...")
    print("Abre tu navegador en: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
