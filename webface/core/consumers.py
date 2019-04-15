from core.models import Menu

__author__ = 'iurii.chiryshev'


def ws_connect(message):
    """

    :param message:
    """
    Menu.add_listener(message.reply_channel)
    message.reply_channel.send({'accept': True})


def ws_disconnect(message):
    """

    :param message:
    """
    Menu.discard_listener(message.reply_channel)

def ws_receive(message):
    """

    :param message:
    """
    pass