import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
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

from controllers import *
from ml import *
