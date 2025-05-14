from django.test import TestCase
from django.contrib.auth import get_user_model
from django.shortcuts import reverse


def loginSetup(test_case):
    User = get_user_model()
    test_case.user = User.objects.create_user(
        username="admin", password="testpassword"
    )
    test_case.client.force_login(test_case.user)


class HomePageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/home.html")