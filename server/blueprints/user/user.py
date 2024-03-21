from datetime import datetime
from flask import Blueprint, request, jsonify
from middleware.verifyToken import verifyToken
from error import create_error
from models.user import User,db

user_bp=Blueprint("user", __name__, template_folder="user")

@user_bp.route('/user/details', methods=['POST'])
@verifyToken
def index():
    user_id = request.user.get('id')
    details=request.json
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")

    details = request.json

    try:
        if 'dob' in details:
            dob = datetime.strptime(details['dob'], '%Y-%m-%d').date()
            user.dob = dob

        if 'monthlyIncome' in details:
            user.monthlyIncome = details['monthlyIncome']

        if 'gender' in details:
            user.gender = details['gender']

        if 'financialKnowledge' in details:
            user.financialKnowledge = details['financialKnowledge']

        if 'riskTolerance' in details:
            user.riskTolerance = details['riskTolerance']

        user.profileCreated=True

        db.session.commit()

        return jsonify({'message': 'User details updated successfully'})

    except ValueError as e:
        return jsonify({'message': 'Error: {}'.format(str(e))}), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error: {}'.format(str(e))}), 500
