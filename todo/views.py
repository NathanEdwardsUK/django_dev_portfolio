from django.shortcuts import render
from django.urls import reverse_lazy
from django.contrib.auth.mixins import UserPassesTestMixin
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView


from .models import ToDoItem
from .forms import ToDoItemForm


class ToDoListView(ListView):
    model = ToDoItem
    template_name = "todo/list.html"


class ToDoDetailView(DetailView):
    model = ToDoItem
    template_name = "todo/detail.html"


class ToDoCreateView(CreateView):
    model = ToDoItem
    form_class = ToDoItemForm
    template_name = "todo/create.html"

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super(ToDoCreateView, self).form_valid(form)


class ToDoUpdateView(UserPassesTestMixin, UpdateView):
    model = ToDoItem
    fields = ["title", "description", "completed_date"]
    template_name = "todo/update.html"

    def test_func(self):
        todo_item = self.get_object()
        return todo_item.user == self.request.user


class ToDoDeleteView(UserPassesTestMixin, DeleteView):
    model = ToDoItem
    template_name = "todo/delete.html"
    success_url = reverse_lazy("todo_list")

    def test_func(self):
        todo_item = self.get_object()
        return todo_item.user == self.request.user
