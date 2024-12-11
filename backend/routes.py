from app import app, db
from flask import request, jsonify
from models import User, Task, Role
from datetime import datetime
from datetime import *
import jwt
import datetime
from dateutil import parser
from middleware import token_required, role_required

SECRET_KEY='mysecretkey'
# Get all Users
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result)

# Create a new User
@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.json
        #required_fields = ["title", "description", "status", "start_date", "end_date", "priority", "assignee","team"]
        #for field in required_fields:
            #if field not in data or not data.get(field):
               # return jsonify({"error": f"Missing {field} field"}), 400

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        role = Role.query.filter_by(role_name='user').first()
        if not role:
            return jsonify({'error': 'Default role not found'}), 500
        gender = data.get("gender")

        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            return jsonify({'error': 'User already exists'}), 400

        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={name}"
        elif gender == "female":
            img_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        else:
            img_url = None

        new_user = User(username=username, email=email, name=name, role=role, gender=gender, img_url=img_url)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# User Login
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=10)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({'token': token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete a User
@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    else:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg": "User deleted successfully"}), 200
    
# Update a User UPDATE THIS CODE LATERRRRRRRRRRRRRRRLKAJDKANDJKASNBDJKAWNDJKBAJKSDBJAKBDJ
@app.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    else:
        data = request.json

        user.name = data.get("name", user.name)
        user.role = data.get("role", user.role)
        user.description = data.get("description", user.description)
        user.gender = data.get("gender", user.gender)

        db.session.commit()
        return jsonify({"msg": "User updated successfully"}), 200

# Get tasks assigned to the logged-in user
@app.route('/api/tasks', methods=['GET'])
@token_required
def get_tasks(user):
    if user.role.role_name == 'admin':
        tasks = Task.query.all()
    else:
        tasks = Task.query.filter_by(assignee_id=user.id).all()
    return jsonify([task.to_json() for task in tasks])

# Create a new task
@app.route('/api/tasks', methods=['POST'])
@token_required
@role_required('admin')
def create_task(user):
    try:
        data = request.json
        required_fields = ["title", "description", "status", "start_date", "end_date", "priority","assignee_id", "team"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing {field} field"}), 400
            
        title = data.get("title")
        description = data.get("description")
        status = data.get("status")
        start_date = parser.parse(data.get("start_date"))
        end_date = parser.parse(data.get("end_date"))
        priority = data.get("priority")
        assignee_id = data.get("assignee_id")
        team = data.get("team")  

        new_task = Task(
            title=title,
            description=description,
            status=status,
            start_date=start_date,
            end_date=end_date,
            priority=priority,
            assignee_id=assignee_id,
            team=team  
        )


        db.session.add(new_task)
        db.session.commit()

        return jsonify(new_task.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Update an existing Task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
@token_required
def update_task(user, task_id):
    try:
        data = request.json
        task = Task.query.get(task_id)

        if not task:
            return jsonify({"error": "Task not found"}), 404

        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.status = data.get("status", task.status)
        start_date = parser.parse(data.get("start_date"))
        end_date = parser.parse(data.get("end_date"))
        task.priority = data.get("priority", task.priority)
        task.assignee_id = data.get("assignee_id", task.assignee_id)
        task.team = data.get("team", task.team)  

        db.session.commit()

        return jsonify(task.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete a Task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)

        if not task:
            return jsonify({"error": "Task not found"}), 404

        db.session.delete(task)
        db.session.commit()

        return jsonify({"message": "Task deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500