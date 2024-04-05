import pickle
from flask import request, jsonify, Blueprint
import pandas as pd
from middleware.verifyToken import verifyToken

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
