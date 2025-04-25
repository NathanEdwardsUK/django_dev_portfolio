from django.shortcuts import render
from django.contrib.auth.decorators import login_not_required


@login_not_required
def sandbox_view(request):
    return render(request, "game_of_life/sandbox.html")
    
