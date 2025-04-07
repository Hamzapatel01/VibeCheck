from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
from werkzeug.security import generate_password_hash, check_password_hash
from database_models import db, User, UserData, Mood, ChatHistory
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

EDENAI_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVhMGM0NjAtYjMwZS00NTc4LWI3ZDQtZDI4ZjQ2YTQ5ODk0IiwidHlwZSI6ImFwaV90b2tlbiJ9.dysGwh1pbER8jq7FcPR581qBWM055O7Swr7sN7OU-XQ"

# Error handling middleware
# Helper functions
def get_user(username):
    return User.query.filter_by(username=username).first()

# User routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not all(k in data for k in ['username', 'password', 'email']):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "User already exists"}), 400
    if UserData.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already in use"}), 400

    new_user = User(username=data['username'], password_hash=generate_password_hash(data['password']))
    db.session.add(new_user)
    db.session.flush()
    db.session.add(UserData(user_id=new_user.id, email=data['email']))
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not all(k in data for k in ['username', 'password']):
        return jsonify({"error": "Missing username or password"}), 400

    user = get_user(data['username'])
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {"username": user.username, "email": user.user_data.email}
    }), 200

@app.route('/user-data', methods=['GET'])
def get_user_data():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = get_user(username)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = user.user_data
    if not user_data:
        return jsonify({"error": "User data not found"}), 404

    return jsonify({
        "email": user_data.email}), 200

@app.route('/update-user-data', methods=['PUT'])
def update_user_data():
    data = request.json
    username = data.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = get_user(username)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = user.user_data
    if not user_data:
        return jsonify({"error": "User data not found"}), 404

    if 'email' in data:
        if UserData.query.filter_by(email=data['email']).first() and data['email'] != user_data.email:
            return jsonify({"error": "Email already in use"}), 400
        user_data.email = data['email']
    
    db.session.commit()
    return jsonify({"message": "User data updated successfully"}), 200

# Mood routes
@app.route('/log-mood', methods=['POST'])
def log_mood():
    data = request.json
    if not all(k in data for k in ['username', 'mood']):
        return jsonify({"error": "Missing username or mood"}), 400

    user = get_user(data['username'])
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_mood = Mood(
        user_id=user.id,
        mood=data['mood'],
        note=data.get('note', ''),
        timestamp=datetime.strptime(data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M:%S')), '%Y-%m-%d %H:%M:%S')
    )
    db.session.add(new_mood)
    db.session.commit()
    return jsonify({
        "message": "Mood logged successfully",
        "mood": {
            "id": new_mood.id,
            "mood": new_mood.mood,
            "note": new_mood.note,
            "timestamp": new_mood.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
    }), 201

@app.route('/moods-history', methods=['GET'])
def get_moods_history():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = get_user(username)
    if not user:
        return jsonify({"error": "User not found"}), 404

    moods = Mood.query.filter_by(user_id=user.id).order_by(Mood.timestamp.desc()).all()
    return jsonify([{
        "id": m.id,
        "mood": m.mood,
        "note": m.note,
        "timestamp": m.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for m in moods]), 200

@app.route('/mood-stats', methods=['GET'])
def get_mood_stats():
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    user = get_user(username)
    if not user:
        return jsonify({"error": "User not found"}), 404

    moods = Mood.query.filter_by(user_id=user.id).all()
    counts = {"Happy": 0, "Neutral": 0, "Sad": 0}
    for mood in moods:
        if mood.mood.strip() in counts:
            counts[mood.mood.strip()] += 1

    total = sum(counts.values())
    percents = {k: round((v/total*100) if total > 0 else 0, 1) for k, v in counts.items()}
    return jsonify({"total_entries": total, "mood_counts": counts, "percentages": percents}), 200

@app.route('/clear_history', methods=['DELETE'])
def clear_history():
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400

        user = get_user(username)
        if not user:
            return jsonify({"error": "User not found"}), 404

        Mood.query.filter_by(user_id=user.id).delete()
        db.session.commit()
        return jsonify({"message": "All moods cleared successfully"}), 200
    except Exception as e:
        print(f"Error clearing history: {e}")
        return jsonify({"error": "Failed to clear history"}), 500

@app.route('/delete_mood/<int:mood_id>', methods=['DELETE'])
def delete_mood(mood_id):
    try:
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400

        user = get_user(username)
        if not user:
            return jsonify({"error": "User not found"}), 404

        mood = Mood.query.filter_by(id=mood_id, user_id=user.id).first()
        if not mood:
            return jsonify({"error": "Mood not found"}), 404
            
        db.session.delete(mood)
        db.session.commit()
        return jsonify({"message": "Mood deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting mood: {e}")
        return jsonify({"error": "Failed to delete mood"}), 500

# Chatbot Route
@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    headers = {'Authorization': f'Bearer {EDENAI_API_KEY}', 'Content-Type': 'application/json'}
    payload = {
        "providers": ["openai"],
        "text": user_message,
        "prompt": "You are Dr. Sarah Johnson, a compassionate AI mental health companion. Respond with empathy and professionalism.",
        "instruction": "Please provide an empathetic and supportive response",
        "max_tokens": 150
    }

    try:
        response = requests.post("https://api.edenai.run/v2/text/generation", json=payload, headers=headers)
        if response.status_code != 200:
            return jsonify({"error": "Failed to get response from EdenAI"}), 500

        bot_reply = response.json().get('openai', {}).get('generated_text', "I apologize, but I'm having trouble responding right now.")
        db.session.add(ChatHistory(user_message=user_message, bot_response=bot_reply, timestamp=datetime.now()))
        db.session.commit()
        return jsonify({"response": bot_reply})
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
