import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import (
    LoginManager, login_user, logout_user,
    login_required, current_user
)
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, User, Feedback

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'honorine-hr-2026')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, supports_credentials=True)
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = '/login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def simple_sentiment(text):
    t = text.lower()
    negative_words = ["bad", "hate", "frustrated", "angry", "toxic", "terrible"]
    if any(w in t for w in negative_words):
        return {"label": "NEGATIVE", "score": 0.88}
    return {"label": "POSITIVE", "score": 0.9}

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    password = data.get('password', '')

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(
        first_name=first_name, last_name=last_name,
        email=email, phone=phone,
        password=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registered'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()
    if user and check_password_hash(user.password, data.get('password')):
        login_user(user)
        return jsonify({'name': f"{user.first_name} {user.last_name}"}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'})

@app.route('/me')
def me():
    if current_user.is_authenticated:
        return jsonify({
            'logged_in': True,
            'name': f"{current_user.first_name} {current_user.last_name}"
        })
    return jsonify({'logged_in': False})

@app.route('/analyze', methods=['POST'])
@login_required
def analyze():
    text = request.json.get('text', '')
    result = simple_sentiment(text)
    
    feedback = Feedback(
        user_id=current_user.id,
        text=text,
        sentiment=result['label']
    )
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify({
        'sentiment': result['label'],
        'confidence': result['score']
    })

@app.route('/history')
@login_required
def history():
    feedbacks = Feedback.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': f.id,
        'text': f.text,
        'sentiment': f.sentiment
    } for f in feedbacks])

@app.route('/feedback/<int:fid>', methods=['DELETE'])
@login_required
def delete_feedback(fid):
    feedback = Feedback.query.filter_by(id=fid, user_id=current_user.id).first()
    if feedback:
        db.session.delete(feedback)
        db.session.commit()
        return jsonify({'message': 'Deleted'})
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
