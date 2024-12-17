from app import db
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    role = db.relationship('Role', backref=db.backref('users', lazy=True))
    gender = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(255), nullable=True)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_json(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'role': self.role.role_name,
            'gender': self.gender,
            'imgUrl': self.img_url,
        }

    @staticmethod
    def verify_auth_token(token):
        try:
            data = jwt.decode(token, 'mysecretkey', algorithms=['HS256'])
            print("Decoded token data:", data)  # Log the decoded token data
            return User.query.get(data['user_id'])
        except Exception as e:
            print("Token verification failed:", e)  # Log the error
            return None

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    priority = db.Column(db.String(50), nullable=False)
    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    assignee = db.relationship('User', backref=db.backref('tasks', lazy=True))
    team = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'priority': self.priority,
            'assignee': self.assignee.username,
            'team': self.team,
        }

class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(50), nullable=False)

    def to_json(self):
        return {
            'id': self.id,
            'role_name': self.role_name,
        }
    
class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('notifications', lazy=True))
    message = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='unread')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
