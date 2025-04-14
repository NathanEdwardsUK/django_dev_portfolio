from django import forms
from .models import ToDoItem


class ToDoItemForm(forms.ModelForm):
    class Meta:
        model = ToDoItem
        fields = [
            "title",
            "description",
            "completed_date",
        ]

        widgets = {
            "completed_date": forms.SelectDateWidget(),
        }
