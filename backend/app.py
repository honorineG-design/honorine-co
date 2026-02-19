from flask import Flask, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from textblob import TextBlob
from models import db, User, Feedback
import os
import jwt
import datetime
from functools import wraps

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.status_code = 200
        return response

def create_token(user):
    payload = {
        'user_id': user.id,
        'username': user.username,
        'is_admin': user.is_admin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def get_current_user():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return User.query.get(payload['user_id'])
    except Exception:
        return None

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        return f(user, *args, **kwargs)
    return decorated

def analyze_sentiment(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    if polarity >= 0:
        sentiment = "POSITIVE"
        confidence = round(50 + (polarity * 50), 2)
    else:
        sentiment = "NEGATIVE"
        confidence = round(50 + (abs(polarity) * 50), 2)
    return sentiment, confidence

@app.route('/')
def home():
    return jsonify({"status": "Honorine-co Employee Feedback API is running!"})

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409
    hashed_pw = generate_password_hash(password)
    is_admin = User.query.count() == 0
    user = User(username=username, password=hashed_pw, is_admin=is_admin)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Account created successfully!", "is_admin": is_admin})

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401
    token = create_token(user)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "username": user.username,
        "is_admin": user.is_admin,
        "user_id": user.id
    })

@app.route('/api/logout', methods=['POST', 'OPTIONS'])
def logout():
    return jsonify({"message": "Logged out"})

@app.route('/api/me', methods=['GET', 'OPTIONS'])
def me():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    user = get_current_user()
    if user:
        return jsonify({
            "authenticated": True,
            "username": user.username,
            "is_admin": user.is_admin,
            "user_id": user.id
        })
    return jsonify({"authenticated": False})

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
@login_required
def analyze(current_user):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    data = request.get_json()
    text = data.get('text', '').strip()
    employee_name = data.get('employee_name', 'Unknown').strip()
    department = data.get('department', '').strip()
    rating = data.get('rating', None)
    if not text:
        return jsonify({"error": "Feedback text is required"}), 400
    if len(text) > 512:
        text = text[:512]
    sentiment, confidence = analyze_sentiment(text)
    record = Feedback(
        user_id=current_user.id,
        employee_name=employee_name,
        department=department,
        text=text,
        sentiment=sentiment,
        confidence=confidence,
        rating=rating
    )
    db.session.add(record)
    db.session.commit()
    return jsonify({
        "sentiment": sentiment,
        "confidence": confidence,
        "employee_name": employee_name,
        "id": record.id
    })

@app.route('/api/feedback', methods=['GET', 'OPTIONS'])
@login_required
def get_feedback(current_user):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    if current_user.is_admin:
        records = Feedback.query.order_by(Feedback.created_at.desc()).all()
    else:
        records = Feedback.query.filter_by(user_id=current_user.id).order_by(Feedback.created_at.desc()).all()
    return jsonify([{
        "id": r.id,
        "employee_name": r.employee_name,
        "department": r.department,
        "text": r.text,
        "sentiment": r.sentiment,
        "confidence": r.confidence,
        "rating": r.rating,
        "submitted_by": r.user.username if r.user else "Unknown",
        "date": r.created_at.strftime("%b %d, %Y %H:%M")
    } for r in records])

@app.route('/api/stats', methods=['GET', 'OPTIONS'])
@login_required
def get_stats(current_user):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    total = Feedback.query.count()
    positive = Feedback.query.filter_by(sentiment='POSITIVE').count()
    negative = Feedback.query.filter_by(sentiment='NEGATIVE').count()
    total_users = User.query.count()
    dept_stats = db.session.query(
        Feedback.department,
        db.func.count(Feedback.id).label('count')
    ).group_by(Feedback.department).all()
    return jsonify({
        "total_feedback": total,
        "positive": positive,
        "negative": negative,
        "total_users": total_users,
        "positivity_rate": round((positive / total * 100), 1) if total > 0 else 0,
        "departments": [{"name": d[0] or "Unspecified", "count": d[1]} for d in dept_stats]
    })

@app.route('/api/feedback/<int:id>', methods=['DELETE', 'OPTIONS'])
@login_required
def delete_feedback(current_user, id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    if not current_user.is_admin:
        return jsonify({"error": "Admin access required"}), 403
    record = Feedback.query.get_or_404(id)
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Deleted successfully"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database ready.")
app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
