from flask import Flask
from flask_cors import CORS
import os

os.environ['PYTHONDONTWRITEBYTECODE']="1"

app = Flask(__name__)

CORS(app)

try:
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
    app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
    print("Connection succesful")
except:
    print("Some error")

from blueprints.analytics.predictions import predictions_bp
from blueprints.analytics.graphs import graphs_bp
from blueprints.auth.auth import auth_bp
from blueprints.user.user import user_bp
from blueprints.expense.expense import expense_bp
from blueprints.goal.goal import goal_bp
from ml import *

app.register_blueprint(auth_bp)
app.register_blueprint(graphs_bp)
app.register_blueprint(user_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(goal_bp)
app.register_blueprint(predictions_bp)

from commands import register_commands
register_commands(app)
