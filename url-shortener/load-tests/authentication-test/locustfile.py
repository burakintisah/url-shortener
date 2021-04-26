from faker import Faker
from locust import HttpUser, task, between
import random

class LoadTest(HttpUser):
    f = Faker()
    wait_time = between(1, 1.5)
    host = 'https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/api'
    token = None
    header = {'Content-Type': 'application/json'}
    shorted_urls = []
    cdn_url = "https://d36euqp7ddsjbp.cloudfront.net"
    user_id = "e8d4071a-3da6-49f1-9278-aa3ed1ea5229"

    users = []

    def on_start(self):
        self.signup()

    @task(1)
    def signup(self):
        user = {"username": self.f.name(), "password": self.f.pystr(min_chars=3, max_chars=8),
                "email": self.f.ascii_email()}
        self.users.append(user)
        self.client.put("/signup", json=user, headers=self.header, name="sign-up")

    @task(8)
    def login(self):
        random_user = random.choice(self.users)
        user = {"username": random_user["username"],
                "password": random_user["password"]}
        self.client.post('/signin', json=user, name="sign-in")
