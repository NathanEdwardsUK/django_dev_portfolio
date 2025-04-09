from django.urls import reverse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .forms import LoginForm


def LoginView(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            form_data = form.cleaned_data
            username = form_data['username']
            password = form_data['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect(reverse("home"))

            else:
                return redirect(reverse("login"))
    else:
        form = LoginForm
        return render(request, "accounts/login.html", context={'form': form})
