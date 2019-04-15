import logging
import time
import numpy as np
import cv2
import zmq
from PIL import Image
from http.server import BaseHTTPRequestHandler, HTTPServer
from http.cookies import SimpleCookie
from socketserver import ThreadingMixIn
from io import BytesIO
from django.conf import settings
from importlib import import_module
from mjpeg.decorators import auth_django_user_required

session_engine = import_module(settings.SESSION_ENGINE)
from django.contrib.auth.models import User

from proto import common_pb2
import proto.detectionresult_pb2 as detectionresult
__author__ = 'iurii.chiryshev'

logger = logging.getLogger(__name__)



class CamHandler(BaseHTTPRequestHandler):

    @auth_django_user_required
    def do_GET(self):
        origin = self.headers.get('Origin')
        self.send_response(200)
        self.send_header('Content-type', 'multipart/x-mixed-replace; boundary=--jpgboundary')
        # self.send_header('Access-Control-Allow-Origin',"*")
        # self.send_header('Access-Control-Allow-Credentials', 'true')
        self.end_headers()

        connect_to = 'tcp://localhost:5570'
        ctx = zmq.Context.instance()
        s = ctx.socket(zmq.SUB)
        s.setsockopt(zmq.CONFLATE,1)
        #s.setsockopt(zmq.RCVHWM,5)
        s.setsockopt_string(zmq.SUBSCRIBE,"")
        s.setsockopt(zmq.RCVTIMEO, 3000)
        s.connect(connect_to)
        while True:
            try:
                msg = s.recv()
                if not msg:
                    pass
                    #print("not message")
                else:
                    dr = detectionresult.DetectionResult()
                    dr.ParseFromString(msg)
                    if dr.HasField("mat"):
                        img = np.fromstring(dr.mat.data, np.uint8).reshape( dr.mat.rows, dr.mat.cols, dr.mat.channels )
                        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                        jpg = Image.fromarray(imgRGB)
                        tmpFile = BytesIO()
                        jpg.save(tmpFile, 'JPEG')
                        tmp_len = str(len(tmpFile.getbuffer()))
                        #print(tmp_len)
                        self.wfile.write("--jpgboundary\r\n".encode())
                        self.send_header('Content-type', 'image/jpeg')
                        self.send_header('Content-length', tmp_len)
                        self.end_headers()
                        #jpg.save(self.wfile, 'JPEG')
                        self.wfile.write( tmpFile.getvalue() )
                        self.wfile.write("\r\n".encode())
                time.sleep(0.5)
            except Exception as e:
                #print("Error msg: ",e)
                break
        #cap.release()
        s.disconnect(connect_to)
        return


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""


def main():
    """
    Запуск mjpeg сервера
    :return:
    """
    ctx = None
    server = None
    try:
        ctx = zmq.Context()
        server = ThreadedHTTPServer((settings.MJPEG_HOST, settings.MJPEG_PORT), CamHandler)
        logger.debug('mjpeg server started at %s:%s',settings.MJPEG_HOST,settings.MJPEG_PORT)
        server.serve_forever()
    except Exception as e:
        logger.error('%s',str(e))
        if ctx is not None:
            ctx.term()
        if server is not None:
            server.server_close()
