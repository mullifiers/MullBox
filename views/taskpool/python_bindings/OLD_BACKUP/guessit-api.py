from guessit import guessit
import sys
from socketIO_client import SocketIO, LoggingNamespace


# def message(a,b):
    # print('hdllo')
# with SocketIO('localhost', 8070, LoggingNamespace) as socketIO:
# socketIO= SocketIO('localhost', 8070, message)
# socketIO.on('guessit',message)
    # socketIO.emit('guessedit', 'hello')
for l in sys.stdin:
    print "adadf" 











# import socketio
# import eventlet
# from flask import Flask, render_template
# import logging as log
# import random
# import socket
# import sys


# def find_free_port():
#     s = socket.socket()
#     s.bind(('', 0)) 
#     u=s.getsockname()[1] 
#     s.close()           # Bind to a free port provided by the host.
#     return u

# def write_to_file( hello ):
#     portf=open('config/guessit-api.port','w+')
#     portf.truncate()
#     portf.write(str(hello))
#     portf.flush()
#     return

# sio = socketio.Server()
# app = Flask(__name__)

# @app.route('/')
# def index():
#     """Serve the client-side application."""

#     return 'hello'
# @sio.on('ready')
# def dconnect(sid):
#     print('yeah! its listening')
# @sio.on('connect')
# def connect(sid, environ):
#     print('connect ', sid)
    
#     log.debug(eventlet.getcurrent()) 
# @sio.on('my message')
# def message(sid, data):
#     print('message ', data)

# @sio.on('guessit')
# def message(sid, data):
#     sio.emit('guessedit', guessit(data))

# @sio.on('disconnect')
# def disconnect(sid):
#     print('disconnect ', sid)
# if __name__ == '__main__':
#     # wrap Flask application with socketio's middleware
#     app = socketio.Middleware(sio, app)
#     port=find_free_port()
#     write_to_file(port)
#     eventlet.wsgi.server(eventlet.listen(('localhost',port)), app)
#     sys.stdout.flush()
#    # portf.write(port)



