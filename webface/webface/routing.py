from channels import route
from core.consumers import ws_connect, ws_receive, ws_disconnect

__author__ = 'iurii.chiryshev'



# маршрутизация для websocket каналов, по типу URL маршрутизации
channel_routing = [
    # Called when WebSockets connect
    route("websocket.connect", ws_connect),
    # Called when WebSockets get sent a data frame
    route("websocket.receive", ws_receive),
    # Called when WebSockets disconnect
    route("websocket.disconnect", ws_disconnect),
]
