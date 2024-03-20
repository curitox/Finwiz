import pickle
from flask import request, jsonify, Blueprint
import pandas as pd
import numpy as np
from app import app

predictions_bp=Blueprint("predictions", __name__, template_folder="predictions")
model = pickle.load(open('investment_model.pkl', 'rb'))

@predictions_bp.route('/predict/invest', methods=['POST'])
def invest_predict():
    user_input = request.json
    potential_return_mapping = {"Low": 1, "Average": 2, "High": 3}
    potential_return = potential_return_mapping[user_input["Potential Return"]]

    # Convert "Type" to numerical values
    type_mapping = {"Financial": 1, "Property": 2, "Commodity": 3, "Entrepreneurship": 4, "Hobby": 5, "Personal": 6}
    investment_type = type_mapping[user_input["Type"]]

    # Preprocess user input
    user_input_scaled = np.array([[
        user_input["Best_Investment"],
        user_input["Risk"],
        user_input["Minimum Investment"],
        user_input["Liquidity"],
        investment_type,
        potential_return
    ]])    
    probabilities = model.predict_proba(user_input_scaled)[:, 1]
    top_indices = np.argsort(probabilities)[::-1][:5]

    investment_options = [
        "Stocks", "Real Estate", "Gold", "Cryptocurrency", "Bonds", 
        "Mutual Funds", "Starting a Business", "Education", "Retirement", 
        "Buying a Car", "Collectibles", "Fine Art", "Index Funds", 
        "Peer-to-Peer Lending", "Commodities Futures", "Angel Investing", 
        "Government Bonds", "Rental Properties", "Certificate of Deposit", 
        "Peer-to-Peer Real Estate", "Vintage Cars", "Foreign Exchange Trading", 
        "Crowdfunding", "Venture Capital", "Treasury Bills", "Vacation Rentals", 
        "Wine", "Small Business Stocks", "Livestock", "Personal Development Courses", 
        "Classic Watches", "Savings Accounts", "Peer-to-Peer Investing", 
        "Farmland", "Antique Furniture"
    ]   
    top_investments = [(investment_options[i]) for i in top_indices]

    # Return top investments as JSON response
    return jsonify(top_investments)