from django.test import TestCase, SimpleTestCase, Client
from django.contrib.auth import get_user_model
from django.shortcuts import reverse


class AccountsTests(TestCase):
    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="testpassword",
        )

        self.assertEqual(user.username, "admin")
        self.assertEqual(user.email, "admin@example.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        User = get_user_model()
        user = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="testpassword",
        )

        self.assertEqual(user.username, "admin")
        self.assertEqual(user.email, "admin@example.com")
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)


class LoginPageTests(TestCase):
    def test_url_exists_at_correct_location(self):
        response = self.client.get("/accounts/login/")
        self.assertEqual(response.status_code, 200)

    def test_login_view_name(self):
        response = self.client.get(reverse("login"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/login.html")

    # def test_logged_out_redirect(self):
    #     response = self.client.get(reverse("home"))
    #     self.assertEqual(response.status_code, 302)
    #     self.assertEqual(response.url, "/accounts/login/?next=/")

    #     response2 = self.client.get(response.url)
    #     self.assertEqual(response2.status_code, 200)
    #     self.assertTemplateUsed(response2, "accounts/login.html")

    def test_login_works(self):
        response = self.client.post(reverse("login"),
                                    {"username": "admin",
                                     "password": "testpassword"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, reverse("login"))

        User = get_user_model()
        user = User.objects.create_user(
            username="admin",
            password="testpassword",
        )

        response = self.client.post(reverse("login"),
                                    {"username": "admin",
                                     "password": "testpassword"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, reverse("home"))
