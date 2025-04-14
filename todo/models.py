from django.contrib.auth.models import User

from django.db import models
from django.shortcuts import reverse


class ToDoItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=60, unique=True)
    description = models.TextField()
    created_date = models.DateField(auto_now_add=True)
    completed_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.pk}: {self.title} ({self.user})"

    def get_absolute_url(self):
        return reverse("todo_detail", kwargs={"pk": self.pk})
