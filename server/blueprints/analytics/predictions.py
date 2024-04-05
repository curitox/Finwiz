import pickle
from flask import request, jsonify, Blueprint
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import func
from middleware.verifyToken import verifyToken
from error import create_error
from model import User, Expense
from utils.categories import expense_categories

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
    
    # Calculate the date 2 months ago
    two_months_ago = datetime.now() - timedelta(days=60)
    
    # Filter expenses for the last 2 months
    expenses = Expense.query.filter(Expense.user_id == user_id,
                                     Expense.transactionDate >= two_months_ago).all()
    
    # Initialize a dictionary to store total expenditures for each category
    category_totals = {category: 0 for category in expense_categories}
    
    # Calculate total expenditure for each category
    for expense in expenses:
        category_totals[expense.category] += expense.amount
    
    # Define the priority scale for categories
    priority_scale = {
        'food': 3,
        'shopping': 1,
        'transportation': 2,
        'housing': 5,
        'utilities': 4,
        'health_fitness': 3,
        'personal_care': 3,
        'entertainment': 1,
        'education': 5,
        'travel': 2,
        'savings_investments': 4,
        'debt_payments': 5,
        'gifts_donations': 1,
        'miscellaneous': 2
    }
    
    # Sort categories by total expenditure
    sorted_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
    
    # Get the highest expenditure category
    max_category, max_expense = sorted_categories[0]
    
    # Get insights based on priority scale
    insights = []
    
    for category, total_expense in sorted_categories:
        priority = priority_scale.get(category, 0)
        if priority < 3:  # Low priority categories
            insights.append({"category": category, "total_expense": total_expense})
    
    return jsonify({
        "max_category": max_category,
        "max_expense": max_expense,
        "insights": insights
    })
