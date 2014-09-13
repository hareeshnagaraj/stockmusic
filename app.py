from flask import Flask
import flask
import requests
import sys

app = Flask(__name__)

try:
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

@app.route("/query")
def get_data():
    resp = requests.get(build_query_string(flask.request.args))
    return flask.jsonify(resp.json()), 200


def build_query_string(args):
    return QUERY_STRING.format(ticker=args.get('ticker', ''),
                               start_date=args.get('start_date', ''),
                               end_date=args.get('end_date', ''))

if __name__ == '__main__':
    app.debug = True
    app.run()