from flask import jsonify, request
from . import bp
from flask_login import login_required, current_user
from ..models import User, db

@bp.route('/user/profile', methods=['GET'])
@login_required
def get_profile():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Not authenticated'}), 401
    
    return jsonify({
        'id': current_user.id,
        'email': current_user.email,
        'name': current_user.name,
        'picture': current_user.picture
    })

@bp.route('/user/preferences', methods=['GET', 'PUT'])
@login_required
def user_preferences():
    if request.method == 'GET':
        return jsonify(current_user.preferences or {})
    
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    try:
        current_user.preferences = data
        db.session.commit()
        return jsonify({'message': 'Preferences updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 