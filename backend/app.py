from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
import os

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database1.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecretkey' 

db = SQLAlchemy(app)
migrate = Migrate(app, db)
import routes
import models

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    print(f"FLASK_ENV: {os.environ.get('FLASK_ENV')}")
    print(f"Debug mode: {app.debug}")
    app.run(debug=os.environ.get('FLASK_ENV') == 'development')






# Ref: https://www.youtube.com/watch?v=tWHXaSC2T_s&list=WL&index=2&t=7689s
