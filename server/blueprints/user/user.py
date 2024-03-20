from flask import Blueprint
from middleware.verifyToken import verifyToken

user_bp=Blueprint("user", __name__, template_folder="user")

@user_bp.route('/user/details', methods=['POST'])
@verifyToken
def index():
    user_id = request.user.get('id')
    
    return "Hello, World!"
