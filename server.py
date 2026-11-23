import os
import sys
import webbrowser
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
SITE_DIR = os.path.dirname(os.path.abspath(__file__))

class FrontHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SITE_DIR, **kwargs)

    def do_GET(self):
        if self.path.startswith('/api/open-front'):
            try:
                # Open both Evolution Manager and TRD QR Code connection screen
                webbrowser.open('http://localhost:3000')
                webbrowser.open('http://localhost:8080/qrcode.html')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'ok', 'opened': True}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
            return
        
        return super().do_GET()

if __name__ == '__main__':
    server_address = ('0.0.0.0', PORT)
    httpd = HTTPServer(server_address, FrontHandler)
    print(f"TRD Preview & Open-Front server running at http://0.0.0.0:{PORT}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
