from functools import wraps
from flask import request, jsonify
from models import User

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        print("Authorization header:", token)  # Log the Authorization header
        if not token:
            return jsonify({'error': 'Token is missing'}), 403
        try:
            token = token.split()[1]
        except IndexError:
            return jsonify({'error': 'Token format is invalid'}), 403
        user = User.verify_auth_token(token)
        if not user:
            return jsonify({'error': 'Invalid token'}), 403
        return f(user, *args, **kwargs)
    return decorated_function

def role_required(role_name):
    def decorator(f):
        @wraps(f)
        def decorated_function(user, *args, **kwargs):
            if user.role.role_name != role_name:
                return jsonify({'error': 'Access denied'}), 403
            return f(user, *args, **kwargs)
        return decorated_function
    return decorator