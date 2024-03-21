from flask import request
import jwt
import os
from functools import wraps
from error import create_error

def verifyToken(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        
        if not token:
            return create_error(403, "Unauthorized")
        
        token = token.split(" ")[1]
        
        if not token:
            return create_error(403, "Unauthorized")
        
        try:
            decode = jwt.decode(token, os.environ['SECRET_KEY'], algorithms=['HS256'])
            request.user = decode  # Storing decoded token data in request for further usage
        except jwt.ExpiredSignatureError:
            return create_error(403, "Unauthorized")
        except jwt.InvalidTokenError:
            return create_error(403, "Unauthorized")
        return func(*args, **kwargs)
    return decorated_function
