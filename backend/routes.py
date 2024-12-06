from app import app, db
from flask import request, jsonify
from models import User, Task
from datetime import datetime

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

        name = data.get("name")
        role = data.get("role")
        description = data.get("description")
        gender = data.get("gender")

        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={name}"
        elif gender == "female":
            img_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        else:
            img_url = None

        new_user = User(name=name, role=role, description=description, gender=gender, img_url=img_url)

        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.to_json()), 201
    except Exception as e:
        db.session.rollback()
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
    
# Update a User
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

# Get all Tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    result = [task.to_json() for task in tasks]
    return jsonify(result)

# Create a new Task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.json
        required_fields = ["title", "description", "status", "start_date", "end_date", "priority", "assignee","team"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing {field} field"}), 400
            
        title = data.get("title")
        description = data.get("description")
        status = data.get("status")
        start_date = datetime.strptime(data.get("start_date"), '%Y-%m-%d')
        end_date = datetime.strptime(data.get("end_date"), '%Y-%m-%d')
        priority = data.get("priority")
        assignee = data.get("assignee")
        team = data.get("team")  # Comment out the team field

        new_task = Task(
            title=title,
            description=description,
            status=status,
            start_date=start_date,
            end_date=end_date,
            priority=priority,
            assignee=assignee,
            team=team  # Comment out the team field
        )

        db.session.add(new_task)
        db.session.commit()

        return jsonify(new_task.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Update an existing Task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json
        task = Task.query.get(task_id)

        if not task:
            return jsonify({"error": "Task not found"}), 404

        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.status = data.get("status", task.status)
        task.start_date = datetime.strptime(data.get("start_date"), '%Y-%m-%d') if data.get("start_date") else task.start_date
        task.end_date = datetime.strptime(data.get("end_date"), '%Y-%m-%d') if data.get("end_date") else task.end_date
        task.priority = data.get("priority", task.priority)
        task.assignee = data.get("assignee", task.assignee)
        task.team = data.get("team", task.team)  # Comment out the team field

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