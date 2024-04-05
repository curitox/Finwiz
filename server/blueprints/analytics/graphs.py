from flask import request, jsonify, Blueprint
from datetime import datetime, timedelta
from sqlalchemy import func
from collections import defaultdict, deque
from middleware.verifyToken import verifyToken
from error import create_error
from datetime import date
from model import User, Expense, Goal, db
from app import app
from utils.category_colors import category_colors

graphs_bp=Blueprint("graphs", __name__, template_folder="graphs")

@graphs_bp.route('/get/expenseCategory', methods=['GET'])
@verifyToken
def expense_category():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    
    # Query to get total expenses for the user
    total_expenses = db.session.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id).scalar() or 0
    
    # Query to get expenses grouped by category
    category_expenses = db.session.query(Expense.category, func.sum(Expense.amount)).filter(Expense.user_id == user_id).group_by(Expense.category).all()
    
    # Calculate percentage and assign color for each category
    category_percentage = []
    for category, amount in category_expenses:
        percentage = round((amount / total_expenses) * 100, 2)
        color = category_colors.get(category.lower(), "#CCCCCC")  # Default color if category not found
        category_percentage.append({"value": float(percentage), "text": category, "color": color})
    
    return jsonify(category_percentage)

@graphs_bp.route('/get/goalStatus', methods=['GET'])
@verifyToken
def goal_category():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    # Query to get total goals for the user
    total_goals = Goal.query.filter_by(user_id=user_id).count()
    
    # Query to get goals grouped by status
    status_counts = db.session.query(Goal.status, func.count(Goal.id)).filter(Goal.user_id == user_id).group_by(Goal.status).all()
    
    # Calculate percentage for each status
    status_percentage = []
    for status, count in status_counts:
        percentage = round((count / total_goals) * 100, 2)
        if status == 'IN_PROGRESS':
            color = '#FFA500'
        elif status == 'COMPLETE':
            color = '#90EE90'
        status_percentage.append({"value": percentage, "color": color, "text": status})
    
    return jsonify(status_percentage)

@graphs_bp.route('/get/expenseWeekly', methods=['GET'])
@verifyToken
def expense_weekly():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    endDay = datetime.now().date()+timedelta(days=1)
    present_day_of_week = endDay.weekday()  
    startDay = endDay - timedelta(days=6)

    expenses = Expense.query.filter(
        Expense.user_id == user_id,
        Expense.transactionDate >= startDay,
        Expense.transactionDate <= endDay
    ).all()
    daily_expense_total = defaultdict(float)
    for expense in expenses:
        # Convert transactionDate to day of the week ('M', 'T', 'W', 'T', 'F', 'S', 'S')
        day_label = expense.transactionDate.strftime('%a')
        # Add expense amount to the total for that day
        daily_expense_total[day_label] += float(expense.amount)
    # Prepare the response in the required format
    bar_data = deque([
        {'value': daily_expense_total['Mon'], 'label': 'M'},
        {'value': daily_expense_total['Tue'], 'label': 'T'},
        {'value': daily_expense_total['Wed'], 'label': 'W'},
        {'value': daily_expense_total['Thu'], 'label': 'T'},
        {'value': daily_expense_total['Fri'], 'label': 'F'},
        {'value': daily_expense_total['Sat'], 'label': 'S'},
        {'value': daily_expense_total['Sun'], 'label': 'S'}
    ])
    bar_data.rotate(6-present_day_of_week)
    bar_data = list(bar_data)
    bar_data.pop()
    return jsonify(bar_data)

@graphs_bp.route('/get/goalsGraph', methods=['GET'])
@verifyToken
def goalsGraph():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")
    user_goals = Goal.query.filter_by(user_id=user_id, status='IN_PROGRESS').all()
    all_lineData = []
    lineData = []
    for goal in user_goals:
        savings_by_week = defaultdict(float)
        savings_entries = goal.savings
        for entry in savings_entries:
            savings_by_week[entry.week] += float(entry.amount)
            lineData = []
        for week, savings in sorted(savings_by_week.items()):
            lineData.append({"value": savings, "dataPointText": str(savings)})
        all_lineData.append(lineData)

    return jsonify({"lineData": all_lineData}), 200

@graphs_bp.route('/expenseDaily', methods=['GET'])
@verifyToken
def expense_daily():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    if not user:
        return create_error(404, "User not found")

    # Check if 'm' (month) parameter is provided in the request args
    if 'm' in request.args and request.args['m'] == "month":
        # If 'm' parameter is 'month', query expenses for the current month
        start_date = date.today().replace(day=1)  # First day of the current month
        end_date = date.today()  # Current date
    else:
        # If 'm' parameter is not provided or not equal to 'month', query expenses for the current day
        start_date = date.today()
        end_date = date.today()

    # Query expenses for the user within the specified date range
    expenses = db.session.query(Expense.category, func.sum(Expense.amount)).filter(
        Expense.user_id == user_id,
        func.date(Expense.transactionDate) >= start_date,
        func.date(Expense.transactionDate) <= end_date
    ).group_by(Expense.category).all()

    # Prepare response data
    response_data = []
    total_amount = 0
    for category, amount in expenses:
        response_data.append({
            "name": category,
            "color": category_colors.get(category, "#000000"),  # Default color if not found
            "value": float(amount)  # Convert amount to float
        })
        total_amount += amount
    
    response = {
        "data": response_data,
        "total_amount": total_amount
    }

    return jsonify(response)