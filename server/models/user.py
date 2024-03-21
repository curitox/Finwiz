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
    profileCreated = db.Column(db.Boolean, nullable=False, default=False)
    expense = db.relationship('Expense', backref='user')

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

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    transactionDate=db.Column(db.Date)
    category = db.Column(Enum('SAVINGS/INVESTMENT','DEBT_PAYMENTS', 'GROCERIES', 'TRANSPORTATION', 'ENTERTAINMENT', 'UTILITIES', 'INSURANCE', 'DINING_OUT', 'SHOPPING', 'HEALTHCARE', 'RENT/MORTGAGE', 'EDUCATION', 'OTHER', name='expense_category_enum', default='OTHER'))
    amount=db.Column(db.Float, nullable=False)
    description=db.Column(db.String(200))
    paymentMethod=db.Column(Enum('CASH','DEBIT_CARD', name='payment_method_enum', default='CASH'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

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
    
    @validates('date')
    def validate_date(self, key, date):
        if date > datetime.now().date():
            return create_error(500, "Incorrect date value")
        return date