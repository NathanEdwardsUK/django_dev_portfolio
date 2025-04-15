import datetime

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.shortcuts import reverse

from .models import ToDoItem


def loginSetup(test_case):
    User = get_user_model()

    test_case.user1 = User.objects.create_user(
        username="admin",
        password="testpassword"
    )
    test_case.user2 = User.objects.create_user(
        username="guest",
        password="guestpassword"
    )

    test_case.client.force_login(test_case.user1)

    test_case.todo_item1 = ToDoItem.objects.create(
        user=test_case.user1,
        title="Test Title",
        description="Test Description",
        created_date=datetime.date.today(),
        completed_date=None
    )
    test_case.todo_item2 = ToDoItem.objects.create(
        user=test_case.user2,
        title="Test Title 2",
        description="Test Description 2",
        created_date=datetime.date.today(),
        completed_date=datetime.date.today()
    )


class ToDoListPageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/todo/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(reverse("todo_list"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "todo/list.html")

    def test_todo_item_visible(self):
        response = self.client.get(reverse("todo_list"))
        self.assertContains(response, "<p>Test Title</p>")
        self.assertContains(response, "todo-item-container", 2)

    def test_completed_todo_item_is_struckthrough(self):
        response = self.client.get(reverse("todo_list"))
        self.assertContains(response, "<del>Test Title 2</del>")


class ToDoCreatePageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/todo/create/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(reverse("todo_create"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "todo/create.html")

    def test_creating_item(self):
        new_id = ToDoItem.objects.latest("id").id + 1
        response = self.client.post(
            reverse("todo_create"),
            {
                "title": "Created Title",
                "description": "Created Description",
                "completed_date": str(datetime.date.today())
            }
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, reverse("todo_detail", args=[new_id]))

        todo_item = ToDoItem.objects.get(pk=new_id)
        self.assertEqual(todo_item.title, "Created Title")
        self.assertEqual(todo_item.description, "Created Description")
        self.assertEqual(todo_item.completed_date, datetime.date.today())


class ToDoUpdatePageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/todo/1/update/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(
            reverse("todo_update", args=[self.todo_item1.id])
        )
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "todo/update.html")

    def test_updating_item(self):
        url = reverse("todo_update", args=[self.todo_item1.id])
        response = self.client.post(
            url,
            {
                "title": "New Title",
                "description": "New Description",
                "completed_date": str(datetime.date.today())
            }
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response.url,
            reverse("todo_detail", args=[self.todo_item1.id])
        )
        todo_item = ToDoItem.objects.get(pk=self.todo_item1.id)
        self.assertEqual(todo_item.title, "New Title")
        self.assertEqual(todo_item.description, "New Description")
        self.assertEqual(todo_item.completed_date, datetime.date.today())


class ToDoUpdatePageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/todo/1/update/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(
            reverse("todo_update", args=[self.todo_item1.id])
        )
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "todo/update.html")

    def test_updating_item(self):
        url = reverse("todo_update", args=[self.todo_item1.id])
        response = self.client.post(
            url,
            {
                "title": "New Title",
                "description": "New Description",
                "completed_date": str(datetime.date.today())
            }
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response.url,
            reverse("todo_detail", args=[self.todo_item1.id])
        )
        todo_item = ToDoItem.objects.get(pk=self.todo_item1.id)
        self.assertEqual(todo_item.title, "New Title")
        self.assertEqual(todo_item.description, "New Description")
        self.assertEqual(todo_item.completed_date, datetime.date.today())


class ToDoDeletePageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/todo/1/delete/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(
            reverse("todo_delete", args=[self.todo_item1.id])
        )
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "todo/delete.html")

    def test_deleting_item(self):
        url = reverse("todo_delete", args=[self.todo_item1.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, reverse("todo_list"))

        # assert object does not exist when calling object.get(pk=id)
        kwargs = {"pk": self.todo_item1.id}
        self.assertRaises(
            ToDoItem.DoesNotExist,
            ToDoItem.objects.get,
            **kwargs
        )
