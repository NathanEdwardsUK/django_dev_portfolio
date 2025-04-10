from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.core.mail import send_mail

from .forms import ContactForm


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


@login_required
def ContactView(request, submission_message=""):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            form_data = form.cleaned_data
            name = form_data['name']
            email = form_data['email']
            subject = form_data['subject']
            body = form_data['body']

            full_message = f"""
            Contact submission from portfolio website
            name: {name}
            subject: {subject}
            email: {email}
            ________________________


            {body}
            """

            send_mail(
                subject="Contact submission from portfolio website",
                message=full_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=settings.NOTIFY_EMAIL_LIST
            )

            notify_sender_message = f"""
            Dear {name},

            Thank you for your message.
            This is an automated notification that I have recieved it.
            If a response is appropriate I hope to get back to you soon.

            Kind Regards,
            Nathan

            Your message:
            ________________________
            {full_message}
            """

            send_mail(
                subject="Confirmation of contact submission",
                message=notify_sender_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email]
            )

            submission_message = "Contact from successfully submitted"

        else:
            submission_message = "Error submitting contact form"

    context = {
        "form": ContactForm,
        "submission_message": submission_message
    }
    return render(request, "pages/contact.html", context)
