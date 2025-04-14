from django.shortcuts import render, redirect
from django.urls import reverse
from django.conf import settings
from django.core.mail import send_mail

from .forms import ContactForm


def contract_view(request):
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

            # send_mail(
            #     subject="Contact submission from portfolio website",
            #     message=full_message,
            #     from_email=settings.DEFAULT_FROM_EMAIL,
            #     recipient_list=settings.NOTIFY_EMAIL_LIST
            # )

            # Unfortunately I can only send emails to my own account with mailguns
            # free account tier. If ever upgraded to a higher tier I can include
            # the below code

            # notify_sender_message = f"""
            # Dear {name},

            # Thank you for your message.
            # This is an automated notification that I have recieved it.
            # If a response is appropriate I hope to get back to you soon.

            # Kind Regards,
            # Nathan

            # Your message:
            # ________________________
            # subject: {subject}
            # message: {body}
            # """

            # send_mail(
            #     subject="Confirmation of contact submission",
            #     message=notify_sender_message,
            #     from_email=settings.DEFAULT_FROM_EMAIL,
            #     recipient_list=[email]
            # )
            return render(request, "contact/success.html")
        else:
            return render(request, "contact/error.html")

    else:
        return render(request, "contact/contact.html", {"form": ContactForm})
