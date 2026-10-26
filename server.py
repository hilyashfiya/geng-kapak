import os
import sys
import re
import socket
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler

mimetypes.add_type('video/mp4', '.mp4')

class RangeRequestHandler(SimpleHTTPRequestHandler):
    """
    HTTP Request Handler with full HTTP 206 Partial Content (Range requests) support.
    Essential for iOS Safari and mobile Chrome MP4 video playback.
    """
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        range_header = self.headers.get('Range', None)
        if not range_header:
            return super().send_head()

        m = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if not m:
            return super().send_head()

        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        file_len = os.fstat(f.fileno()).st_size
        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) else file_len - 1

        if start >= file_len:
            self.send_error(416, "Requested Range Not Satisfiable")
            f.close()
            return None

        end = min(end, file_len - 1)
        length = end - start + 1

        mimetypes.add_type('video/mp4', '.mp4')
        content_type = 'video/mp4' if path.lower().endswith('.mp4') else (self.guess_type(path) or 'application/octet-stream')

        self.send_response(206, "Partial Content")
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Range', f'bytes {start}-{end}/{file_len}')
        self.send_header('Content-Length', str(length))
        self.send_header('Last-Modified', self.date_time_string(os.fstat(f.fileno()).st_mtime))
        self.end_headers()

        f.seek(start)
        return RangeFileWrapper(f, length)

class RangeFileWrapper:
    def __init__(self, f, length):
        self.f = f
        self.remaining = length

    def read(self, size=-1):
        if self.remaining <= 0:
            return b""
        if size < 0 or size > self.remaining:
            size = self.remaining
        data = self.f.read(size)
        self.remaining -= len(data)
        return data

    def close(self):
        self.f.close()

def run(port=8080):
    host = '0.0.0.0'
    server_address = (host, port)
    httpd = HTTPServer(server_address, RangeRequestHandler)
    print(f"Serving HTTP with Range (HTTP 206) support on {host}:{port} ...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run(port)
