from faker import Faker
from locust import HttpUser, task, between
import random

class LoadTest(HttpUser):
    f = Faker()
    wait_time = between(0.2, 1)
    host = 'https://83y4xh3vj5.execute-api.eu-central-1.amazonaws.com/api'
    token = None
    shorted_urls = []
    cdn_url = "https://d36euqp7ddsjbp.cloudfront.net"
    user_id = "e8d4071a-3da6-49f1-9278-aa3ed1ea5229"
    auth_token = ""

    urls = [
        "https://aws.amazon.com/tr/blogs/compute/load-testing-a-web-applications-serverless-backend/",
        "https://www.udemy.com/course/aws-lambda-serverless-architecture/?utm_source=adwords&utm_medium=udemyads&utm_campaign=LongTail_la.EN_cc.ROW&utm_content=deal4584&utm_term=_._ag_77879424134_._ad_437497333830_._kw__._de_c_._dm__._pl__._ti_dsa-1007766171312_._li_1012763_._pd__._&matchtype=b&gclid=CjwKCAjwxuuCBhATEiwAIIIz0Usw45nXpTrTyKN9YFH0iAElZH5JSgX1MwhyRTN-p7dg384SYQHQLhoCIrgQAvD_BwE",
        "https://careers.google.com/jobs/results/140314437895496390-software-engineer-university-graduate-2021/?q=new%20grad",
        "https://www.researchgate.net/publication/344675044_TOOLS_PROCESSES_AND_FACTORS_INFLUENCING_OF_CODE_REVIEW",
        "https://stars.bilkent.edu.tr/",
        "https://www.linkedin.com/pulse/microservice-communication-arpit-jain/",
        "https://github.com/chaoss/grimoirelab-perceval/blob/master/perceval/backends/core/jira.py",
        "https://twitter.com/arkeolojidnyasi/status/1322613238060720128?s=19&fbclid=IwAR0I9x9p8OirOVlJONxNyIfdjttjNgfzwgCjqej5-eGtJKqzuKk4L0zA1s8",
        "https://docs.locust.io/en/stable/quickstart.html#locust-s-web-interface",
        "https://github.com/locustio/locust/tree/master/examples/custom_shape",
        "https://github.com/powsybl/powsybl-single-line-diagram/tree/master/single-line-diagram-cgmes/single-line-diagram-cgmes-dl-conversion",
        "https://github.com/odayibas/CS443",
        "https://en.wikipedia.org/wiki/URL_shortening",
        "https://adriennedomingus.medium.com/load-testing-with-locust-14d4236373f9",
        "https://www.blazemeter.com/blog/open-source-load-testing-tools-which-one-should-you-use",
    ]

    def on_start(self):
        response = self.client.post("/signin", json={"username": "aybuke", "password": "aaaaaa"}, name="sign-in")
        self.auth_token = response.json().get("token")
        self.shorten_url()


    @task(1)
    def shorten_url(self):
        header = {'Content-Type': 'application/json', 'Authorization': self.auth_token}
        response = self.client.post("/create/", json={'long_url': random.choice(self.urls)}, headers=header, name="create-url")
        self.shorted_urls.append(response.json().get('short_id'))

    @task(1)
    def shorten_url_custom(self):
        custom_url = self.f.random_letters(length=6)
        header = {'Content-Type': 'application/json', 'Authorization': self.auth_token}
        response = self.client.post("/create/", json={'long_url': random.choice(self.urls),
                                                      'custom_url': custom_url}, headers=header, name="create-custom-url")
        self.shorted_urls.append(response.json().get('short_id'))

    @task(4)
    def redirect_aws(self):
        header = {'Content-Type': 'application/json', 'Authorization': self.auth_token}
        if len(self.shorted_urls) == 0:
            self.shorten_url()
        else:
            url = random.choice(self.shorted_urls)
            self.client.headers['Referer'] = self.client.base_url
            self.client.get('/t/%s' % url, headers=header, name="redirect", allow_redirects=False)

    @task(8)
    def get_urls(self):
        header = {'Content-Type': 'application/json', 'Authorization': self.auth_token}
        self.client.get('/users/%s/links' % self.user_id, headers=header, name="get-user-links")

"""
    @task(4)
    def redirect_cdn(self):
        header = {'Content-Type': 'application/json', 'Authorization': self.auth_token}
        if len(self.shorted_urls) == 0:
            self.shorten_url()
        else:
            url = random.choice(self.shorted_urls)
            self.client.headers['Referer'] = self.cdn_url
            self.client.get('/t/%s' % url, headers=header, name="cloud-front-redirect", allow_redirects=False)
"""

