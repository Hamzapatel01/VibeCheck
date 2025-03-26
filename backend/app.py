from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
from werkzeug.security import generate_password_hash, check_password_hash
from database_models import db, User, Mood, ChatHistory
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

EDENAI_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmVhMGM0NjAtYjMwZS00NTc4LWI3ZDQtZDI4ZjQ2YTQ5ODk0IiwidHlwZSI6ImFwaV90b2tlbiJ9.dysGwh1pbER8jq7FcPR581qBWM055O7Swr7sN7OU-XQ"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    new_user = User(username=username, password_hash=generate_password_hash(password))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200

# Mood Tracking Routes
@app.route('/log-mood', methods=['POST'])
def log_mood():
    try:
        data = request.json
        mood = data.get('mood')
        note = data.get('note', '')
        timestamp = data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

        if not mood:
            return jsonify({"error": "Mood is required"}), 400

        new_mood = Mood(
            mood=mood,
            note=note,
            timestamp=datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S')
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
    except Exception as e:
        print(f"Error logging mood: {e}")
        return jsonify({"error": "Failed to log mood"}), 500

@app.route('/moods-history', methods=['GET'])
def get_moods_history():
    try:
        mood_logs = Mood.query.order_by(Mood.timestamp.desc()).all()
        
        mood_data = [
            {
                "id": mood.id,
                "mood": mood.mood,
                "note": mood.note,
                "timestamp": mood.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }
            for mood in mood_logs
        ]
        
        return jsonify(mood_data), 200
    except Exception as e:
        print(f"Error fetching mood history: {e}")
        return jsonify({"error": "Failed to fetch mood history"}), 500

@app.route('/mood-stats', methods=['GET'])
def get_mood_stats():
    try:
        moods = Mood.query.all() 
        # Initialize counts
        happy_count = neutral_count = sad_count = 0
        # Count each type of mood
        for mood in moods:
            mood_type = mood.mood.strip()
            if mood_type == "Happy":
                happy_count += 1
            elif mood_type == "Neutral":
                neutral_count += 1
            elif mood_type == "Sad":
                sad_count += 1

        total_moods = happy_count + neutral_count + sad_count

        stats = {
            "total_entries": total_moods,
            "mood_counts": {
                "Happy": happy_count,
                "Neutral": neutral_count,
                "Sad": sad_count
            },
            "percentages": {
                "Happy": round((happy_count / total_moods * 100) if total_moods > 0 else 0, 1),
                "Neutral": round((neutral_count / total_moods * 100) if total_moods > 0 else 0, 1),
                "Sad": round((sad_count / total_moods * 100) if total_moods > 0 else 0, 1)
            }
        }

        return jsonify(stats), 200
    except Exception as e:
        print(f"Error calculating stats: {e}")
        return jsonify({
            "total_entries": 0,
            "mood_counts": {"Happy": 0, "Neutral": 0, "Sad": 0},
            "percentages": {"Happy": 0, "Neutral": 0, "Sad": 0}
        }), 200

@app.route('/clear_history', methods=['DELETE'])
def clear_history():
    try:
        Mood.query.delete()
        db.session.commit()
        return jsonify({"message": "All moods cleared successfully"}), 200
    except Exception as e:
        print(f"Error clearing history: {e}")
        return jsonify({"error": "Failed to clear history"}), 500

@app.route('/delete_mood/<int:mood_id>', methods=['DELETE'])
def delete_mood(mood_id):
    try:
        mood = Mood.query.get(mood_id)
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

    headers = {
        'Authorization': f'Bearer {EDENAI_API_KEY}',
        'Content-Type': 'application/json'
    }

    payload = {
        "providers": ["openai"],
        "text": user_message,
        "prompt": (
            "You are Dr. Sarah Johnson, a compassionate AI mental health companion. "
            "Respond with empathy and professionalism, focusing on emotional support "
            "and active listening. If someone expresses serious concerns, encourage them "
            "to seek professional help."
        ),
        "instruction": "Please provide an empathetic and supportive response",
        "max_tokens": 150
    }

    try:
        response = requests.post(
            "https://api.edenai.run/v2/text/generation",
            json=payload,
            headers=headers
        )

        if response.status_code != 200:
            print(f"EdenAI Error: {response.text}")
            return jsonify({"error": "Failed to get response from EdenAI"}), 500

        bot_reply = response.json().get('openai', {}).get('generated_text', "I apologize, but I'm having trouble responding right now.")
        chat_entry = ChatHistory(
            user_message=user_message,
            bot_response=bot_reply,
            timestamp=datetime.now()
        )
        db.session.add(chat_entry)
        db.session.commit()

        return jsonify({"response": bot_reply})
    except Exception as e:
        print(f"Unexpected Error in chatbot: {str(e)}")
        return jsonify({
            "error": "An unexpected error occurred. Please try again later."
        }), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
