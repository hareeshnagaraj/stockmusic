# SimpleIntradayTickExample.py

import blpapi
import datetime
import copy
from optparse import OptionParser, Option, OptionValueError

def checkDateTime(option, opt, value):
    try:
        return datetime.datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    except ValueError as ex:
        raise OptionValueError(
            "option {0}: invalid datetime value: {1} ({2})".format(
                opt, value, ex))


class ExampleOption(Option):
    TYPES = Option.TYPES + ("datetime",)
    TYPE_CHECKER = copy.copy(Option.TYPE_CHECKER)
    TYPE_CHECKER["datetime"] = checkDateTime


def parseCmdLine(args):
    parser = OptionParser(description="Retrieve intraday rawticks.",
                          epilog="Notes: " +
                          "1) All times are in GMT. " +
                          "2) Only one security can be specified.",
                          option_class=ExampleOption)
    parser.add_option("-a",
                      "--ip",
                      dest="host",
                      help="server name or IP (default: %default)",
                      metavar="ipAddress",
                      default="localhost")
    parser.add_option("-p",
                      dest="port",
                      type="int",
                      help="server port (default: %default)",
                      metavar="tcpPort",
                      default=8194)
    parser.add_option("-s",
                      dest="security",
                      help="security (default: %default)",
                      metavar="security",
                      default="IBM")
    parser.add_option("-e",
                      dest="events",
                      help="events (default: TRADE)",
                      metavar="event",
                      action="append",
                      default=[])
    parser.add_option("--sd",
                      dest="startDateTime",
                      type="datetime",
                      help="start date/time (default: %default)",
                      metavar="startDateTime",
                      default=datetime.datetime(2008, 8, 11, 15, 30, 0))
    parser.add_option("--ed",
                      dest="endDateTime",
                      type="datetime",
                      help="end date/time (default: %default)",
                      metavar="endDateTime",
                      default=datetime.datetime(2008, 8, 11, 15, 35, 0))
    parser.add_option("--cc",
                      dest="conditionCodes",
                      help="include condition codes",
                      action="store_true",
                      default=False)

    (options, args) = parser.parse_args(args)

    if not options.events:
        options.events = ["TRADE"]

    return options


def getPreviousTradingDate():
    tradedOn = datetime.date.today()

    while True:
        try:
            tradedOn -= datetime.timedelta(days=1)
        except OverflowError:
            return None

        if tradedOn.weekday() not in [5, 6]:
            return tradedOn


def main(args=None):
    global options
    options = parseCmdLine(args)

    # Fill SessionOptions
    sessionOptions = blpapi.SessionOptions()
    sessionOptions.setServerHost(options.host)
    sessionOptions.setServerPort(options.port)

    print "Connecting to %s:%d" % (options.host, options.port)

    # Create a Session
    session = blpapi.Session(sessionOptions)

    # Start a Session
    if not session.start():
        print "Failed to start session."
        return

    if not session.openService("//blp/refdata"):
        print "Failed to open //blp/refdata"
        return

    # refDataService = session.getService("//blp/refdata")
    # request = refDataService.createRequest("IntradayTickRequest")
    # request.set("security", "VOD LN Equity")
    # request.getElement("eventTypes").appendValue("TRADE")
    # # request.getElement("eventTypes").appendValue("AT_TRADE")
    # request.set("includeConditionCodes", True)
    refDataService = session.getService("//blp/refdata")
    request = refDataService.createRequest("IntradayBarRequest")
    request.set("security", "%s US Equity" % options.security)
    request.set("eventType", "TRADE")
    request.set("interval", 60)  # bar interval in minutes

    tradedOn = getPreviousTradingDate()
    if not tradedOn:
        print "unable to get previous trading date"
        return

    startTime = datetime.datetime.combine(tradedOn, datetime.time(13, 30))
    request.set("startDateTime", startTime)

    endTime = datetime.datetime.combine(tradedOn, datetime.time(21, 30))
    request.set("endDateTime", endTime)

    print "Sending Request:", request
    session.sendRequest(request)

    results = []
    try:
        # Process received events
        while(True):
            # We provide timeout to give the chance to Ctrl+C handling:
            ev = session.nextEvent(500)
            for msg in ev:
                print msg
                results.append(msg)
            # Response completly received, so we could exit
            if ev.eventType() == blpapi.Event.RESPONSE:
                break
    finally:
        # Stop the session
        session.stop()

    print results[3]

if __name__ == "__main__":
    print "SimpleIntradayTickExample"
    try:
        main()
    except KeyboardInterrupt:
        print "Ctrl+C pressed. Stopping..."

__copyright__ = """
Copyright 2012. Bloomberg Finance L.P.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:  The above
copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
"""
