import os
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)  

app.secret_key = os.environ.get('SECRET_KEY', 'dev-key-change-me')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/honorine.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True)
    phone = db.Column(db.String(20))
    password = db.Column(db.String(200))

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    text = db.Column(db.Text)
    sentiment = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

with app.app_context():
    db.create_all()

def simple_sentiment(text):
    t = text.lower()
    bad_words = ['bad', 'hate', 'angry', 'frustrated', 'toxic']
    if any(word in t for word in bad_words):
        return 'NEGATIVE', 0.85
    return 'POSITIVE', 0.9

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email exists'}), 400
    
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data['phone'],
        password=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'OK'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        return jsonify({'name': f"{user.first_name} {user.last_name}"}), 200
    return jsonify({'error': 'Invalid'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'OK'})

@app.route('/me')
def me():
    return jsonify({'logged_in': 'user_id' in session})

@app.route('/analyze', methods=['POST'])
@login_required
def analyze():
    text = request.json['text']
    sentiment, score = simple_sentiment(text)
    
    fb = Feedback(user_id=session['user_id'], text=text, sentiment=sentiment)
    db.session.add(fb)
    db.session.commit()
    
    return jsonify({'sentiment': sentiment, 'confidence': score})

@app.route('/history')
@login_required
def history():
    fbs = Feedback.query.filter_by(user_id=session['user_id']).all()
    return jsonify([{
        'id': f.id, 
        'text': f.text, 
        'sentiment': f.sentiment
    } for f in fbs])

@app.route('/feedback/<int:fid>', methods=['DELETE'])
@login_required
def delete_feedback(fid):
    fb = Feedback.query.filter_by(id=fid, user_id=session['user_id']).first()
    if fb:
        db.session.delete(fb)
        db.session.commit()
        return jsonify({'message': 'OK'})
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
