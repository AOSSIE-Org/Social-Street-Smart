try:
    from app import app
    import unittest
except Exception as e:
    print("Some Modules are missing {}".format(e))

class ShcTest(unittest.TestCase):

    #check for response 200
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get("/")
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)

    #check if content return is application/json
    def test_return_type(self):
        tester = app.test_client(self)
        response = tester.get("/")
        self.assertEqual(response.content_type, "application/json")

    #check for Data returned
    def test_data_content(self):
        tester = app.test_client(self)
        response = tester.get("/")
        self.assertTrue(b'Title' in response.data)



if __name__ == "__main__":
    unittest.main()