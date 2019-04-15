from mjpeg import server

__author__ = 'iurii.chiryshev'
from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    def handle(self, *args, **options):
        server.main()