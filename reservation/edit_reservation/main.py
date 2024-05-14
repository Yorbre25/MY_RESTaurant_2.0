import pymysql
import os
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def editar_reserva_aux(id_reserva, id_cliente, fecha, hora, numero_de_personas):
    # Configuración de la conexión a la base de datos
    connection_name = "my-rest-raurant-2:us-central1:myrestdb"
    db_user = "usuario"
    db_password = "contra"
    db_name = "restaurant_reservations"
    
    # Usamos pymysql para conectar a Cloud SQL
    conn = pymysql.connect(unix_socket=f'/cloudsql/{connection_name}', user=db_user, password=db_password, database=db_name)
    
    try:
        with conn.cursor() as cursor:
            # Insertamos la nueva reserva
            sql = "UPDATE reservations SET USER_ID=%s, Date=%s, Time=%s, Number_of_people=%s WHERE ID=%s"
            cursor.execute(sql, (id_cliente, fecha, hora, numero_de_personas, id_reserva))
            conn.commit()
            
            return jsonify("Message:",'Reserva editada con éxito'), 200, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return jsonify("Message:", str(e)), 500
    finally:
        conn.close()

@app.route('/editar_reserva', methods=['POST'])
def editar_reserva(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers) 
    request_json = request.get_json(silent=True)
    id_reserva = request_json['ID']    
    id_cliente = request_json['USER_ID']
    fecha = request_json['Date']
    hora = request_json['Time']
    numero_de_personas = request_json['Number_of_people']

    return editar_reserva_aux(id_reserva, id_cliente, fecha, hora, numero_de_personas)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
