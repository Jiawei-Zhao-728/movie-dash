from flask import Blueprint, request, jsonify, current_app, url_for, session
from google.oauth2 import id_token
from google.auth.transport import requests
from google_auth_oauthlib.flow import Flow
from app.models import User, db
import jwt
from datetime import datetime, timedelta
import json
import requests as http_requests
import os

bp = Blueprint('auth', __name__)

# Define OAuth2 scopes consistently
SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid'
]

def create_flow():
    """Create OAuth2 flow instance"""
    return Flow.from_client_config(
        {
            "web": {
                "client_id": current_app.config['GOOGLE_CLIENT_ID'],
                "client_secret": current_app.config['GOOGLE_CLIENT_SECRET'],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES
    )

@bp.route('/auth/google/url')
def get_google_auth_url():
    """Get the Google OAuth URL"""
    # Use the same host as the request
    host = request.headers.get('Host', '127.0.0.1:5000')
    redirect_uri = f'http://{host}/auth/google/callback'
    
    flow = create_flow()
    flow.redirect_uri = redirect_uri
    
    # Generate authorization URL
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    
    # Store state in session
    session['oauth_state'] = state
    
    return jsonify({'url': authorization_url})

@bp.route('/auth/google/callback')
def google_auth_callback():
    """Handle Google OAuth callback"""
    try:
        # Get the authorization code
        code = request.args.get('code')
        state = request.args.get('state')
        
        # Verify state matches
        if state != session.get('oauth_state'):
            raise ValueError("State mismatch")
            
        # Use the same host as the request for the redirect URI
        host = request.headers.get('Host', '127.0.0.1:5000')
        redirect_uri = f'http://{host}/auth/google/callback'
        
        # Set up flow
        flow = create_flow()
        flow.redirect_uri = redirect_uri
        
        # Exchange code for tokens
        flow.fetch_token(
            authorization_response=request.url,
            code=code
        )
        
        # Get credentials and ID token
        credentials = flow.credentials
        id_info = id_token.verify_oauth2_token(
            credentials.id_token,
            requests.Request(),
            current_app.config['GOOGLE_CLIENT_ID']
        )
        
        # Find or create user
        user = User.query.filter_by(google_id=id_info['sub']).first()
        if not user:
            user = User(
                email=id_info['email'],
                google_id=id_info['sub'],
                username=id_info.get('name', '')
            )
            db.session.add(user)
            db.session.commit()

        # Create JWT token
        token = create_jwt_token(user)
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })

    except Exception as e:
        current_app.logger.error(f"Auth callback error: {str(e)}")
        return jsonify({'error': str(e)}), 400

@bp.route('/auth/verify')
def verify_token():
    """Verify JWT token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(
            token, 
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        user = User.query.get(payload['user_id'])
        if not user:
            raise ValueError('User not found')
            
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })
    except Exception as e:
        return jsonify({'error': 'Invalid token'}), 401

@bp.route('/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

def create_jwt_token(user):
    """Create a JWT token for the user"""
    payload = {
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
    }
    return jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    ) 