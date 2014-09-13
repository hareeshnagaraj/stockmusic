from flask import Flask
import requests

app = Flask(__name__)

@app.route("/")
def get_data():
	return "Hello World"

if __name__ == '__main__':
	app.run()