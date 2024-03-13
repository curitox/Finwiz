from sqlalchemy.orm import relationship
from app import app, db

class User(db.Model): 
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200))
    googleAuth = db.Column(db.Boolean, nullable=False, default=False)

    @staticmethod
    def createTable():
        try:
            with app.app_context():
                db.create_all()
            print("Created table")
        except:
            print("Error")
    
    @staticmethod
    def dropTable():
        try:
            with app.app_context():
                db.drop_all()
            print("Dropped table")
        except Exception as e:
            print(f"Error: {e}")
