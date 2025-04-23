from django import forms


class ContactForm(forms.Form):
    name = forms.CharField(min_length=1, max_length=50)
    email = forms.EmailField()
    body = forms.CharField(min_length=1)
