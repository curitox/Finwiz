from flask import request, jsonify, Blueprint
from middleware.verifyToken import verifyToken
from models.user import User, Expense, db
from error import create_error

expense_bp=Blueprint("expense", __name__, template_folder="expense")

@expense_bp.route('/expense/add', methods=['POST'])
@verifyToken
def addExpense():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    
    expense_input=request.json
    try:
        # Create a new Expense object
        new_expense = Expense(
            transactionDate=expense_input['transactionDate'],
            category=expense_input['category'],
            amount=expense_input['amount'],
            description=expense_input['description'],
            paymentMethod=expense_input['paymentMethod'],
            user_id=user_id
        )
        
        # Add the expense to the user's expenses
        user.expense.append(new_expense)

        # Commit changes to the database
        db.session.add(new_expense)
        db.session.commit()

        return jsonify({'message': 'Expense added successfully'}), 201

    except KeyError as e:
        return jsonify({'message': f'Missing required field: {str(e)}'}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error adding expense: {}'.format(str(e))}), 500
    
@expense_bp.route('/expense/get', methods=['GET'])
@verifyToken
def getExpenses():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    expenses = Expense.query.filter_by(user_id=user_id).all()
    expenses_data = []
    for expense in expenses:
        expense_data = {
            'id': expense.id,
            'transactionDate': expense.transactionDate.isoformat(),
            'category': expense.category,
            'amount': expense.amount,
            'description': expense.description,
            'paymentMethod': expense.paymentMethod
        }
        expenses_data.append(expense_data)
    return jsonify({'Expenses': expenses_data})

@expense_bp.route('/expense/update', methods=['PATCH'])
@verifyToken
def updateExpense():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    
    expense_id = request.args.get('id')
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    if not expense:
        return create_error(404, "Expense not found")
    if expense.user_id != user_id:
        return create_error(403, "You do not have permission to delete this expense")

    try:
        expense_data = request.json
        for key, value in expense_data.items():
            setattr(expense, key, value)

        db.session.commit()

        return jsonify({
            'message': 'Expense updated successfully',
            'expense': {
                'id': expense.id,
                'transactionDate': expense.transactionDate.isoformat(),
                'category': expense.category,
                'amount': expense.amount,
                'description': expense.description,
                'paymentMethod': expense.paymentMethod
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return create_error(500, str(e))

@expense_bp.route('/expense/delete', methods=['DELETE'])
@verifyToken
def deleteExpense():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    expense_id = request.args.get('id')
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
    if not expense:
        return create_error(404, "Expense not found")

    if expense.user_id != user_id:
        return create_error(403, "You do not have permission to delete this expense")

    try:
        db.session.delete(expense)
        user.expense.remove(expense)

        db.session.commit()

        return jsonify({'message': 'Expense deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return create_error(500, str(e))
