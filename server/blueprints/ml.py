from flask import request
import yfinance as yf
from app import app
from server.blueprints.predictions.predictions import investment

def download_data(ticker, start_date, end_date):
    asset = yf.Ticker(ticker)
    data = asset.history(start=start_date, end=end_date)
    return data

@app.route("/invest", methods=['POST'])
def investRecommender():
    req=request.json
    data = download_data(req['ticker'], req['startDate'], req['endDate'])
    res = investment(req['name'], req['riskTolerance'], req['investHorizon'], data)
    return res

@app.route("/lineplot", methods=['POST'])
def getLinePlot():
    req=request.json
    data = download_data(req['ticker'], req['startDate'], req['endDate'])
    details={
        "xvalues": list(data.index),
        "yvalues": list(data["Close"]),
        "xlabel": "Date"
    }
    return details