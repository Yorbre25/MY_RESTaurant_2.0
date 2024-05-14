import pymysql
import os
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, time

app = Flask(__name__)

def revisar_disponibilidad_aux(fecha):
    # Configuración de la conexión a la base de datos
    connection_name = "my-rest-raurant-2:us-central1:myrestdb"
    db_user = "usuario"
    db_password = "contra"
    db_name = "restaurant_reservations"
    
    # Usamos pymysql para conectar a Cloud SQL
    conn = pymysql.connect(unix_socket=f'/cloudsql/{connection_name}', user=db_user, password=db_password, database=db_name,cursorclass=pymysql.cursors.DictCursor)
    
    try:
        with conn.cursor() as cursor:
            # Insertamos la nueva reserva
            sql = "SELECT * from reservations WHERE Date=%s"
            cursor.execute(sql, (fecha,))
            reservations = cursor.fetchall()

            restInfo = "SELECT * from restaurant_info WHERE restID=1"
            cursor.execute(restInfo)
            rest_info = cursor.fetchone()  # Fetch only one row

            capacity = rest_info['capacity']
            open_time_str = rest_info['openTime']
            closing_time_str = rest_info['closingTime']

            # Convertir openTime y closingTime a objetos time de Python
            open_time = datetime.strptime(open_time_str, "%H:%M:%S").time()
            closing_time = datetime.strptime(closing_time_str, "%H:%M:%S").time()

            available_capacity = {}

            current_time = open_time
            while current_time <= closing_time:
                available_capacity[current_time.strftime("%H:%M:%S")] = capacity
                current_time_minutes = current_time.hour * 60 + current_time.minute
                current_time_minutes += 120  # Add 120 minutes (2 hours)
                current_time = time(current_time_minutes // 60, current_time_minutes % 60)  # Convert back to hours and minutes
            
            for reservation in reservations:
                time = reservation["Time"]
                number_of_people = reservation["Number_of_people"]
                available_capacity[time] -= number_of_people
            
            available_times = [time for time, capacity in available_capacity.items() if capacity >= 0]

            response = jsonify(available_times)

            return response, 200, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return str(e), 500
    finally:
        conn.close()

@app.route('/revisar_disponibilidad', methods=['POST'])
def revisar_disponibilidad(request):
    request_json = request.get_json(silent=True)
    fecha = request_json['Date']

    return revisar_disponibilidad_aux(fecha)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
