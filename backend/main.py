import logging
from flask import Flask, jsonify, request
import flask_cors
from google.appengine.ext import ndb
import google.auth.transport.requests
import google.oauth2.id_token
import requests_toolbelt.adapters.appengine

requests_toolbelt.adapters.appengine.monkeypatch()
HTTP_REQUEST = google.auth.transport.requests.Request()

app = Flask(__name__)
flask_cors.CORS(app)

class Document(ndb.Model):
    docId = ndb.StringProperty()
    document = ndb.StringProperty()
    date = ndb.StringProperty()
    sources = ndb.StringProperty(repeated=True)
    created = ndb.DateTimeProperty(auto_now_add=True)

def query_database(user_id):
    ancestor_key = ndb.Key(Document, user_id)
    query = Document.query(ancestor=ancestor_key).order(-Document.created)
    docs = query.fetch()

    data = []

    for doc in docs:
        data.append({
            'docId': str(doc.key),
            'document': doc.document,
            'date': doc.date,
            'sources': doc.sources
        })
    
    return data

@app.route('/documents', methods=['GET'])
def get_docs():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401

    documents = query_database(claims['sub'])
    return jsonify(documents)

@app.route('/documents', methods=['POST', 'PUT'])
def add_doc():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    
    data = request.get_json()

    doc = Document(
        parent = ndb.Key(Document, claims['sub']),
        document = data['document'],
        date = data['date'],
        sources = data['sources']
    )
    doc.put()
    return 'OK', 200

@app.route('/saveSources', methods=['POST', 'PUT'])
def save_source():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    
    data = request.get_json()
    id = data['id']
    idContents = id[4:-1]
    args = idContents.split(', ')

    args[3] = int(args[3])

    for i in range(len(args)-1):
        args[i] = args[i].strip("'")

    doc = ndb.Key(*args).get()
    doc.sources = data['sources']
    doc.put()
    
    return 'OK', 200

@app.route('/addSource', methods=['POST', 'PUT'])
def add_source():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    
    data = request.get_json()
    id = data['id']
    idContents = id[4:-1]
    args = idContents.split(', ')

    args[3] = int(args[3])

    for i in range(len(args)-1):
        args[i] = args[i].strip("'")

    doc = ndb.Key(*args).get()
    doc.sources.append(data['newSource'])
    doc.put()
    
    return 'OK', 200

@app.route('/deleteDoc', methods=['POST', 'PUT'])
def delete_doc():
    id_token = request.headers['Authorization'].split(' ').pop()
    claims = google.oauth2.id_token.verify_firebase_token(id_token, HTTP_REQUEST)
    if not claims:
        return 'Unauthorized', 401
    
    data = request.get_json()
    id = data['docId']
    idContents = id[4:-1]
    args = idContents.split(', ')

    args[3] = int(args[3])

    for i in range(len(args)-1):
        args[i] = args[i].strip("'")
    
    ndb.Key(*args).delete()

    return 'OK', 200

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500