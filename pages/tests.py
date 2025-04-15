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


class ClimbingPageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/climbing/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(reverse("climbing"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/climbing.html")


class PineapplePageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/pineapple/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(reverse("pineapple_poker"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/pineapple.html")


class PrimePhotoPageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/prime/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(reverse("prime_photo"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/prime_photo.html")


class ProfessionalPageTests(TestCase):
    def setUp(self):
        loginSetup(self)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/professional/")
        self.assertEqual(response.status_code, 200)

    def test_view_name(self):
        response = self.client.get(reverse("professional"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/professional.html")
