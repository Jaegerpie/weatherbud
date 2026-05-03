from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "64393a7f8b0984e9037ad671ebbfbb3a"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get-weather")
def get_weather():
    city = request.args.get("city")
    
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    
    response = requests.get(url)
    data = response.json()
    
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)