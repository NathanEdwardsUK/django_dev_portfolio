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
    path("professional/", ProfessionalView, name="professional"),
    path("pineapple/", PineapplePokerView, name="pineapple_poker"),
    path("prime/", PrimePhotoView, name="prime_photo"),
    path("climbing/", ClimbingView, name="climbing"),
]
