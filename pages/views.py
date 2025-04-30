from django.shortcuts import render


def home_view(request):
    return render(request, "pages/home.html")


def professional_view(request):
    return render(request, "pages/professional.html")


def prime_photo_view(request):
    return render(request, "pages/prime_photo.html")