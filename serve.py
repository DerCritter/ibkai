#!/usr/bin/env python3
"""Servidor local con soporte de Range (necesario para poder adelantar vídeos).
Uso: python3 serve.py [puerto]   (por defecto 5180)"""
import os, re, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self._range = None
        rng = self.headers.get('Range')
        path = self.translate_path(self.path)
        if not rng or os.path.isdir(path) or not os.path.isfile(path):
            return super().send_head()
        m = re.match(r'bytes=(\d*)-(\d*)$', rng.strip())
        size = os.path.getsize(path)
        if not m or (not m.group(1) and not m.group(2)):
            return super().send_head()
        if m.group(1):
            start = int(m.group(1)); end = int(m.group(2)) if m.group(2) else size - 1
        else:
            start = max(0, size - int(m.group(2))); end = size - 1
        end = min(end, size - 1)
        if start > end:
            self.send_response(416); self.send_header('Content-Range', f'bytes */{size}'); self.end_headers()
            return None
        f = open(path, 'rb'); f.seek(start)
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length', str(end - start + 1))
        self.end_headers()
        self._range = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        if self._range is None:
            return super().copyfile(source, outputfile)
        left = self._range
        while left > 0:
            chunk = source.read(min(65536, left))
            if not chunk: break
            outputfile.write(chunk); left -= len(chunk)

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f'http://localhost:{port}')
    ThreadingHTTPServer(('', port), RangeHandler).serve_forever()
