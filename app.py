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
import flask
import requests
import sys
from flask import render_template
import getprices
import json
import datetime

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


"""
Sublclasses JSONEncoder in order to implement 
date json serialization
"""
class DateTimeEncoder(json.JSONEncoder):

  def default(self, obj):
    """
    returns serialized string representation of obj
    """
    # if obj is a date object, return the isoformat string
    if isinstance(obj, datetime.date):
      return obj.isoformat()

    # else call regular JSONEncoder method to serialize obj
    return json.JSONEncoder.default(self, obj)


@app.route("/")
def home():
    return render_template('basic.html')

# query quandl api for stock market data and return results as json
@app.route("/query")
def get_data():
    # resp = requests.get(build_query_string(flask.request.args))
    # resp.raise_for_status()

    data = getprices.get_prices(['--ip', '10.8.8.1',
                                 '-s', flask.request.args.get('ticker', '')])

    return flask.Response(json.dumps(data, cls=DateTimeEncoder), mimetype="application/json")


@app.route("/test")
def get_data2():
    return "hey"
@app.route("/index")
def index():
    return render_template('index.html');

# generate string used to query quandl api
def build_query_string(args):
    return QUERY_STRING.format(ticker=args.get('ticker', ''),
                               start_date=args.get('start_date', ''),
                               end_date=args.get('end_date', ''))

@app.route("/test")
def test():
  import SimpleIntradayTickExample as ex

  ex.main(["--ip", "10.8.8.1", "-s", flask.request.args.get("ticker", "")])
  return "hello"


if __name__ == '__main__':
    app.debug = True
    app.run()
