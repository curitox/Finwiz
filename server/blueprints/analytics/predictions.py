import pickle
from flask import request, jsonify, Blueprint
import pandas as pd
import numpy as np
from app import app

predictions_bp=Blueprint("predictions", __name__, template_folder="predictions")
model = pickle.load(open('investment_model.pkl', 'rb'))

potential_return_mapping = {"Low": 1, "Average": 2, "High": 3}
type_mapping = {"Financial": 1, "Property": 2, "Commodity": 3, "Entrepreneurship": 4, "Hobby": 5, "Personal": 6}

@predictions_bp.route('/predict/invest', methods=['POST'])
def invest_predict():
    input_data = request.json
    potential_return_value = potential_return_mapping.get(input_data['Potential Return'], 2)  
    type_value = type_mapping.get(input_data['Type'], 1)
    input_data_array = np.array([[input_data['Minimum Investment'], input_data['Risk'], input_data['Best_Investment'], input_data['Liquidity'], type_value, potential_return_value]])
    prediction = model.predict(input_data_array)
    return jsonify(prediction.tolist())
