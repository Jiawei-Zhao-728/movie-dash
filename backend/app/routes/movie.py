from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..services.tmdb import TMDBService
from ..models import db, Favorite, Watchlist

bp = Blueprint('movies', __name__)

tmdb = TMDBService()

@bp.route('/movies/discover', methods=['GET'])
def discover_movies():
    try:
        page = request.args.get('page', 1, type=int)
        genres = request.args.get('genres', '')
        start_date = request.args.get('startDate', '')
        end_date = request.args.get('endDate', '')
        
        movies = tmdb.discover_movies(page, genres, start_date, end_date)
        return jsonify(movies)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    try:
        movie = tmdb.get_movie_details(movie_id)
        return jsonify(movie)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/movies/search', methods=['GET'])
def search_movies():
    try:
        query = request.args.get('query', '')
        page = request.args.get('page', 1, type=int)
        
        if not query:
            return jsonify({'error': 'Query parameter is required'}), 400
            
        results = tmdb.search_movies(query, page)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/movies/favorites', methods=['GET', 'POST', 'DELETE'])
@login_required
def handle_favorites():
    if request.method == 'GET':
        favorites = Favorite.query.filter_by(user_id=current_user.id).all()
        return jsonify([{
            'id': fav.movie_id,
            'added_at': fav.added_at.isoformat()
        } for fav in favorites])
        
    movie_id = request.json.get('movieId')
    if not movie_id:
        return jsonify({'error': 'Movie ID is required'}), 400
        
    if request.method == 'POST':
        try:
            favorite = Favorite(user_id=current_user.id, movie_id=movie_id)
            db.session.add(favorite)
            db.session.commit()
            return jsonify({'message': 'Movie added to favorites'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
            
    if request.method == 'DELETE':
        try:
            Favorite.query.filter_by(
                user_id=current_user.id,
                movie_id=movie_id
            ).delete()
            db.session.commit()
            return jsonify({'message': 'Movie removed from favorites'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@bp.route('/movies/watchlist', methods=['GET', 'POST', 'DELETE'])
@login_required
def handle_watchlist():
    if request.method == 'GET':
        watchlist = Watchlist.query.filter_by(user_id=current_user.id).all()
        return jsonify([
            {'id': item.movie_id, 'added_at': item.added_at.isoformat()} for item in watchlist
        ])

    movie_id = request.json.get('movieId')
    if not movie_id:
        return jsonify({'error': 'Movie ID is required'}), 400

    if request.method == 'POST':
        try:
            item = Watchlist(user_id=current_user.id, movie_id=movie_id)
            db.session.add(item)
            db.session.commit()
            return jsonify({'message': 'Movie added to watchlist'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    if request.method == 'DELETE':
        try:
            Watchlist.query.filter_by(
                user_id=current_user.id,
                movie_id=movie_id
            ).delete()
            db.session.commit()
            return jsonify({'message': 'Movie removed from watchlist'})
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500 