import pickle
import numpy as np

with open('app/recommendation_model/movie_df.pkl', 'rb') as f:
    movie_df = pickle.load(f)   

with open('app/recommendation_model/vector.pkl', 'rb') as f:
    vector = pickle.load(f)

def recommand_top_6(movie):
    movie_index = movie_df[movie_df['title'] == movie].index[0]
    distances = vector[movie_index]
    top_indices = np.argsort(distances)[::-1][1:7]
    return movie_df.iloc[top_indices]['id'].tolist()

def recommand_top_7_to_12(movie):
    movie_position = movie_df[movie_df['title'] == movie].index[0]
    distances = vector[movie_position]
    
    top_positions = np.argsort(distances)[::-1][7:13]
    
    # Return the movie IDs instead of positions
    return movie_df.iloc[top_positions]['id'].tolist()

def recommand_sample_30():
    movie_list = movie_df.sample(30)['id'].values.tolist()
    return movie_list