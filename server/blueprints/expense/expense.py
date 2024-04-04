from flask import request, jsonify, Blueprint
from datetime import datetime, timedelta
from collections import defaultdict
from middleware.verifyToken import verifyToken
from model import User, Expense, db
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
    
    # Get query parameters from the request
    d = request.args.get('d')
    m = request.args.get('m')
    y = request.args.get('y')
    
    # Determine the date range based on the parameters provided
    if d:
        try:
            date = datetime.strptime(d, '%Y-%m-%d')
            start_date = date
            end_date = date + timedelta(days=1)
        except ValueError:
            return create_error(400, "Invalid date format. Please provide date in 'YYYY-MM-DD' format.")
    elif m and y:
        try:
            month = int(m)
            year = int(y)
            start_date = datetime(year, month, 1)
            end_date = datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)
        except ValueError:
            return create_error(400, "Invalid month or year value.")
    elif y:
        try:
            year = int(y)
            start_date = datetime(year, 1, 1)
            end_date = datetime(year + 1, 1, 1)
        except ValueError:
            return create_error(400, "Invalid year value.")
    else:
        # Default to current date
        today = datetime.today()
        start_date = datetime(today.year, today.month, today.day)
        end_date = start_date + timedelta(days=1)
    
    # Fetch expenses based on the date range
    expenses = Expense.query.filter_by(user_id=user_id) \
                             .filter(Expense.transactionDate >= start_date) \
                             .filter(Expense.transactionDate < end_date) \
                             .all()
    
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

from flask import jsonify

@expense_bp.route('/expense/yearly', methods=['GET'])
@verifyToken
def getYearlyExpenses():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")

    year = request.args.get('year')
    if not year:
        return create_error(400, "Year parameter is required")

    try:
        year = int(year)
    except ValueError:
        return create_error(400, "Invalid year format")

    expenses = Expense.query.filter(Expense.user_id == user_id)\
                             .filter(db.extract('year', Expense.transactionDate) == year)\
                             .order_by(db.extract('month', Expense.transactionDate).desc())\
                             .all()

    # Organize expenses month-wise
    monthly_expenses = defaultdict(list)
    for expense in expenses:
        month_year = expense.transactionDate.strftime("%B %Y")
        monthly_expenses[month_year].append({
            'id': expense.id,
            'transactionDate': expense.transactionDate.strftime('%Y-%m-%d'),
            'category': expense.category,
            'amount': str(expense.amount),
            'description': expense.description,
            'paymentMethod': expense.paymentMethod
        })

    # Sort the dictionary by keys (month_year) in descending order
    sorted_monthly_expenses = sorted(monthly_expenses.items(), key=lambda x: datetime.strptime(x[0], "%B %Y"), reverse=True)

    # Transform the data into the desired format
    response_data = []
    for month_year, transactions in sorted_monthly_expenses:
        response_data.append({
            "month": month_year,
            "transactions": transactions
        })

    return jsonify(response_data)
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")

    year = request.args.get('year')
    if not year:
        return create_error(400, "Year parameter is required")

    try:
        year = int(year)
    except ValueError:
        return create_error(400, "Invalid year format")

    expenses = Expense.query.filter(Expense.user_id == user_id)\
                             .filter(db.extract('year', Expense.transactionDate) == year)\
                             .order_by(db.extract('month', Expense.transactionDate).desc())\
                             .all()

    # Organize expenses month-wise
    monthly_expenses = {}
    for expense in expenses:
        month_year = expense.transactionDate.strftime("%B %Y")
        if month_year not in monthly_expenses:
            monthly_expenses[month_year] = []
        monthly_expenses[month_year].append({
            'id': expense.id,
            'transactionDate': expense.transactionDate.strftime('%Y-%m-%d'),
            'category': expense.category,
            'amount': str(expense.amount),
            'description': expense.description,
            'paymentMethod': expense.paymentMethod
        })

    # Sort the dictionary by keys (month_year) in descending order
    sorted_monthly_expenses = sorted(monthly_expenses.items(), key=lambda x: datetime.strptime(x[0], "%B %Y"), reverse=True)

    return jsonify(sorted_monthly_expenses)


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
        print(user.expense)
        db.session.delete(expense)
        user.expense.remove(expense)

        db.session.commit()

        return jsonify({'message': 'Expense deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return create_error(500, str(e))
