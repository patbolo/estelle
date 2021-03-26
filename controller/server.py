#Python 3

from http.server import BaseHTTPRequestHandler, HTTPServer
from cgi import parse_header, parse_multipart
from urllib.parse import parse_qs
from nexstar2 import NexstarHandController, NexstarCoordinateMode;
coord = NexstarCoordinateMode

n = NexstarHandController('/dev/ttyUSB0')

# HTTPRequestHandler class
class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):

  def _set_response(self):
    self.send_response(200)
    self.send_header('Content-type', 'text/html')
    self.end_headers()
 
  # GET
  def do_GET(self):
    # Send response status code
    self._set_response()
    print('Getting position')
    # Send message back to client
    message = n.getPosition(coord.RA_DEC)
    print(message)
    #print(str(message[0].encode("utf8")))
    # Write content as utf-8 data
    self.wfile.write(b'['+bytes(','.join(map(str, message)), 'utf-8')+b']')
    return

  # GET
  def do_POST(self):
    ctype, pdict = parse_header(self.headers['content-type'])
    pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
    if ctype == 'multipart/form-data':
        # print(self.rfile)
        # print(pdict)
        postvars = parse_multipart(self.rfile, pdict)
    elif ctype == 'application/x-www-form-urlencoded':
        length = int(self.headers['content-length'])
        postvars = parse_qs(
                self.rfile.read(length), 
                keep_blank_values=1)
    else:
        postvars = {}
    # print(postvars)
    ra = float(postvars['ra'][0])
    dec = float(postvars['dec'][0])
    # print(ra)
    # print(dec)
    n.gotoPosition(ra, dec, coord.RA_DEC)
    message = n.getPosition()
    self._set_response()
    self.wfile.write(b'['+bytes(','.join(map(str, message)), 'utf-8')+b']')
    print(message)
    return
 
def run():
  print('starting server...')
 
  # Server settings
  # Choose port 8080, for port 80, which is normally used for a http server, you need root access
  #server_address = ('192.168.20.100', 8889)
  server_address = ('10.8.0.6', 8889)
  httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
  print('running server...')
  httpd.serve_forever()
 
 
run()
