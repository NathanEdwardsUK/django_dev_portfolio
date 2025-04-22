from django.urls import path
from .views import (
    sandbox_view,
)


urlpatterns = [
    path("sandbox/", sandbox_view, name="sandbox"),
]
