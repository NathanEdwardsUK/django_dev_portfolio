from django.urls import path
from .views import (
    ClimbingView,
    HomeView,
    PineapplePokerView,
    PrimePhotoView,
    ProfessionalView,
)


urlpatterns = [
    path("", HomeView, name="home"),
    path("climbing/", ClimbingView, name="climbing"),
    path("pineapple/", PineapplePokerView, name="pineapple_poker"),
    path("prime/", PrimePhotoView, name="prime_photo"),
    path("professional/", ProfessionalView, name="professional"),
]
