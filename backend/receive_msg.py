from concurrent.futures import TimeoutError
from google.cloud import pubsub_v1
import json

src_tag="src"
id_tag="flow_id"
class pull_suscriber:
 
    def __init__(self,suscription_id,sender,id):
        self.project_id = "my-rest-raurant-2"
        self.suscription_id=suscription_id
        self.timeout = 30
        self.sender=sender
        self.id=id

        self.match_message=None
        self.streaming_pull_future=None

        self.subscriber = pubsub_v1.SubscriberClient()
        self.subscription_path = self.subscriber.subscription_path(self.project_id, self.suscription_id)


    def callback(self,message: pubsub_v1.subscriber.message.Message) -> None:
        print(f"Received {message.data!r}.")
        message_data = message.data.decode('utf-8')
        json_body=json.loads(message_data)
        if json_body[src_tag]==self.sender and json_body[id_tag]==self.id:
            self.match_message=json_body
            message.ack()
            self.streaming_pull_future.cancel()

    def listen(self):
        self.streaming_pull_future = self.subscriber.subscribe(self.subscription_path, callback=self.callback)
        print(f"Listening for messages on {self.subscription_path}..\n")

        # Wrap subscriber in a 'with' block to automatically call close() when done.
        with self.subscriber:
            try:
                # When `timeout` is not set, result() will block indefinitely,
                # unless an exception is encountered first.
                self.streaming_pull_future.result(timeout=self.timeout)
            except TimeoutError:
                self.streaming_pull_future.cancel()  # Trigger the shutdown.
                self.streaming_pull_future.result()  # Block until the shutdown is complete.
        return self.match_message
    
    def get_response(self):
        if(self.match_message==None):
            error_msg={
                "msg": "the request has timeout"
            }
            return error_msg, 408, {'Access-Control-Allow-Origin': '*'}
        elif "error" in self.match_message:
            return self.match_message,self.match_message['error'], {'Access-Control-Allow-Origin': '*'}
        else:
            return self.match_message,200, {'Access-Control-Allow-Origin': '*'}       

