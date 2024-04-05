import pickle
from flask import request, jsonify, Blueprint
import pandas as pd
from middleware.verifyToken import verifyToken
from model import User, Expense, db
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from error import create_error

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

# Function to recommend categories based on user's spending habits
def recommend_categories(user_id, user_expenses, cosine_sim, categories_mapping):
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(user_expenses)
    sim_scores = linear_kernel(tfidf_matrix, tfidf_matrix)
    sim_scores = list(enumerate(sim_scores[user_id]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]  # Exclude the user's own expense
    category_indices = [i[0] for i in sim_scores]
    print(category_indices)
    print(categories_mapping)
    recommended_categories = [categories_mapping[idx] for idx in category_indices]
    return recommended_categories

# API endpoint to get budget recommendations for a user
@predictions_bp.route('/budget_recommendations', methods=['GET'])
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
    recommended_categories = recommend_categories(user_id, user_expenses, cosine_sim, categories_mapping)
    
    # Count occurrences of each category
    category_counts = {}
    for category in recommended_categories:
        category_counts[category] = category_counts.get(category, 0) + 1
    
    # Calculate percentage for each category
    total_recommendations = len(recommended_categories)
    category_percentages = {category: count / total_recommendations * 100 for category, count in category_counts.items()}

    # Sort categories by occurrence percentage
    sorted_categories = sorted(category_percentages.items(), key=lambda x: x[1], reverse=True)

    # Generate sentences describing the most frequent spending categories
    sentences = []
    for i, (category, percentage) in enumerate(sorted_categories):
        if i == 0:
            sentence = f'You most frequently spend in the {categories_mapping[category]} category, approx {percentage:.2f}% of the top categories.'
        else:
            sentence = f'Your next most frequent spending category is {categories_mapping[category]}, approx {percentage:.2f}% of the top categories.'
        sentences.append(sentence)

    return jsonify({'user_id': user_id, 'recommended_categories': sentences})