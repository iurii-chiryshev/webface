from django.http import JsonResponse

__author__ = 'iurii.chiryshev'


def prepare_content(data):
    """

    :param data: словарь
    :return:
    """
    content = {'text': JsonResponse(data).content.decode('utf-8')}
    print(content)
    return content