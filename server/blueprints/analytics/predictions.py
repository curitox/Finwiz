import pickle
from flask import request, jsonify, Blueprint
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import func
from middleware.verifyToken import verifyToken
from model import User, Expense, db
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from error import create_error
from utils.categories import expense_categories, priority_scale
from statsmodels.tsa.statespace.sarimax import SARIMAX
from utils.categories import category_colors
import numpy as np

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
    last_month_end = today
    last_month_start = today.replace(day=1) - timedelta(days=today.day)

    # Filter expenses for the last month
    expenses = Expense.query.filter(Expense.user_id == user_id,
                                     Expense.transactionDate >= last_month_start,
                                     Expense.transactionDate <= last_month_end).all()
    
    # Calculate total expenditure for the last month
    total_expense_last_month = sum(expense.amount for expense in expenses)
    
    # Check if the expenditure exceeds 60% of monthly income
    show_data = total_expense_last_month > (0.6 * float(user.monthlyIncome))
    
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

# Load expense data from database and preprocess
def load_expense_data(user_id):
    expenses = Expense.query.filter_by(user_id=user_id).all()
    categories = [expense.category for expense in expenses]
    categories_mapping = {idx: category for idx, category in enumerate(categories)}
    return categories, categories_mapping

# # Build recommendation model
def build_recommendation_model(user_id):
    descriptions, _ = load_expense_data(user_id)  # Get only categories, ignore mapping
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(descriptions)
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    return cosine_sim

# # Function to recommend categories based on user's spending habits
# def recommend_categories(user_id, user_expenses, cosine_sim, categories_mapping):
#     tfidf_vectorizer = TfidfVectorizer()
#     tfidf_matrix = tfidf_vectorizer.fit_transform(user_expenses)
#     sim_scores = linear_kernel(tfidf_matrix, tfidf_matrix)
#     sim_scores = list(enumerate(sim_scores[user_id]))
#     sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
#     # print(sim_scores)
#     sim_scores = sim_scores[1:6] 
#     category_indices = [i[0] for i in sim_scores]
#     recommended_categories = [categories_mapping[idx] for idx in category_indices]
#     return recommended_categories

# Function to recommend categories based on all users' spending habits
def recommend_categories(cosine_sim,categories_mapping, num_categories=10):
    # Sum up similarity scores across all users
    total_sim_scores = np.sum(cosine_sim, axis=0)
    
    # Enumerate and sort similarity scores
    indexed_sim_scores = list(enumerate(total_sim_scores))
    sorted_sim_scores = sorted(indexed_sim_scores, key=lambda x: x[1], reverse=True)
    
    # Get top frequent category indices
    top_category_indices = [i[0] for i in sorted_sim_scores[:num_categories]]
    recommended_categories = [categories_mapping[idx] for idx in top_category_indices]
    
    return recommended_categories

# API endpoint to get budget recommendations for a user
@predictions_bp.route('/predict/budget_recommendations', methods=['GET'])
@verifyToken
def get_recommendations():
    user_id = request.user.get('id')
    if user_id is None:
        return jsonify({'error': 'User ID is required.'}), 400
    
    # Load user's expenses and categories mapping
    user_expenses, categories_mapping = load_expense_data(user_id)

    # Build recommendation model
    cosine_sim = build_recommendation_model(user_id)
    # Get recommendations
    # recommended_categories = recommend_categories(user_id, user_expenses, cosine_sim, categories_mapping)
    recommended_categories = recommend_categories(cosine_sim,categories_mapping)
    
    # Count occurrences of each category
    category_counts = {}
    for category in recommended_categories:
        category_counts[category] = category_counts.get(category, 0) + 1
    
    # Calculate percentage for each category
    total_recommendations = len(recommended_categories)
    category_percentages = {category: count / total_recommendations * 100 for category, count in category_counts.items()}

    # Sort categories by occurrence percentage
    sorted_categories = sorted(category_percentages.items(), key=lambda x: x[1], reverse=True)

    return jsonify({'recommended_categories': sorted_categories})

    # Generate sentences describing the most frequent spending categories
    # sentences = []
    # for i, (category, percentage) in enumerate(sorted_categories):
    #     if i == 0:
    #         sentence = f'You most frequently spend is in the {category} category, approx {percentage:.2f}% of the top categories.'
    #     else:
    #         sentence = f'Your next most frequent spending category is {category}, approx {percentage:.2f}% of the top categories.'
    #     sentences.append(sentence)

    # return jsonify({'user_id': user_id, 'recommended_categories': sentences})


## Future month prediction
def preprocess_data(user_id):
    today = datetime.now().date()
    two_months_ago = today - timedelta(days=60)
    
    # Query expenses for the last 60 days
    expenses = Expense.query.filter_by(user_id=user_id).filter(Expense.transactionDate >= two_months_ago).all()
    
    # Extract categories and amounts for the last 60 days
    categories = [exp.category for exp in expenses]
    amounts = [float(exp.amount) for exp in expenses]  # Convert to float
    
    # Create a dictionary to store expenses by category
    expenses_by_category = {}
    category_indices = {}  # Dictionary to store category indices
    
    for idx, (category, amount) in enumerate(zip(categories, amounts)):
        if category in expenses_by_category:
            expenses_by_category[category] += amount
        else:
            expenses_by_category[category] = amount
            category_indices[category] = idx
    
    # Convert expenses by category to a numpy array
    X = np.array(list(expenses_by_category.values()))
    
    return X, category_indices

def forecast_future_expenses(sarima_model, steps=30):
    # Forecast future values using SARIMA model
    forecast = sarima_model.forecast(steps=steps)
    return forecast

def train_sarima_model(X):
    # Convert input data to pandas Series
    X_series = pd.Series(X)
    
    if not np.issubdtype(X_series.dtype, np.number):
        raise ValueError("Input data must contain numeric values only.")

    if X_series.isnull().values.any():
        raise ValueError("Input data contains missing or NaN values.")
    
    # Convert data to a compatible dtype (float)
    X_series = X_series.astype(float)
    
    order = (1, 1, 1)  # ARIMA order
    seasonal_order = (1, 0, 1, 12)  # Seasonal order
    
    # Initialize SARIMA model
    model = SARIMAX(X_series, order=order, seasonal_order=seasonal_order, enforce_stationarity=True)
    
    sarima_result = model.fit()
    
    accuracy = sarima_result.aic  #  BIC
    
    return sarima_result, accuracy

@predictions_bp.route('/predict/future_expenses', methods=['GET'])
@verifyToken
def predict_expenses():
    user_id = request.user.get('id')
    if user_id is None:
        return jsonify({'error': 'User ID is required.'}), 400
    
    # Preprocess data to get expenses and category indices
    X, category_indices = preprocess_data(user_id)
    
    if len(X) == 0:  # Insufficient data for prediction
        return jsonify({'message': 'Insufficient data for prediction'})
    
    sarima_model, accuracy = train_sarima_model(X)
    
    future_expenses = forecast_future_expenses(sarima_model, steps=30)
    
    # Map category indices to category names
    category_names = {index: category for category, index in category_indices.items()}
    
    categories = list(sarima_model.data.row_labels)

    result = {
        'predictions': [{'name': category_names.get(category, 'Unknown'),'color': category_colors.get(category_names.get(category, 'Unknown'), "#CCCCCC"), 'value': float(amount)} for category, amount in zip(categories, future_expenses)],
        'accuracy': accuracy
    }

    return jsonify(result)