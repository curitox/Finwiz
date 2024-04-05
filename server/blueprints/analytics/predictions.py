import pickle
from flask import request, jsonify, Blueprint
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import func
from middleware.verifyToken import verifyToken
from error import create_error
from model import User, Expense
from utils.categories import expense_categories, priority_scale

predictions_bp=Blueprint("predictions", __name__, template_folder="predictions")
model = pickle.load(open('random_forest_model.pkl', 'rb'))

@predictions_bp.route('/predict/invest', methods=['POST'])
@verifyToken
def invest_predict():
    input_data = request.json
    input_data_array = {key: [value] for key, value in input_data.items()}
    user_input = pd.DataFrame(input_data_array)
    prediction = model.predict(user_input)
    return jsonify(prediction.tolist())

@predictions_bp.route('/predict/maxExpenses', methods=['GET'])
@verifyToken
def maxExpense_predict():
    user_id = request.user.get('id')
    user = User.query.get(user_id)
    
    if not user:
        return create_error(404, "User not found")
    
    # Calculate the start and end date of the last month
    today = datetime.now()
    last_month_end = today.replace(day=1) - timedelta(days=1)
    last_month_start = last_month_end.replace(day=1)
    
    # Filter expenses for the last month
    expenses = Expense.query.filter(Expense.user_id == user_id,
                                     Expense.transactionDate >= last_month_start,
                                     Expense.transactionDate <= last_month_end).all()
    
    # Calculate total expenditure for the last month
    total_expense_last_month = sum(expense.amount for expense in expenses)
    
    # Check if the expenditure exceeds 60% of monthly income
    show_data = total_expense_last_month > (0.6 * user.monthlyIncome)
    
    # Initialize insights list
    insights = []
    
    if show_data:
        # Initialize a dictionary to store total expenditures for each category
        category_totals = {category: 0 for category in expense_categories}
        
        # Calculate total expenditure for each category
        for expense in expenses:
            category_totals[expense.category] += expense.amount
        
        # Sort categories by total expenditure
        sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
        
        # Get the highest expenditure category
        max_category, max_expense = sorted_categories[0]
        
        # Get insights based on priority scale
        for category, total_expense in sorted_categories:
            if total_expense != 0:  # Exclude categories with total expense of 0
                priority = priority_scale.get(category, 0)
                if priority < 3:  # Low priority categories
                    insights.append({"category": category, "total_expense": total_expense})
    else:
        max_category = None
        max_expense = None
    
    message = "Expenditure is within limits." if not show_data else None
    
    return jsonify({
        "max_category": max_category,
        "max_expense": max_expense,
        "insights": insights,
        "showData": show_data,
        "message": message
    })