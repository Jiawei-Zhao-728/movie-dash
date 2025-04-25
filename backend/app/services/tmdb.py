import os
import requests
from flask import current_app

class TMDBService:
    def __init__(self):
        self.base_url = 'https://api.themoviedb.org/3'
        self.api_key = os.getenv('TMDB_API_KEY')
        
    def _make_request(self, endpoint, params=None):
        """Make a request to TMDB API."""
        if params is None:
            params = {}
        params['api_key'] = self.api_key
        
        try:
            response = requests.get(f'{self.base_url}{endpoint}', params=params)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            current_app.logger.error(f'TMDB API error: {str(e)}')
            raise
    
    def discover_movies(self, page=1, genres='', start_date='', end_date=''):
        """Discover movies based on various criteria."""
        params = {
            'page': page,
            'sort_by': 'popularity.desc',
            'include_adult': False,
            'include_video': False
        }
        
        if genres:
            params['with_genres'] = genres
        if start_date:
            params['primary_release_date.gte'] = start_date
        if end_date:
            params['primary_release_date.lte'] = end_date
            
        return self._make_request('/discover/movie', params)
    
    def get_movie_details(self, movie_id):
        """Get detailed information about a specific movie."""
        return self._make_request(f'/movie/{movie_id}')
    
    def search_movies(self, query, page=1):
        """Search for movies by title."""
        params = {
            'query': query,
            'page': page
        }
        return self._make_request('/search/movie', params) 