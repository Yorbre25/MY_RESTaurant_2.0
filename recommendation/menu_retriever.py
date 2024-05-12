import uuid
from send_msg import publish
from receive_msg import pull_suscriber


def request_restaurant_menu():
    request_id=str(uuid.uuid4())
    request_body={
        "dst":"menu_service",
        "src":"backend",
        "flow_id":request_id
    }
    publish(request_body,request_body['dst'])
    my_pull=pull_suscriber(request_body['src'],request_body['dst'],request_id)
    my_pull.listen()
    body,error_code,CORS=my_pull.get_response()
    

    return body,error_code

def build_format(menu_json):
    main_dishes=menu_json["main_dishes"]
    drinks=menu_json["drinks"]
    desserts=menu_json["desserts"]
    formated_menu=[]
    for i in range(len(main_dishes)):
        meal={
            "main_dish":main_dishes[i],
            "drink":drinks[i],
            "dessert":desserts[i]
        }
        formated_menu.append(meal)
    return formated_menu

def get_menu():
    menu,status_code=request_restaurant_menu()
    if(status_code!=200):
        return []
    formatted_menu=build_format(menu)
    return formatted_menu
