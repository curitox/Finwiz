from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
if __name__ == '__main__':
    app.run(debug=True)

try:
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://finance_database_p1ez_user:SfTEAsb0bjdiVF7BtTzlTxiGK7DdyaWs@dpg-cnlacjqcn0vc73fj3a50-a.oregon-postgres.render.com/finance_database_p1ez"
    app.config['SECRET_KEY'] = "2d64e71b6c064780810754b6ff01d8ac"
    print("Connection succesful")
except:
    print("Some error")

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# from blueprints.predictions.predictions import predictions_bp
from blueprints.auth.auth import auth_bp
from blueprints.user.user import user_bp
from ml import *

app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
