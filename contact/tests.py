from django.test import TestCase
from django.contrib.auth import get_user_model
from django.shortcuts import reverse


class ContactPageTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="admin", password="testpassword"
        )
        self.client.force_login(self.user)

    def test_url_exists_at_correct_location(self):
        response = self.client.get("/contact/")
        self.assertEqual(response.status_code, 200)

    def test_contact_view_name(self):
        response = self.client.get(reverse("contact"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "contact/contact.html")

    def test_sumbitting_data(self):
        response = self.client.post(reverse("contact"),
                                    {"name": "testname",
                                     "email": "testname@example.com",
                                     "message": "Test message"})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "contact/error.html")
