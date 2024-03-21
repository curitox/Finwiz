from app import app, db
from sqlalchemy import Enum
from sqlalchemy.orm import validates
from datetime import datetime
from error import create_error

class User(db.Model): 
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name= db.Column(db.String(50),nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200))
    gender = db.Column(Enum('MALE','FEMALE','OTHER', name='gender_enum', default='MALE'))
    dob = db.Column(db.Date)  
    image = db.Column(db.String) 
    financialKnowledge = db.Column(Enum('BEGINNER', 'INTERMEDIATE', 'ADVANCED',name='financial_knowledge_enum',default='BEGINNER'))
    monthlyIncome = db.Column(db.Float,default=0.0)
    riskTolerance = db.Column(Enum('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', name='risk_tolerance_enum',default='CONSERVATIVE'))
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
    
    @validates('dob')
    def validate_dob(self, key, dob):
        if dob > datetime.now().date():
            return create_error(500, "Incorrect date value")
        return dob
