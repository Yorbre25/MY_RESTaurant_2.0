from google.cloud import pubsub_v1
import json

project_id = "my-rest-raurant-2"
topic_id = "restaurant_services_bus"

def publish(body,destiny):
    attributes={
    "destiny_service": destiny,
    }
    attributes = {str(k): str(v) for k, v in attributes.items()}
    # Create a publisher client
    publisher = pubsub_v1.PublisherClient()

    # Create the topic path
    topic_path = publisher.topic_path(project_id, topic_id)

    # Convert the JSON message to a string and then encode it into bytes
    data = json.dumps(body).encode("utf-8")

    # Publish the message
    future = publisher.publish(topic_path, data=data,**attributes)

    # Wait for the message to be published and get the message ID
    message_id = future.result()
    print(f"Published message ID: {message_id}")

    # Here, you can handle any further actions you want to take after publishing the message, such as processing responses from subscribers.

