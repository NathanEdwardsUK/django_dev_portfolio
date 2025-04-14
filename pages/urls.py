from django.urls import path
from .views import (
    climbing_view,
    home_view,
    pineapple_poker_view,
    prime_photo_view,
    professional_view,
)


urlpatterns = [
    path("", home_view, name="home"),
    path("climbing/", climbing_view, name="climbing"),
    path("pineapple/", pineapple_poker_view, name="pineapple_poker"),
    path("prime/", prime_photo_view, name="prime_photo"),
    path("professional/", professional_view, name="professional"),
]
