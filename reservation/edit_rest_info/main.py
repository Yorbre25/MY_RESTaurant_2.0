import pymysql
import os
from flask import Flask, request,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def editar_rest_aux(rest_id, openTime, closingTime, capacity):
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
            sql = "UPDATE restaurant_info SET openTime=%s, closingTime=%s, capacity=%s WHERE restID=%s"
            cursor.execute(sql, (openTime, closingTime, capacity, rest_id))
            conn.commit()
            
            return jsonify("Message:",'Informacion editada con éxito'), 200, {'Access-Control-Allow-Origin': '*'}
    except Exception as e:
        return jsonify("Message:", str(e)), 500
    finally:
        conn.close()

@app.route('/editar_rest', methods=['POST'])
def editar_rest(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers) 
    request_json = request.get_json(silent=True)
    id_rest = request_json['REST_ID']    
    openTime = request_json['openTime']
    closingTime = request_json['closingTime']
    capacity = request_json['capacity']

    return editar_rest_aux(id_rest, openTime, closingTime, capacity)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
