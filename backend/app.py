from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import (
    LoginManager, login_user, logout_user,
    login_required, current_user
)
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Feedback
import os

app = Flask(__name__)

app.secret_key = 'honorine-hr-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


CORS(app, supports_credentials=True)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


print("Loading simple sentiment analyzer...")

def simple_sentiment(text: str):
    """
    Very simple rule-based sentiment.
    This replaces heavy Hugging Face + torch so it runs on Windows.
    """
    t = text.lower()
    negative_words = [
        "bad", "hate", "frustrated", "leaving", "angry",
        "toxic", "terrible", "awful", "disappointed",
        "burnout", "burned out", "quitting", "resign"
    ]
    if any(w in t for w in negative_words):
        return {"label": "NEGATIVE", "score": 0.88}
    return {"label": "POSITIVE", "score": 0.9}

print("Ready.")

with app.app_context():
    db.create_all()


@app.route('/register', methods=['POST'])
def register():
    data = request.json or {}
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')

    if not first_name or not last_name or not email or not phone or not password:
        return jsonify({'error': 'All fields are required.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists.'}), 400

    hashed = generate_password_hash(password)
    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        password=hashed
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Account created. Please sign in.'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    login_user(user)
    return jsonify({
        'message': 'Logged in.',
        'name': user.get_full_name(),
        'email': user.email
    }), 200


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out.'}), 200


@app.route('/me', methods=['GET'])
def me():
    if current_user.is_authenticated:
        return jsonify({
            'logged_in': True,
            'name': current_user.get_full_name(),
            'email': current_user.email,
            'phone': current_user.phone
        }), 200
    return jsonify({'logged_in': False}), 401


@app.route('/analyze', methods=['POST'])
@login_required
def analyze():
    text = (request.json or {}).get('text', '').strip()
    if not text:
        return jsonify({'error': 'No feedback text provided.'}), 400

    result = simple_sentiment(text)

    fb = Feedback(
        user_id=current_user.id,
        text=text,
        sentiment=result['label']
    )
    db.session.add(fb)
    db.session.commit()

    return jsonify({
        'sentiment': result['label'],
        'confidence': round(result['score'], 4)
    }), 200


@app.route('/history', methods=['GET'])
@login_required
def history():
    records = (
        Feedback.query
        .filter_by(user_id=current_user.id)
        .order_by(Feedback.created_at.desc())
        .limit(100)
        .all()
    )

    data = []
    for r in records:
        data.append({
            'id': r.id,
            'text': r.text,
            'sentiment': r.sentiment,
            'created_at': r.created_at.strftime('%b %d, %H:%M')
        })

    return jsonify(data), 200


@app.route('/feedback/<int:fid>', methods=['DELETE'])
@login_required
def delete_feedback(fid):
    fb = Feedback.query.filter_by(id=fid, user_id=current_user.id).first()
    if not fb:
        return jsonify({'error': 'Feedback not found.'}), 404
    db.session.delete(fb)
    db.session.commit()
    return jsonify({'message': 'Feedback deleted.'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
