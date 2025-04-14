from django.urls import path
from .views import (
    contract_view,
)


urlpatterns = [
    path("", contract_view, name="contact"),
]
