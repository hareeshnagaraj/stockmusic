# -*- coding: utf-8 -*-

# app.py
# created by: Ryan Beatty and Hareesh Nagaraj
#
# main flask app for stockmusic web app.
# Stockmusic queries the various stock
# aggregating API's and converts that data 
# into an arrangement of musical notes which
# produce MIDI sounds.

from flask import Flask
from flask import render_template
import requests
import sys

app = Flask(__name__)


try:

    # Attempt to read quandl api token
    # or exit if file not found
    with open('token.txt', 'r') as f:
        TOKEN = f.read().strip()
        QUERY_STRING = "https://www.quandl.com/api/v1/datasets/WIKI/{ticker}.json?" \
                       "sort_order=asc&trim_start={start_date}&trim_end={end_date}?" \
                       "auth_token=%(token)s" % {'token': TOKEN}
except IOError as e:
    print "error: file 'token.txt' not found"
    sys.exit(1)

@app.route("/")
def home():
    return "Hello World"

# query quandl api for stock market data and return results as json
@app.route("/query")
def get_data():
    resp = requests.get(build_query_string(flask.request.args))
    resp.raise_for_status()
    return flask.jsonify(resp.json()), 200

# generate string used to query quandl api
def build_query_string(args):
    return QUERY_STRING.format(ticker=args.get('ticker', ''),
                               start_date=args.get('start_date', ''),
                               end_date=args.get('end_date', ''))

@app.route("/basic")
def test():
  return render_template('basic.html')

if __name__ == '__main__':
    app.debug = True
    app.run()
