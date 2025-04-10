from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def HomeView(request):
    return render(request, "pages/home.html")


@login_required
def ProfessionalView(request):
    return render(request, "pages/professional.html")


@login_required
def PrimePhotoView(request):
    return render(request, "pages/prime_photo.html")


@login_required
def PineapplePokerView(request):
    return render(request, "pages/pineapple.html")


@login_required
def ClimbingView(request):
    return render(request, "pages/climbing.html")
