from django.urls import path
from .views import (
    ContactView,
)


urlpatterns = [
    path("", ContactView, name="contact"),
]
