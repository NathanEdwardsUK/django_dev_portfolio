from django.shortcuts import render
from django.contrib.auth.decorators import login_not_required


@login_not_required
def home_view(request):
    return render(request, "pages/home.html")


@login_not_required
def about_view(request):
    return render(request, "pages/about.html")


def professional_view(request):
    return render(request, "pages/professional.html")


def prime_photo_view(request):
    return render(request, "pages/prime_photo.html")