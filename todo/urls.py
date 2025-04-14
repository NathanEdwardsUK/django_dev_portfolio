from django.urls import path
from .views import (
    ToDoListView,
    ToDoDetailView,
    ToDoCreateView,
    ToDoUpdateView,
    ToDoDeleteView,
)


urlpatterns = [
    path("", ToDoListView.as_view(), name="todo_list"),
    path("create/", ToDoCreateView.as_view(), name="todo_create"),
    path("<int:pk>/delete/", ToDoDeleteView.as_view(), name="todo_delete"),
    path("<int:pk>/detail/", ToDoDetailView.as_view(), name="todo_detail"),
    path("<int:pk>/update/", ToDoUpdateView.as_view(), name="todo_update"),
]
