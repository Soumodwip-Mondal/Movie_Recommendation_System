import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
movies_df = pd.read_csv('C:/Users/msoum/Desktop/Movie_Remommendation_System/Recommendation_System/backend/app/recommendation_model/movie_df.csv')
cv = CountVectorizer()
vectors = cv.fit_transform(movies_df['tags']).toarray()
cos = cosine_similarity(vectors)

# Function to randomly sample 30 movies (by id)
def sample_30():
    arr = movies_df.sample(30)
    sample_ids = arr['id'].tolist()
    return sample_ids

# Function to recommend top 6 similar movies by id
def recommand_top_6(movie):
    # Convert to lowercase for case-insensitive search
    movies_df['title_lower'] = movies_df['title'].str.lower()
    movie = movie.lower()

    # Check if movie exists
    if movie not in movies_df['title_lower'].values:
        return {"error": f"'{movie}' not found in dataset."}

    # Find index
    movie_index = movies_df[movies_df['title_lower'] == movie].index[0]

    # Get cosine similarity distances
    distances = cos[movie_index]
    top_indices = np.argsort(distances)[::-1][1:7]

    #  Return movie IDs 
    recommended_ids = movies_df.iloc[top_indices]['id'].tolist()
    return recommended_ids

# Function to recommend movies ranked 7 to 12 by id
def recommand_top_7_to_12(movie):
    movies_df['title_lower'] = movies_df['title'].str.lower()
    movie = movie.lower()

    if movie not in movies_df['title_lower'].values:
        return {"error": f"'{movie}' not found in dataset."}

    movie_index = movies_df[movies_df['title_lower'] == movie].index[0]
    distances = cos[movie_index]
    top_indices = np.argsort(distances)[::-1][7:13]

    recommended_ids = movies_df.iloc[top_indices]['id'].tolist()
    return recommended_ids