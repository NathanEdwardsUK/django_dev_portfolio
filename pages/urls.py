from django.urls import path
from .views import (
    home_view,
    prime_photo_view,
    professional_view,
)


urlpatterns = [
    path("", home_view, name="home"),
    path("prime/", prime_photo_view, name="prime_photo"),
    path("professional/", professional_view, name="professional"),
]
