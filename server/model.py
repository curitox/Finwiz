from app import app
from sqlalchemy import Enum, func, text
from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.orm import Session
from datetime import datetime
from error import create_error

db = SQLAlchemy(app)
migrate = Migrate()

migrate.init_app(app, db)
class User(db.Model): 
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name= db.Column(db.String(50),nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200))
    gender = db.Column(Enum('MALE','FEMALE','OTHER', name='gender_enum', default='MALE'))
    dob = db.Column(db.Date)  
    image = db.Column(db.String)
    image2 = db.Column(db.String)
    financialKnowledge = db.Column(Enum('BEGINNER', 'INTERMEDIATE', 'ADVANCED',name='financial_knowledge_enum',default='BEGINNER'))
    monthlyIncome = db.Column(db.Numeric(10, 2),default=0.0)
    riskTolerance = db.Column(Enum('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', name='risk_tolerance_enum',default='CONSERVATIVE'))
    googleAuth = db.Column(db.Boolean, nullable=False, default=False)
    profileCreated = db.Column(db.Boolean, nullable=False, default=False)
    expense = db.relationship('Expense', backref='user')
    goal = db.relationship('Goal', backref='goal')

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
    transactionDate=db.Column(db.DateTime)
    category = db.Column(db.String(150))
    amount=db.Column(db.Numeric(10, 2), nullable=False)
    description=db.Column(db.String(200))
    paymentMethod=db.Column(Enum('CASH','CARD','ONLINE', name='payment_method_enum', default='ONLINE'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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

class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    target_amount = db.Column(db.Numeric(10, 2), nullable=False)
    achieved_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0)
    target_date = db.Column(db.Date, nullable=False)
    priority_level = db.Column(Enum('HIGH', 'MEDIUM', 'LOW', name='priority_level_enum', default='LOW'))
    status = db.Column(Enum('COMPLETE', 'IN_PROGRESS', name='status_enum', default='IN_PROGRESS'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    savings = db.relationship('Savings', backref='goal')
    createdOn = db.Column(db.Date, default=func.current_date(), nullable=False)

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
        if date < datetime.now().date():
            return create_error(500, "Target date should be more than the current date!")
        return date

class Savings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    week = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey('goal.id'), nullable=False)
    date=db.Column(db.DateTime)
    description=db.Column(db.String(200))
    category = db.Column(db.String(50), default='savings')

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
