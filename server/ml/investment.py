import pandas as pd

class User:
    def __init__(self, name, riskTolerance, investHorizon):
        self.name = name
        self.riskTolerance = riskTolerance
        self.investHorizon = investHorizon

class RecommendationSystem:
    def __init__(self, user, data):
        self.user = user
        self.data = data

    def get_recommendation(self):
        filtered_assets = self.data[self.data["Close"].notna()]
        returns = filtered_assets["Close"].pct_change()
        filtered_assets = pd.DataFrame(returns[returns <= self.user.riskTolerance])
        sorted_assets = filtered_assets.sort_values(by="Close", ascending=False)
        top_assets = sorted_assets.head(self.user.investHorizon)
        return top_assets.index.tolist()

def investment(name, riskTolerance, investHorizon, data):
    user = User(name, riskTolerance, investHorizon)
    recommendation_system = RecommendationSystem(user, data)
    recommendation = recommendation_system.get_recommendation()
    return recommendation

