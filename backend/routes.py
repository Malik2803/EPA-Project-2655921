from app import app, db
from flask import request, jsonify
from models import User


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

        return jsonify({"msg": "User created successfully"}), 201

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
        user.role = data.get("role",user.role)
        user.description = data.get("description",user.description)
        user.gender = data.get("gender",user.gender)

        db.session.commit()
        return jsonify({"msg": "User updated successfully"}), 200
        
