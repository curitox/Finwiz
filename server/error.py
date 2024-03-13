class CustomError(Exception):
    def __init__(self, status, message):
        self.status = status
        self.message = message
        super().__init__(message)

def create_error(status, message):
    CustomError(status, message)
    return ({"message": message}), status