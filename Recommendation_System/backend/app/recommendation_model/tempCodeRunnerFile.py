with open('movie_df.pkl', 'rb') as f:
#     movie_df = pickle.load(f)   
# with open('vector.pkl', 'rb') as f:
#     vector = pickle.load(f)
# def recommand_top_6(movie):
#     movie_index = movie_df[movie_df['title'] == movie].index[0]
#     distances = vector[movie_index]
#     # Get indices of movies sorted by similarity (highest first)
#     top_indices = np.argsort(distances)[::-1][1:7]  # Exclude the movie itself
#     return top_indices
# def recommand_top_7_to_12(movie):
#     movie_index = movie_df[movie_df['title'] == movie].index[0]
#     distances = vector[movie_index]
#     # Get indices of movies sorted by similarity (highest first)
#     top_indices = np.argsort(distances)[::-1][7:13]  # Exclude the movie itself
#     return top_indices
# def recommand_sample_30():
#     movie_list=movie_df.sample(30)['id'].values.tolist()
#     return movie_list