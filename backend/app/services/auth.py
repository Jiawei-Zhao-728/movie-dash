import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from flask import url_for, current_app

def get_google_auth_url():
    """Generate Google OAuth2 authorization URL."""
    flow = Flow.from_client_secrets_file(
        'client_secrets.json',
        scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 
                'https://www.googleapis.com/auth/userinfo.profile'],
        redirect_uri=url_for('main.google_callback', _external=True)
    )
    
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    
    return authorization_url

def verify_token(token):
    """Verify the OAuth token and return user information."""
    try:
        credentials = Credentials(
            token=token,
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 
                   'https://www.googleapis.com/auth/userinfo.profile']
        )
        
        if not credentials.valid:
            if credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
                
        return {
            'valid': credentials.valid,
            'expired': credentials.expired,
            'scopes': credentials.scopes
        }
    except Exception as e:
        current_app.logger.error(f'Token verification error: {str(e)}')
        return None 