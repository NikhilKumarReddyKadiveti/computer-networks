from http.server import BaseHTTPRequestHandler, HTTPServer
import socket
import threading

HOST = "127.0.0.1"
PORT = 8080

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = (
            "Small Enterprise Network Demo\n"
            "HTTP application-layer service is running.\n"
        ).encode()

        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass

def main():
    server = HTTPServer((HOST, PORT), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    print(f"HTTP server: http://{HOST}:{PORT}")
    print("DNS resolution demonstration:")
    print("localhost ->", socket.gethostbyname("localhost"))
    input("Press Enter to stop...")
    server.shutdown()

if __name__ == "__main__":
    main()
