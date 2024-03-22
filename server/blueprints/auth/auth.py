from flask import request, jsonify, abort, Blueprint, render_template
from flask_bcrypt import Bcrypt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import pyotp
import jwt
import datetime
import os
from app import app
from error import create_error
from model import User, Expense, Goal, db

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = "decisionhub.in@gmail.com"
app.config['MAIL_PASSWORD'] = "wscmailudpfcuizp"
app.config['resetSession'] = True

auth_bp=Blueprint("auth", __name__, template_folder="auth")
user=User()
expense=Expense()
goal=Goal()
bcrypt = Bcrypt(app)
mail = Mail(app)

# user.createTable()
# user.dropTable()

# expense.createTable()
# expense.dropTable()

# goal.createTable()
# goal.dropTable()

@auth_bp.route("/users", methods=['GET'])
def getUsers():
    users=User.query.all()
    userList=[
         {'id': user.id, 'email': user.email, 'password': user.password} for user in users
    ]
    return ({"users": userList})

@auth_bp.route('/auth/signup', methods=['POST'])
def create_users():
    # Get user input from request
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    image = data.get('image')

    # Check if required fields are provided
    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required'}), 400

    # Check if the user already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new user
    new_user = User(name=name, email=email, password=hashed_password, image=image)

    # Add the new user to the database
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create user'}), 500

    # Generate JWT token
    token = jwt.encode({'id': new_user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365*100)}, app.config['SECRET_KEY'], algorithm='HS256')

    # Return response with token and user information
    response_data = {
        'token': token,
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'image': new_user.image,
            'email': new_user.email,
            'googleAuth': new_user.googleAuth,
            'profileCreated': new_user.profileCreated
        }

    }
    return jsonify(response_data), 201


@auth_bp.route('/auth/signin', methods=['POST'])
def signin():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        abort(400, "Missing email or password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': "User does not exist"}), 404

    if user.googleAuth:
        return jsonify({'message': "Please login with Google"}), 401
    
    if not check_password_hash(user.password, password):
        return jsonify({'message': "Invalid password"}), 401
    token = jwt.encode({'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365*100)}, app.config['SECRET_KEY'], algorithm='HS256')
    # Return response with token and user information
    response_data = {
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'image': user.image,
            'email': user.email,
            'googleAuth': user.googleAuth,
            'profileCreated': user.profileCreated
        }
    }
    return jsonify(response_data), 201

@auth_bp.route('/auth/googleAuth', methods=['POST'])
def googleAuth():
    try:
        email = request.json.get('email')
        user = User.query.filter_by(email=email).first()

        if not user:
            # If user doesn't exist, create a new user with googleAuth set to True
            user = User(email=email, googleAuth=True)
            db.session.add(user)
            db.session.commit()            
            # Generate JWT token
            token = jwt.encode({'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365*100)}, app.config['SECRET_KEY'], algorithm='HS256')

            response_data = {
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'googleAuth': user.googleAuth
                }
            }
            return jsonify(response_data), 201

        elif user.googleAuth:
            # If user exists and already signed in with Google, generate JWT token
            token = jwt.encode({'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365*100)}, app.config['SECRET_KEY'], algorithm='HS256')

            response_data = {
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'googleAuth': user.googleAuth
                }
            }
            return jsonify(response_data), 201

        else:
            # If user exists but already signed in without Google, return error
            return create_error(500, "User already exists with this email, Google sign in not possible")

    except Exception as e:
        raise e

def reset_password_otp(name, otp_c):
    return {
    'subject': "Finwiz Reset Password Verification",
    'html': """<div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #007AFF; text-align: center; margin-bottom: 30px;">Verify Your Finwiz Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #007AFF; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">{}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear {},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a Finwiz account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #007AFF;">{}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the Finwiz app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a Finwiz account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The Finwiz Team</p>
    </div>""".format(otp_c, name, otp_c)
}

def verify_otp(name, otp_c):
    return {
    'subject': "Finwiz Verify OTP",
    'html': """
            <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h1 style="font-size: 22px; font-weight: 500; color: #007AFF; text-align: center; margin-bottom: 30px;">Verify Your DecisionHub Account</h1>
    <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #007AFF; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
            <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
            <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">{}</h1>
        </div>
        <div style="padding: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear {},</p>
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a Finwiz account. To activate your account, please enter the following verification code:</p>
            <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #007AFF;">{}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the Finwiz app to activate your account.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a Finwiz account, please disregard this email.</p>
        </div>
    </div>
    <br>
    <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The Finwiz Team</p>
</div>
        """.format(otp_c, name, otp_c)
}
@auth_bp.route("/auth/generate-otp", methods=['POST'])
def generatOTP():
    email=request.json.get('email')
    name=request.json.get('name')
    reason=request.json.get('reason')
    secret_key = pyotp.random_base32()
    otp = pyotp.TOTP(secret_key)
    otp_code = otp.now()
    app.config['OTP']=otp_code
    if reason == "FORGOTPASSWORD":
        send_mail(reset_password_otp(name, otp_code), email)
    else:
        send_mail(verify_otp(name, otp_code), email)

    return jsonify({'message': 'OTP sent'})

def send_mail(template, recipient):
    msg = Message(template['subject'], sender=os.environ['MAIL_USERNAME'], recipients=[recipient])
    msg.html = template['html']
    try:
        mail.send(msg)
    except Exception as e:
        return str(e)

@auth_bp.route('/auth/verifyOTP', methods=['GET'])
def verify_OTP():
    code = request.args.getlist('code')
    stored_otp = app.config.get('OTP')
    print(stored_otp)

    if code[0] and stored_otp and int(code[0]) == int(stored_otp):
        app.config['OTP'] = None
        app.config['resetSession'] = True
        return jsonify({'message': 'OTP verified'}), 200
    return abort(403, "Wrong OTP")

@auth_bp.route('/auth/createResetSession', methods=['GET'])
def create_reset_session():
    if app.config.get('resetSession'):
        app.config['resetSession'] = False
        return jsonify({'message': 'Access granted'}), 200
    return jsonify({'message': 'Session expired'}), 400

@auth_bp.route('/auth/resetPassword', methods=['POST'])
def reset_password():
    if not app.config.get('resetSession'):
        return jsonify({'message': 'Session expired'}), 440

    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return create_error(404, "User does not exist")

    if user:
        hashed_password = generate_password_hash(password)

        user.password = hashed_password
        db.session.commit()
        db.session.close()

        app.config['resetSession'] = False
        return jsonify({'message': 'Password reset successful'}), 200