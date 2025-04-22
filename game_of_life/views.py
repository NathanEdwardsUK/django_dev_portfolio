from django.shortcuts import render


def sandbox_view(request):
    return render(request, "game_of_life/sandbox.html")