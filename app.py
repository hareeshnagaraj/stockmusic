from flask import Flask
from flask import render_template

import requests

app = Flask(__name__)

@app.route("/")
def get_data():
	return "Hello World"

@app.route("/basic")
def test():
  return render_template('basic.html')

if __name__ == '__main__':
  app.debug = True
  app.run()